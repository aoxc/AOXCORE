import os, sys, json, logging, torch, gc
from datetime import datetime
from typing import Dict, Any, Optional
from kaggle_secrets import UserSecretsClient
from huggingface_hub import login
from transformers import (
    AutoModelForCausalLM, AutoTokenizer, TrainingArguments, 
    Trainer, DataCollatorForLanguageModeling, TrainerCallback, set_seed
)
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, TaskType

# --- [CORE CONFIGURATION] ---
MODEL_IDENTITY = "AOXCAN-V3-OMEGA"
BASE_MODEL = "google/gemma-3-4b-it"
INPUT_PATH = "/kaggle/input/aoxcan-v3-omega-core/v20_xlayer_justice_sync.jsonl"
OUTPUT_DIR = f"/kaggle/working/outputs/{MODEL_IDENTITY}"
set_seed(42)

# --- [ENTERPRISE LOGGING & AUTH] ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | [%(name)s] %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("V3-CORE")

def initialize_auth():
    """Hugging Face kimlik doğrulama protokolü."""
    try:
        token = UserSecretsClient().get_secret("HF_TOKEN")
        login(token=token)
        logger.info("HF_TOKEN authenticated successfully.")
    except Exception as e:
        logger.error(f"Authentication Failure: {e}")
        sys.exit(1)

# --- [RESOURCE MANAGEMENT] ---
def cleanup_resources():
    """VRAM ve RAM optimizasyonu."""
    gc.collect()
    if torch.cuda.is_available():
        torch.cuda.empty_cache()

class AuditCallback(TrainerCallback):
    """Süreç izleme ve telemetri."""
    def on_log(self, args, state, control, logs=None, **kwargs):
        if logs and "loss" in logs:
            vram = torch.cuda.memory_reserved() / 1024**3 if torch.cuda.is_available() else 0
            logger.info(f"Step: {state.global_step} | Loss: {logs['loss']:.4f} | VRAM: {vram:.2f}GB")

# --- [ENGINE INITIALIZATION] ---
def ignite_engine():
    initialize_auth()
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    cleanup_resources()
    
    logger.info(f"Loading Neural Core: {BASE_MODEL}")
    
    # Tokenizer & Model Loading
    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, trust_remote_code=True)
    tokenizer.pad_token = tokenizer.eos_token
    
    dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
    
    model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL,
        torch_dtype=dtype,
        device_map="auto",
        trust_remote_code=True
    )
    
    # LoRA Architecture
    peft_config = LoraConfig(
        r=32, lora_alpha=64,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        lora_dropout=0.05,
        task_type=TaskType.CAUSAL_LM
    )
    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()
    
    return model, tokenizer

# --- [DATA PIPELINE] ---
def prepare_data(tokenizer):
    """Veri temizleme ve tokenize etme protokolü."""
    if not os.path.exists(INPUT_PATH):
        raise FileNotFoundError(f"Input missing: {INPUT_PATH}")
    
    logger.info("Ingesting and filtering dataset...")
    dataset = load_dataset("json", data_files={"train": INPUT_PATH}, split="train")
    
    # Audit-level filtering: Boş veya hatalı satırları temizle
    dataset = dataset.filter(lambda x: x.get("text") and len(str(x["text"]).strip()) > 0)
    
    def tokenize_map(examples):
        return tokenizer(
            [str(t) for t in examples["text"]],
            truncation=True, max_length=1024, padding="max_length"
        )
    
    return dataset.map(tokenize_map, batched=True, remove_columns=["text"])

# --- [EXECUTION] ---
if __name__ == "__main__":
    try:
        model, tokenizer = ignite_engine()
        train_data = prepare_data(tokenizer)
        
        training_args = TrainingArguments(
            output_dir=OUTPUT_DIR,
            per_device_train_batch_size=2,
            gradient_accumulation_steps=8,
            num_train_epochs=2,
            learning_rate=1e-4,
            lr_scheduler_type="cosine",
            warmup_ratio=0.05,
            logging_steps=10,
            fp16=not torch.cuda.is_bf16_supported(),
            bf16=torch.cuda.is_bf16_supported(),
            report_to="none",
            save_strategy="no"
        )
        
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=train_data,
            data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
            callbacks=[AuditCallback()]
        )
        
        logger.info("=== STARTING SOVEREIGN SYNTHESIS ===")
        trainer.train()
        
        # Final Sealing
        trainer.save_model(OUTPUT_DIR)
        logger.info(f"✅ MISSION SUCCESSFUL: {MODEL_IDENTITY} SEALD AT {OUTPUT_DIR}")
        
    except Exception as fatal_error:
        logger.error(f"CRITICAL FORGE FAILURE: {fatal_error}")
        sys.exit(1)
