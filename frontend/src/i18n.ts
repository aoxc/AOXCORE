import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "AOXC Neural OS",
      "slogan": "Powered by X LAYER",
      "ledger_os": "Ledger OS v1.0",
      "sidebar": {
        "ledger": "Main Ledger",
        "finance": "Cash Ledger",
        "signatures": "Signature Ledger",
        "pending": "Pending Signatures",
        "registry": "Registry Map",
        "governance": "War Room",
        "analytics": {
          "title": "Neural Analytics Engine",
          "subtitle": "Real-time XLayer-Reth Telemetry"
        }
      },
      "ledger": {
        "title": "Neural Transaction Ledger",
        "subtitle": "Real-time Blockchain Accounting",
        "columns": {
          "id": "TXID",
          "module": "Module",
          "operation": "Operation",
          "status": "Status",
          "verdict": "AI Verdict"
        },
        "empty": "Awaiting Neural Input..."
      },
      "control": {
        "neural_command": "Neural Command (e.g. 'Audit Vault')...",
        "gas_optimal": "Gemini: Gas efficiency is optimal. All systems ready for execution.",
        "gas_high": "Gemini: Network load is high. I recommend delaying non-critical tasks.",
        "gas_critical": "Gemini: CRITICAL LOAD. Transaction execution may fail or be extremely costly.",
        "tabs": {
          "core": "Core",
          "finance": "Finance",
          "infra": "Infra"
        },
        "repair": {
          "title": "Repair State",
          "stable": "System Stable",
          "syncing": "Syncing State...",
          "button": "REPAIR STATE"
        },
        "cards": {
          "registry": { "title": "AoxcRegistry", "desc": "Manage core contract addresses and permissions." },
          "audit": { "title": "AuditVoice", "desc": "Governance and DAO voting mechanism." },
          "sentinel": { "title": "Sentinel Config", "desc": "Adjust AI security thresholds." },
          "vault": { "title": "AoxcVault", "desc": "Secure asset storage and yield management." },
          "change": { "title": "AoxcChange", "desc": "Atomic swap and liquidity provider." },
          "factory": { "title": "Asset Factory", "desc": "Mint or burn synthetic AOXC assets." },
          "autorepair": { "title": "AutoRepair", "desc": "Autonomous state correction and optimization." },
          "node": { "title": "Reth Node", "desc": "Direct RPC management and health checks." },
          "clock": { "title": "AoxcClock", "desc": "Network synchronization and time-locks." }
        }
      },
      "notary": {
        "title": "Neural Notary Panel",
        "subtitle": "AI-Verified Transaction Proof",
        "command_label": "User Command",
        "module_label": "Module",
        "target_label": "Target Contract",
        "details_label": "Function Details",
        "analysis_label": "Sentinel Analysis",
        "audit_trail": "Audit Trail (Flow Diagram)",
        "disclaimer": "This transaction will pass through AoxcGateway authorized by AoxcRegistry.",
        "approve": "NOTARIZE AND SIGN",
        "reject": "Reject Request",
        "signing": "SEALING...",
        "analysis": "Neural Analysis",
        "translation": "Human Interpretation"
      },
      "pending": {
        "title": "Pending Signatures (Multi-Sig)",
        "empty": "All signatures complete. No pending transactions.",
        "status": "Signature Status",
        "awaiting": "Awaiting DAO Consensus",
        "sign_button": "SIGN"
      },
      "registry_map": {
        "title": "Registry Live Map",
        "subtitle": "Contract Dependency Visualization",
        "legend_core": "Core Module",
        "legend_active": "Active Link",
        "node_status": "Status",
        "node_linked": "Linked"
      },
      "war_room": {
        "history_title": "Governance History",
        "history_subtitle": "AuditVoice Decision Log",
        "impact_title": "Impact Prediction",
        "impact_subtitle": "Gemini Neural Simulation",
        "ai_active": "AI Active",
        "gemini_analysis": "Gemini Analysis",
        "simulation_metrics": "Simulation Metrics",
        "run_simulation": "Run New Simulation",
        "metrics": {
          "stability": "Network Stability",
          "utilization": "Capital Utilization",
          "participation": "Governance Participation"
        },
        "stats": {
          "liquidity": "Liquidity Impact",
          "risk": "Risk Exposure",
          "growth": "User Growth"
        }
      },
      "permissions": {
        "level": "Access Level",
        "guest": "Guest",
        "operator": "Operator",
        "admin": "Admin"
      },
      "status_matrix": {
        "core": "CORE Panel",
        "access": "ACCESS Panel",
        "finance": "FINANCE Panel",
        "infra": "INFRA Panel",
        "gov": "GOV Panel",
        "states": {
          "green": "Stable",
          "yellow": "Warning",
          "orange": "Risk Detected",
          "red": "Critical Error",
          "blue": "Proposal Active"
        }
      }
    }
  },
  tr: {
    translation: {
      "app_name": "AOXC Sinirsel İşletim Sistemi",
      "slogan": "X LAYER Tarafından Güçlendirildi",
      "ledger_os": "Defter İşletim Sistemi v1.0",
      "sidebar": {
        "ledger": "Ana Defter",
        "finance": "Kasa Defteri",
        "signatures": "İmza Defteri",
        "pending": "Bekleyen İmzalar",
        "registry": "Kayıt Haritası",
        "governance": "Savaş Odası",
        "analytics": {
          "title": "Sinirsel Analitik Motoru",
          "subtitle": "Gerçek Zamanlı XLayer-Reth Telemetrisi"
        }
      },
      "ledger": {
        "title": "Sinirsel İşlem Defteri",
        "subtitle": "Gerçek Zamanlı Blockchain Muhasebesi",
        "columns": {
          "id": "İŞLEM NO",
          "module": "Modül",
          "operation": "Operasyon",
          "status": "Durum",
          "verdict": "Yapay Zeka Kararı"
        },
        "empty": "Sinirsel Giriş Bekleniyor..."
      },
      "control": {
        "neural_command": "Sinirsel Komut (örn. 'Kasayı Denetle')...",
        "gas_optimal": "Gemini: Gaz verimliliği optimal. Tüm sistemler çalışmaya hazır.",
        "gas_high": "Gemini: Ağ yükü yüksek. Kritik olmayan görevleri ertelemenizi öneririm.",
        "gas_critical": "Gemini: KRİTİK YÜK. İşlem yürütme başarısız olabilir veya çok maliyetli olabilir.",
        "tabs": {
          "core": "Çekirdek",
          "finance": "Finans",
          "infra": "Altyapı"
        },
        "repair": {
          "title": "Onarım Durumu",
          "stable": "Sistem Kararlı",
          "syncing": "Durum Eşitleniyor...",
          "button": "DURUMU ONAR"
        },
        "cards": {
          "registry": { "title": "AoxcRegistry", "desc": "Çekirdek sözleşme adreslerini ve yetkilerini yönetin." },
          "audit": { "title": "AuditVoice", "desc": "Yönetişim ve DAO oylama mekanizması." },
          "sentinel": { "title": "Sentinel Yapılandırması", "desc": "YZ güvenlik eşiklerini ayarlayın." },
          "vault": { "title": "AoxcVault", "desc": "Güvenli varlık depolama ve getiri yönetimi." },
          "change": { "title": "AoxcChange", "desc": "Atomik takas ve likidite sağlayıcı." },
          "factory": { "title": "Varlık Fabrikası", "desc": "Sentetik AOXC varlıkları basın veya yakın." },
          "autorepair": { "title": "Otomatik Onarım", "desc": "Otonom durum düzeltme ve optimizasyon." },
          "node": { "title": "Reth Düğümü", "desc": "Doğrudan RPC yönetimi ve sağlık kontrolleri." },
          "clock": { "title": "AoxcClock", "desc": "Ağ senkronizasyonu ve zaman kilitleri." }
        }
      },
      "notary": {
        "title": "Sinirsel Noter Paneli",
        "subtitle": "YZ Onaylı İşlem Kanıtı",
        "command_label": "Kullanıcı Emri",
        "module_label": "Modül",
        "target_label": "Hedef Sözleşme",
        "details_label": "Fonksiyon Detayları",
        "analysis_label": "Sentinel Analizi",
        "audit_trail": "Denetim İzi (Akış Şeması)",
        "disclaimer": "Bu işlem AoxcRegistry tarafından yetkilendirilmiş AoxcGateway üzerinden geçecektir.",
        "approve": "TASDİK ET VE İMZALA",
        "reject": "İsteği Reddet",
        "signing": "MÜHÜRLENİYOR...",
        "analysis": "Sinirsel Analiz",
        "translation": "İnsan Yorumu"
      },
      "pending": {
        "title": "Bekleyen İmzalar (Multi-Sig)",
        "empty": "Tüm imzalar tamamlandı. Bekleyen işlem yok.",
        "status": "İmza Durumu",
        "awaiting": "DAO Konsensüsü Bekleniyor",
        "sign_button": "İMZALA"
      },
      "registry_map": {
        "title": "Kayıt Canlı Haritası",
        "subtitle": "Sözleşme Bağımlılığı Görselleştirmesi",
        "legend_core": "Çekirdek Modül",
        "legend_active": "Aktif Bağlantı",
        "node_status": "Durum",
        "node_linked": "Bağlı"
      },
      "war_room": {
        "history_title": "Yönetişim Geçmişi",
        "history_subtitle": "AuditVoice Karar Günlüğü",
        "impact_title": "Etki Tahmini",
        "impact_subtitle": "Gemini Sinirsel Simülasyonu",
        "ai_active": "YZ Aktif",
        "gemini_analysis": "Gemini Analizi",
        "simulation_metrics": "Simülasyon Metrikleri",
        "run_simulation": "Yeni Simülasyon Çalıştır",
        "metrics": {
          "stability": "Ağ Kararlılığı",
          "utilization": "Sermaye Kullanımı",
          "participation": "Yönetişim Katılımı"
        },
        "stats": {
          "liquidity": "Likidite Etkisi",
          "risk": "Risk Maruziyeti",
          "growth": "Kullanıcı Büyümesi"
        }
      },
      "permissions": {
        "level": "Erişim Seviyesi",
        "guest": "Ziyaretçi",
        "operator": "Operatör",
        "admin": "Yönetici"
      },
      "status_matrix": {
        "core": "CORE Paneli",
        "access": "ACCESS Paneli",
        "finance": "FINANCE Paneli",
        "infra": "INFRA Paneli",
        "gov": "GOV Paneli",
        "states": {
          "green": "Kararlı",
          "yellow": "Uyarı",
          "orange": "Risk Saptandı",
          "red": "Kritik Hata",
          "blue": "Teklif Aktif"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;
