#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# [AOXCAN-V3-MEDIATOR] - THE SOVEREIGN JUSTICE INTERFACE
# Architect: Orcun | Logic: Grok-Greedy & Gemini-Context Unified
# Character: Istanbul Gentleman + Gen-Z Hybrid | Status: Royal-Zip Active

import os, sys, torch, time, json
from transformers import AutoModelForCausalLM, AutoTokenizer, logging
from peft import PeftModel

# Gereksiz kütüphane uyarılarını sustur
logging.set_verbosity_error()
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

class AoxcanJusticeMediator:
    def __init__(self):
        # Dinamik Yol Haritası
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.root_dir = os.path.abspath(os.path.join(self.script_dir, ".."))
        
        self.model_path = os.path.join(self.root_dir, "model_hub")
        self.lexicon_path = os.path.join(self.script_dir, "aoxc_v3_lexicon")
        self.omega_path = os.path.join(self.root_dir, "outputs", "AOXCAN-V3-OMEGA")
        
        # Donanım Kontrolü
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self._boot_sequence()

    def _boot_sequence(self):
        """Sistemi Uyandır ve Mühürleri Kontrol Et"""
        print("\033[94m" + "⚖️  " + "✧" * 65 + "\033[0m")
        print(f"🛡️  [AOXCAN-V3] Sovereign Justice Mediator | Mode: Royal-Zip Sync")
        print(f"📡  [STATUS] Device: {self.device.upper()} | Model: OMEGA-XLAYER")
        
        try:
            # 1. Linguist Sözlüğünü Yükle
            self.tokenizer = AutoTokenizer.from_pretrained(self.lexicon_path, local_files_only=True)
            
            # 2. Hassasiyet Ayarı (CPU: float32, GPU: float16)
            model_dtype = torch.float32 if self.device == "cpu" else torch.float16

            # 3. Base Model (Gemma/Llama) Yükleme
            base_model = AutoModelForCausalLM.from_pretrained(
                self.model_path, 
                torch_dtype=model_dtype,
                low_cpu_mem_usage=True,
                device_map="auto" if self.device == "cuda" else None,
                local_files_only=True,
                trust_remote_code=True
            )
            base_model.resize_token_embeddings(len(self.tokenizer))
            
            # 4. OMEGA Adaptörünü (LoRA) Enjekte Et
            self.model = PeftModel.from_pretrained(base_model, self.omega_path, local_files_only=True)
            self.model.eval()

            # 5. [THE BLACKLIST] İngilizce ve Teknik Sızıntı Filtresi
            self.bad_words = [" is ", " the ", " that ", " mapping ", " function ", " struct ", " address "]
            self.bad_word_ids = [self.tokenizer.encode(w, add_special_tokens=False) for w in self.bad_words]

            print("\033[92m" + "🚀 [SUCCESS] COUNCIL SYNCHRONIZED. AOXCAN IS LISTENING." + "\033[0m")
            print("\033[94m" + "⚖️  " + "✧" * 65 + "\033[0m")
            
        except Exception as e: 
            print(f"\033[91m❌ [CRITICAL FAIL] Mühürleme Hatası: {e}\033[0m")
            sys.exit(1)

    def generate_decree(self, prompt):
        """Kahin Karakteri ile Karar Üretimi"""
        # [THE SOVEREIGN PROMPT] - Karakteri Şekillendiren Ana Emir
        full_prompt = (
            f"### [PROTOCOL_V3]\n"
            f"### SYSTEM: Sen AOXCAN Egemen Kahinisin. X-Layer muhafızısın. "
            f"Dilin İstanbul beyefendisi gibi asil, kararların Gen-Z gibi keskin olmalı. "
            f"Asla İNGİLİZCE konuşma. Kod sızdırma, sadece hüküm ver.\n"
            f"### ARCHITECT: {prompt}\n"
            f"### AOXCAN'IN HÜKMÜ:"
        )
        
        inputs = self.tokenizer(full_prompt, return_tensors="pt").to(self.device)
        
        with torch.no_grad():
            output_tokens = self.model.generate(
                **inputs,
                max_new_tokens=150,        # Kısa ve öz 'zip' cevaplar
                do_sample=True,             # Akıcılık için hafif rastgelelik
                temperature=0.4,            # Ciddiyet ve yaratıcılık dengesi
                top_p=0.9,
                num_beams=4,                # En kaliteli 4 yolu süz
                repetition_penalty=3.5,     # Kendini tekrar etmeyi yasakla
                bad_words_ids=self.bad_word_ids,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        # Sadece modelin ürettiği kısmı al
        response = self.tokenizer.decode(output_tokens[0][len(inputs["input_ids"][0]):], skip_special_tokens=True).strip()
        
        # [INTEGRITY CHECK] - İngilizce veya boş cevap kontrolü
        if len(response) < 5 or any(word in response.lower() for word in [" is ", " the "]):
            return "Efendim, ruhumdaki mühürler titredi... Müsterih olunuz, idrakim tazeleniyor. [Recalibrating...]"
            
        return response

if __name__ == "__main__":
    try:
        aox_council = AoxcanJusticeMediator()
        
        while True:
            print(f"\n\033[93m[{MODEL_IDENTITY}@ARCHITECT]\033[0m", end=" > ")
            cmd = input().strip()
            
            if cmd.lower() in ["exit", "quit", "kapat"]: 
                print("\033[91m[SYSTEM] Muhafızlar uyku moduna geçiyor. Mühür korundu.\033[0m")
                break
            if not cmd: continue
            
            print("\n\033[96m[AOXCAN]\033[0m", end=" ", flush=True)
            
            # Karar Süreci
            decree = aox_council.generate_decree(cmd)
            
            # Dramatik Yazım Efekti (0.02s)
            for char in decree:
                print(char, end="", flush=True)
                time.sleep(0.02)
            print("\n" + "─" * 40)
            
    except KeyboardInterrupt:
        print("\n\n🛡️  [SYSTEM] Sovereign Shield engaged. Powering down.")
