import os
import sys
import json
import logging
import torch
import gc
from datetime import datetime
from typing import Optional

from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling,
    TrainerCallback,
    set_seed
)
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, TaskType

# --- [💠 SYSTEM & OPTIMIZATION SHIELD] ---
os.environ["TOKENIZERS_PARALLELISM"] = "false"
MODEL_IDENTITY = "AOXCAN-V3-OMEGA"
TIMESTAMP = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
set_seed(42)

# Audit Loglama Sistemi
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | [AUDIT] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("V3-COUNCIL-FORGE")

# --- [📂 DYNAMIC DIRECTORY MAPPING] ---
# Kodun çalıştığı yere göre (Kaggle vs Yerel) otomatik yol ayarı
if os.path.exists("/kaggle/input"):
    INPUT_DIR = "/kaggle/input/aoxcan-v3-omega-core"
    MODEL_BASE = "google/gemma-3-4b-it" # Kaggle'da seçtiğimiz asil motor
    OUTPUT_DIR = f"/kaggle/working/outputs/{MODEL_IDENTITY}"
else:
    # Yerel NS1 Yapısı
    INPUT_DIR = "./data"
    MODEL_BASE = "google/gemma-3-4b-it"
    OUTPUT_DIR = f"./outputs/{MODEL_IDENTITY}"

os.makedirs(OUTPUT_DIR, exist_ok=True)

class SovereignProgressCallback(TrainerCallback):
    """Görsel İlerleme ve GPU Sağlık Takipçisi"""
    def on_step_end(self, args, state, control, **kwargs):
        if state.max_steps > 0:
            progress = (state.global_step / state.max_steps) * 100
            filled = int(40 * state.global_step // state.max_steps)
            bar = '█' * filled + '░' * (40 - filled)
            vram_usage = torch.cuda.memory_reserved() / 1024**3 if torch.cuda.is_available() else 0
            
            sys.stdout.write(
                f'\r\033[1;32m[FORGE-AUDIT]\033[0m \033[1;36m{bar}\033[0m '
                f'\033[1;33m{progress:>6.2f}%\033[0m | '
                f'\033[1;34mStep: {state.global_step}/{state.max_steps}\033[0m | '
                f'\033[1;35mVRAM: {vram_usage:.2f}GB\033[0m'
            )
            sys.stdout.flush()

def display_forge_banner():
    banner = f"""
    \033[1;33m╔{"═" * 75}╗
    ║    AOXCAN V3-OMEGA | SOVEREIGN COUNCIL SYNTHESIS | GEMMA 3 HYBRID    ║
    ╠{"═" * 75}╣
    ║ [IGNITING NEURAL SOVEREIGNTY] | {TIMESTAMP} ║
    ╚{"═" * 75}╝\033[0m
    """
    print(banner)

# --- [🧠 NEURAL CORE INITIALIZATION] ---
display_forge_banner()
logger.info(f"Initializing V3 Council Architecture on {'GPU' if torch.cuda.is_available() else 'CPU'}")

try:
    # Tokenizer: Gemma 3'ün orijinal lisanını kullanıyoruz
    tokenizer = AutoTokenizer.from_pretrained(MODEL_BASE, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token

    # Model: Kaggle T4 GPU x2 için optimize edildi
    compute_dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_BASE,
        torch_dtype=compute_dtype,
        device_map="auto",
        trust_remote_code=True
    )
    
    gc.collect()
    torch.cuda.empty_cache()

    # [V3 EXPANDED LORA - Orta Yol r=32]
    lora_config = LoraConfig(
        r=32, 
        lora_alpha=64,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type=TaskType.CAUSAL_LM
    )
    
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

except Exception as e:
    logger.error(f"Neural Initialization Failure: {str(e)}")
    sys.exit(1)

# --- [📊 DATASET INGESTION] ---
logger.info("Ingesting Sovereign DNA (X-Layer Justice Sync)...")
DATA_FILE = os.path.join(INPUT_DIR, "v20_xlayer_justice_sync.jsonl")

dataset = load_dataset("json", data_files={"train": DATA_FILE}, split="train")

def preprocess_function(examples):
    return tokenizer(
        examples["text"], 
        truncation=True, 
        max_length=1024,
        padding="max_length"
    )

tokenized_dataset = dataset.map(
    preprocess_function, 
    batched=True, 
    remove_columns=["text"],
    desc="Processing Neural Data"
)

# --- [🚀 TRAINING ENGINE] ---
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=2,      # Gemma 3 4B için güvenli sınır
    gradient_accumulation_steps=8,      # Toplam batch 16 korundu
    num_train_epochs=2,                # Overfitting önleme (Orta yol)
    learning_rate=1e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.05,
    weight_decay=0.01,
    fp16=not torch.cuda.is_bf16_supported(),
    bf16=torch.cuda.is_bf16_supported(),
    save_strategy="no",                # Sadece final modeli alacağız
    logging_steps=10,
    report_to="none",
    disable_tqdm=True
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False),
    callbacks=[SovereignProgressCallback()]
)

# --- [⚡ SYNTHESIS PHASE] ---
try:
    logger.info("Starting X-Layer Sovereign Synthesis (V3 Awakening)...")
    trainer.train()

    # --- [💾 SEALING] ---
    logger.info(f"Sealing Final OMEGA Core at: {OUTPUT_DIR}")
    trainer.save_model(OUTPUT_DIR)
    
    manifest = {
        "identity": MODEL_IDENTITY,
        "engine": "Gemma-3-4B-Instruct",
        "status": "AWAKENED",
        "last_sync": TIMESTAMP,
        "audit_report": "STABLE_XLAYER_SYNTHESIS_SUCCESSFUL"
    }
    
    with open(os.path.join(OUTPUT_DIR, "COUNCIL_MANIFEST.json"), "w") as f:
        json.dump(manifest, f, indent=4, ensure_ascii=False)

    print(f"\n\n\033[1;32m✅ [SYSTEM CONFIRMED] {MODEL_IDENTITY} V3 IS LIVE.\033[0m")

except Exception as e:
    logger.error(f"Critical Forge Failure: {str(e)}")
