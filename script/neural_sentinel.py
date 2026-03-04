import google.generativeai as genai
from web3 import Web3
import json

# 1. Google AI Kurulumu (API Anahtarını buraya eklemeyi unutma)
GENAI_API_KEY = "SENIN_GEMINI_API_KEYIN"
genai.configure(api_key=GENAI_API_KEY)

# Yapılandırılmış yanıt alabilmek için sistem talimatı ekliyoruz
ai_model = genai.GenerativeModel(
    model_name='gemini-1.5-flash',
    generation_config={"response_mime_type": "application/json"}
)

# 2. Local Anvil / XLayer Bağlantısı
# Not: Eğer gerçek bir ağa bağlanacaksan bu URL'i değiştirmen gerekir.
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

def analyze_v1_migration(holder_address, amount):
    """
    Cüzdan adresi ve miktar bazında AI destekli risk analizi yapar.
    """
    if not w3.is_address(holder_address):
        return {"error": "Geçersiz Ethereum adresi."}

    # Gemini'ye detaylı ve yapılandırılmış (JSON) bir prompt gönderiyoruz
    prompt = f"""
    Analyze this AOXC V1 to V2 migration request on XLayer Network:
    - Holder Address: {holder_address}
    - Amount to Migrate: {amount} AOXC
    - Context: Upgrading to neural-gated V2 Core.

    Task: Evaluate if this looks like a typical user or a malicious drainer/bot.
    Return a JSON object with:
    'risk_score': integer (0-100, where 100 is critical risk),
    'status': 'safe' | 'suspicious' | 'danger',
    'reason': string (brief explanation in Turkish)
    """

    try:
        response = ai_model.generate_content(prompt)
        # AI'dan gelen JSON metnini Python sözlüğüne çeviriyoruz
        analysis_result = json.loads(response.text)
        return analysis_result
    except Exception as e:
        return {"error": f"AI Analizi sırasında hata oluştu: {str(e)}"}

# --- TEST SENARYOSU ---
if __name__ == "__main__":
    test_address = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82"
    test_amount = 1000000

    print("--- AOXC Migration Güvenlik Analizi Başlatılıyor ---")
    result = analyze_v1_migration(test_address, test_amount)

    if "error" in result:
        print(f"Hata: {result['error']}")
    else:
        print(f"Cüzdan: {test_address}")
        print(f"Risk Skoru: {result['risk_score']}/100")
        print(f"Durum: {result['status'].upper()}")
        print(f"AI Yorumu: {result['reason']}")

        # Örnek bir kontrol mekanizması
        if result['risk_score'] > 70:
            print("UYARI: Yüksek risk tespit edildi. İşlem askıya alınabilir.")
        else:
            print("ONAY: İşlem güvenli görünüyor.")
