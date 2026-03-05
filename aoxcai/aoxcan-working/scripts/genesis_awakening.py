import os
import torch
import sys
import json
import logging
from datetime import datetime
from transformers import (
    AutoModelForCausalLM, 
    AutoTokenizer, 
    TrainingArguments, 
    Trainer, 
    DataCollatorForLanguageModeling,
    TrainerCallback
)
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, TaskType

# --- [🆔 SOVEREIGN IDENTITY - UPDATED] ---
# Görseldeki gibi: AOXCAN-XLY-OKB-001
MODEL_IDENTITY = "AOXCAN-XLY-OKB-001-GENESIS"
TIMESTAMP = datetime.now().strftime("%Y%m%d")

# --- [⚠️ STABILIZATION SHIELD] ---
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
logging.getLogger("transformers").setLevel(logging.ERROR)

# --- [📂 PATH CONFIGURATION] ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(SCRIPT_DIR)
TOKENIZER_DIR = os.path.join(SCRIPT_DIR, "aoxcan_tokenizer")
BASE_MODEL_PATH = os.path.join(BASE_DIR, "model_hub")
DATA_SOURCE = os.path.join(SCRIPT_DIR, "data/master_train_sovereign_v18.jsonl")
# Çıktı klasörü artık yeni kimliği taşıyor
OUTPUT_DIR = os.path.join(BASE_DIR, f"outputs/{MODEL_IDENTITY}")

class AgileGuardianBar(TrainerCallback):
    """Custom Visual Progress Bar for AOXCAN-XLY-OKB-001."""
    def on_step_end(self, args, state, control, **kwargs):
        if state.max_steps > 0:
            percent = (state.global_step / state.max_steps) * 100
            filled = int(40 * state.global_step // state.max_steps)
            bar = '█' * filled + '░' * (40 - filled)
            sys.stdout.write(f'\r\033[1;32m[GUARDIAN-PROGRESS] \033[1;36m{bar} \033[1;33m{percent:>6.2f}% \033[1;34mStep: {state.global_step}/{state.max_steps}\033[0m')
            sys.stdout.flush()

def sovereign_banner():
    os.system('clear')
    print("\033[1;33m" + "╔" + "═"*73 + "╗")
    print(r"║   █████╗  ██████╗ ██╗  ██╗ ██████╗  █████╗  ███╗   ██╗ [OKB-001]    ║")
    print(r"║  ██╔══██╗██╔═══██╗╚██╗██╔╝██╔════╝ ██╔══██╗ ████╗  ██║  AGILE       ║")
    print(r"║  ███████║██║   ██║ ╚███╔╝ ██║      ███████║ ██╔██╗ ██║  GUARDIAN    ║")
    print(r"║  ██╔══██║██║   ██║ ██╔██╗ ██║      ██╔══██║ ██║╚██╗██║              ║")
    print(r"║  ██║  ██║╚██████╔╝██╔╝ ██╗╚██████╗ ██║  ██║ ██║ ╚████║  GENESIS     ║")
    print(r"║  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝  X-LAYER     ║")
    print("╠" + "═"*73 + "╣")
    print("\033[1;32m" + f"║      [ PHASE: NEURAL IGNITION | {MODEL_IDENTITY} ]       ║" + "\033[1;33m")
    print("╚" + "═"*73 + "╝" + "\033[0m")
    print(f"\033[1;34m" + "─"*75 + "\033[0m\n")

sovereign_banner()

# --- [🔥 THE NEURAL RECONSTRUCTION] ---
print("\033[1;34m[*] Loading Neural Sovereignty Dialect...\033[0m")
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_DIR, local_files_only=True)
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL_PATH,
    torch_dtype=torch.float32,
    device_map={"": "cpu"},
    trust_remote_code=True,
    local_files_only=True
)

model.resize_token_embeddings(len(tokenizer))
lora_config = LoraConfig(
    r=32, lora_alpha=64,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    task_type=TaskType.CAUSAL_LM
)
model = get_peft_model(model, lora_config)
model.gradient_checkpointing_enable()

# --- [📚 DATASET PREPARATION] ---
print("\033[1;34m[*] Pre-processing 613 Sovereign Components...\033[0m")
dataset = load_dataset("json", data_files=DATA_SOURCE, split="train")

def tokenize_function(examples):
    return tokenizer(examples["text"], truncation=True, max_length=256, padding="max_length")

tokenized_dataset = dataset.map(tokenize_function, batched=True, remove_columns=["text"], desc="Ethics Mapping")

# --- [🚀 TRAINING ENGINE] ---
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=8, 
    num_train_epochs=6,           
    learning_rate=1e-4,           
    logging_steps=1,
    save_strategy="epoch",        
    report_to="none",
    use_cpu=True,
    disable_tqdm=True, 
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False),
    callbacks=[AgileGuardianBar()] 
)

print(f"\n\033[1;31m🔥 [IGNITION] Launching {MODEL_IDENTITY} Synthesis...\033[0m\n")

try:
    trainer.train()
    print(f"\n\n\033[1;34m[*] Sealing Agile Guardian at: {OUTPUT_DIR}\033[0m")
    trainer.save_model(OUTPUT_DIR)
    tokenizer.save_pretrained(OUTPUT_DIR)
    
    # Manifest Dosyası Oluşturma
    manifest = {
        "model_id": MODEL_IDENTITY,
        "type": "Agile Guardian",
        "status": "SOVEREIGN_AWAKENED",
        "timestamp": TIMESTAMP
    }
    with open(os.path.join(OUTPUT_DIR, "GUARDIAN_MANIFEST.json"), "w") as f:
        json.dump(manifest, f, indent=4)
        
    print(f"\033[1;32m✅ [SUCCESS] {MODEL_IDENTITY} IS ACTIVE AND SECURE.\033[0m")
except KeyboardInterrupt:
    print(f"\n\n\033[1;33m⚠️ Emergency shutdown. Guardian core not sealed.\033[0m")
except Exception as e:
    print(f"\n\033[1;31m❌ [CRITICAL] Ignition failed: {str(e)}\033[0m")
