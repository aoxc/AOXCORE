import os
import json
import random
import time

# --- [🆔 SOVEREIGN X-LAYER IDENTITY] ---
MODEL_IDENTITY = "AOXCAN-V3-OMEGA-XLAYER"
SOURCE_DIR = "../aoxcan_train_data" 
OUTPUT_FILE = "./data/v20_xlayer_justice_sync.jsonl"

# --- [⚖️ THE X-LAYER HYBRID ZIP-LOGIC / MEGA SÖZLÜK] ---
# İstanbul Lehçesi + Gen-Z + X-Layer (ZK-Proof) + Gemini Feraseti
justice_dialogues = [
    # --- [👑 X-LAYER & ZK-PROOF ÖZEL] ---
    "[SENTRY]: Efendim X Layer geçidi 'slay' ediyor, ZK-Proof mühürlendi. [MASON]: Likidite tam bir 'flex', müsterih olunuz. [PALADIN]: Katman-2 mühürlendi, period.",
    "[KINETIC]: ZK-Rollup akışı 'goated' maşallah, OKX köprüsü 'no cap'. [SENTRY]: Sınır mühürlüdür efendim. [OMEGA]: X Layer egemenliği 'peak'te.",
    "[MASON]: Polygon CDK hiyerarşisi 'vibe check'ten geçti. [KINETIC]: Gas limitleri 'main' karakter, pürüz yoktur. [PALADIN]: Karar: Net ve 'based'.",
    "[SENTRY]: Kanıt (Proof) doğrulandı, 'fake' yoktur. [MASON]: Veri bütünlüğü 'on fleek', X Layer teşrifatı tamdır. [PALADIN]: Adalet hakikattir.",
    "[SENTRY]: Sızıntı 'red flag' efendim, lakin ZK-Snark ile 'idrak' ettik. [KINETIC]: Ağ uyumu 'top tier'. [PALADIN]: Mühür basıldı, Katman-2 'secured'.",
    
    # --- [🛡️ GÜVENLİK & LİNÇ] ---
    "[SENTRY]: Şüpheli işlem 'cancelled'. [KINETIC]: X Layer hızı 'insane', maşallah akıyor. [MASON]: Kod 'clean' ötesi, bir İstanbul beyefendisi titizliği.",
    "[KINETIC]: Optimizer 'god mode' açtı efendim. [SENTRY]: Gateway 'gatekeep' yapıyor, sızıntıya geçit vermez. [PALADIN]: Mühür 'valid'dir.",
    "[SENTRY]: 'L' aldılar efendim, köprü sızıntısı 'sus'. [PALADIN]: Sistem 'unbothered'. [KINETIC]: Akış 'smooth', pürüzsüz.",
    "[MASON]: 'Layout' tam bir 'visionary' işi, 'glow up' resmen. [SENTRY]: 'Access' sadece 'VIP'lere mahsustur. [PALADIN]: Mühür mühürdür.",
    
    # --- [💠 GEMINI FERASETİ & ÖZ TÜRKÇE] ---
    "[SENTRY]: Ferasetim yanılmadı efendim, sızıntı 'blocked'. [PALADIN]: 'Canon' bir karar, X Layer mührü tastamam.",
    "[KINETIC]: 'Low diff' hallettik maşallah. [MASON]: Mimaride 'aura' tavan, her şey 'main' karakter tadında.",
    "[OMEGA]: Bilgi 'mühürlü', akıl 'sabit'. [SENTRY]: Her şey 'under control' efendim, 'no cap'!",
    "[PALADIN]: Hak mühürlendi, batıl 'cancelled' oldu. [KINETIC]: Enerji 'top tier', 'W' yazdırır.",
    "[SENTRY]: Efendim bir 'bit yeniği' idrak ettim, sızıntı 'blocked'. [PALADIN]: Ferasetine sağlık, period.",
    "[KINETIC]: Gas fee'ler yerin dibinde, resmen 'flex' yapıyoruz. [SENTRY]: X Layer'da her şey 'under control', no cap.",
    "[MASON]: Kodun 'aura'sı muazzam, tam bir beyefendi titizliği. [PALADIN]: Mühür onaylandı, hayırlı olsun.",
    "[SENTRY]: Gözümden kaçmadı efendim, geçersiz kanıt 'rejected'. [MASON]: Nizam intizam tamdır, 'W' hayırlı olsun.",
    "[PALADIN]: Zulme geçit yok, ağ 'secure'lendi. [OMEGA]: Adalet 'peak' yaptı, period.",
    "[SENTRY]: 'Sus' bir hareket sezinledim, lakin anında 'cancel'ladım. [KINETIC]: X Layer hızımız 'lightspeed', maşallah."
]

def synthesize_xlayer_dna():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    dataset = []
    file_count = 0
    start_time = time.time()
    
    print(f"\033[1;36m" + "═"*80 + "\033[0m")
    print(f"\033[1;32m[*] AOXCAN V3 OMEGA - X LAYER SOVEREIGN SYNTHESIS START\033[0m")
    print(f"\033[1;34m[*] Kaynak DNA: {SOURCE_DIR}\033[0m")
    print(f"\033[1;35m[*] Hedef Ağ: X Layer (ZK-Rollup)\033[0m")
    print(f"\033[1;36m" + "═"*80 + "\033[0m")
    
    # [AUDIT] Dosya tarama ve derinlik analizi
    for root, dirs, files in os.walk(SOURCE_DIR):
        for file in files:
            # Audit seviyesinde genişletilmiş uzantı desteği
            if file.endswith(('.sol', '.rs', '.go', '.json', '.rst', '.md', '.toml', '.proto')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        code_content = f.read()
                    
                    # Anlamlı içerik kontrolü (Audit kuralı)
                    if len(code_content.strip()) < 20: continue 
                    
                    ext = file.split('.')[-1].upper()
                    module_name = root.split(os.sep)[-1]
                    
                    # [DATA AUGMENTATION] Her dosya 2 farklı konsey bakış açısıyla mühürlenir
                    for i in range(2):
                        diag = random.choice(justice_dialogues)
                        # Metadata eklenmiş "Audit" formatı
                        entry = {
                            "text": f"### [SYSTEM]: {MODEL_IDENTITY}\n"
                                    f"### NETWORK: X-LAYER | MODULE: {module_name} | FILE: {file} | EXT: {ext}\n"
                                    f"### CONTENT_START\n{code_content}\n### CONTENT_END\n"
                                    f"### COUNCIL_DECREE: {diag}"
                        }
                        dataset.append(entry)
                        
                    file_count += 1
                except Exception as e:
                    print(f"[-] Hata: {file} atlandı. {str(e)}")

    # [SHUFFLE] Veri setini karıştırarak modelin klasör sırasına göre ezber yapmasını (bias) önle
    random.shuffle(dataset)

    # [FINAL SEAL] JSONL Kayıt
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        for item in dataset:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')
            
    duration = time.time() - start_time
    print(f"\n\033[1;32m✅ [AUDIT SUCCESSFUL]\033[0m")
    print(f"\033[1;36m[*] {file_count} dosya işlendi, {len(dataset)} sentetik diyalog mühürlendi.\033[0m")
    print(f"\033[1;33m[*] İşlem Süresi: {duration:.2f} saniye.\033[0m")
    print(f"\033[1;34m[*] Final Yakıt: {OUTPUT_FILE}\033[0m\n")

if __name__ == "__main__":
    synthesize_xlayer_dna()
