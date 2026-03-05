import os
import torch
import sys
import json
from datetime import datetime
from transformers import (
    AutoModelForCausalLM, 
    AutoTokenizer, 
    TrainingArguments, 
    Trainer, 
    DataCollatorForLanguageModeling
)
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, TaskType, prepare_model_for_kbit_training

# --- [🆔 GLOBAL AUDIT IDENTITY] ---
MODEL_IDENTITY = "AOXCAN-CORE-XLYR-003-GENESIS"
TIMESTAMP = datetime.now().strftime("%Y%m%d")
TOKENIZER_DIR = "./aoxcan_tokenizer"
BASE_MODEL_PATH = "../model_hub"
# Senin tree yapındaki gerçek veri yolu
DATA_SOURCE = "./data/master_train_sovereign_v18.jsonl" 
OUTPUT_DIR = f"../outputs/{MODEL_IDENTITY}-{TIMESTAMP}"

def sovereign_banner():
    os.system('clear')
    print("\033[1;36m")
    print(r"  █████╗  ██████╗ ██╗  ██╗ ██████╗  █████╗  ███╗   ██╗")
    print(r" ██╔══██╗██╔═══██╗╚██╗██╔╝██╔════╝ ██╔══██╗ ████╗  ██║")
    print(r" ███████║██║   ██║ ╚███╔╝ ██║      ███████║ ██╔██╗ ██║")
    print(r" ██╔══██║██║   ██║ ██╔██╗ ██║      ██╔══██║ ██║╚██╗██║")
    print(r" ██║  ██║╚██████╔╝██╔╝ ██╗╚██████╗ ██║  ██║ ██║ ╚████║")
    print(r" ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝")
    print("\033[0m")
    print("\033[1;32m" + "      [ PHASE: SOVEREIGN NEURAL IGNITION | v2.3 ACTIVE ]" + "\033[0m")
    print("\033[1;34m" + "═"*75 + "\033[0m")
    print(f"\033[1;33m SYSTEM ID     :\033[0m {MODEL_IDENTITY}")
    print(f"\033[1;33m TARGET KERNEL :\033[0m EVM-GO / RUST-CORE / X-LAYER")
    print(f"\033[1;33m DIALECT STATUS:\033[0m AOXCAN CUSTOM BPE SEALED")
    print("\033[1;34m" + "═"*75 + "\033[0m\n")

sovereign_banner()

# --- [🔍 INTEGRITY CHECKS] ---
if not os.path.exists(DATA_SOURCE):
    print(f"\033[1;31m❌ [CRITICAL ERROR] Sovereign Data missing at: {DATA_SOURCE}\033[0m")
    sys.exit(1)

# --- [🔥 THE NEURAL RECONSTRUCTION] ---

print("\033[1;34m[*] Loading Custom Sealed Tokenizer...\033[0m")
tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_DIR)

print("\033[1;34m[*] Accessing Base Intelligence Hub...\033[0m")
model = AutoModelForCausalLM.from_pretrained(
    BASE_MODEL_PATH,
    torch_dtype=torch.float32,
    device_map={"": "cpu"}, # Değiştir: GPU varsa "auto" yapabilirsin
    trust_remote_code=True
)

# 

# Essential Step: Remapping neurons to the new audit dialect
print("\033[1;34m[*] Injecting AOXCAN Dialect into Model Vocabulary...\033[0m")
model.resize_token_embeddings(len(tokenizer))

# Justice Engine (LoRA) Configuration
# Bu yapı modelin 'muhakeme' yeteneğini senin kodlarına göre şekillendirir.
print("\033[1;34m[*] Initializing Justice-Engine (LoRA) for Deep Audit Logic...\033[0m")
lora_config = LoraConfig(
    r=32, # Rank: Bilgi işleme kapasitesi
    lora_alpha=64,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.1,
    bias="none",
    task_type=TaskType.CAUSAL_LM
)
model = get_peft_model(model, lora_config)

# --- [📚 DATASET PREPARATION] ---
print("\033[1;34m[*] Pre-processing 612 Sovereign Components for Training...\033[0m")
dataset = load_dataset("json", data_files=DATA_SOURCE, split="train")

def tokenize_function(examples):
    return tokenizer(
        examples["text"], 
        truncation=True, 
        max_length=512, # Derin kod blokları için optimize edildi
        padding="max_length"
    )

tokenized_dataset = dataset.map(
    tokenize_function, 
    batched=True, 
    remove_columns=["text"]
)

# --- [🚀 TRAINING ENGINE CONFIGURATION] ---
training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    per_device_train_batch_size=1, # Bellek dostu
    gradient_accumulation_steps=16, # Stabil öğrenme
    num_train_epochs=5, # 612 dosyayı tam hazmetmesi için 5 tur
    learning_rate=1e-4, # Hassas öğrenme hızı
    weight_decay=0.01,
    logging_steps=1,
    save_strategy="epoch",
    report_to="none",
    use_cpu=True, # Sunucunda GPU yoksa CPU ile devam
    push_to_hub=False
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_dataset,
    data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)
)

# 

# --- [⚡️ EXECUTION] ---
print(f"\033[1;31m🔥 [IGNITION] AOXCAN Core Awakening Initiated...\033[0m\n")

try:
    trainer.train()
except Exception as e:
    print(f"\033[1;31m❌ [FAIL] Ignition aborted: {str(e)}\033[0m")
    sys.exit(1)

# --- [🔒 FINAL SEALING] ---
print(f"\n\033[1;34m[*] Sealing Awakened Core at: {OUTPUT_DIR}\033[0m")
trainer.save_model(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

# Generate Audit Manifest for the new Model
manifest = {
    "model_id": MODEL_IDENTITY,
    "engine_version": "v2.3-PRO",
    "training_date": TIMESTAMP,
    "audit_capacity": "EVM/Rust Hybrid Logic",
    "status": "SOVEREIGN_AWAKENED"
}
with open(os.path.join(OUTPUT_DIR, "MODEL_MANIFEST.json"), "w") as f:
    json.dump(manifest, f, indent=4)

print(f"\n\033[1;32m✅ [SUCCESS] AOXCAN-XLYR-003 IS NOW NATIVELY INTELLIGENT.\033[0m")
print("\033[1;33m[*] System has transitioned from 'Base' to 'Sovereign'.\033[0m\n")
