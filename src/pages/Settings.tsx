import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

type Tab = 'profile' | 'security' | 'notifications' | 'powerbi' | 'equipment' | 'voice';

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  location: string;
  details: string;
  icon: string;
  status: 'Operational' | 'Service Required' | 'Calibration Due';
}

const DEFAULT_LOGO = 'https://lh3.googleusercontent.com/aida-public/AB6AXuClzs2qLi01u8zRP56sdKHGde1f5v8kA1yymHxyLBBL5MgYaln6q_mBLPAf_1laSNAh36wBiFZLcKOB3z-HfMwdAn7BMkr82AhTfIofnTWYa52t35hawrdE-mnBYyVIDhGqBuAhMVADjuNnI3QLg4_fIv2VdrEsGkUY4s6IPjvCjj_Wy1JoD7bCnoKpL3UxbrsWz6GDsR4ajAF-_U38bNQL-RiwpXMAxUkZV-Pn2A9WeS-sFYW36jcU';

const LOGO_PRESETS = [
  {
    id: 'teal_caduceus',
    name: 'Teal Pro',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230d9488"/><stop offset="100%" stop-color="%230284c7"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g1)"/><path d="M50 20 C32 20 28 32 28 44 C28 58 35 72 40 82 C43 88 47 88 48 82 C49 76 50 68 50 68 C50 68 51 76 52 82 C53 88 57 88 60 82 C65 72 72 58 72 44 C72 32 68 20 50 20 Z" fill="white"/><circle cx="50" cy="40" r="5" fill="%230d9488"/></svg>'
  },
  {
    id: 'cyan_shield',
    name: 'Apex Shield',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%233b82f6"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g2)"/><path d="M50 18 L76 28 C76 55 64 74 50 82 C36 74 24 55 24 28 Z" fill="white" opacity="0.95"/><path d="M50 32 C42 32 38 38 38 46 C38 56 42 66 45 72 C47 75 49 75 50 72 C50 68 50 64 50 64 C50 64 50 68 50 72 C51 75 53 75 55 72 C58 66 62 56 62 46 C62 38 58 32 50 32 Z" fill="%230284c7"/></svg>'
  },
  {
    id: 'gold_crest',
    name: 'Gold Crest',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23d97706"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="%231e293b"/><path d="M50 20 C34 20 30 32 30 44 C30 57 37 70 41 80 C44 86 48 86 49 80 C50 74 50 66 50 66 C50 66 50 74 51 80 C52 86 56 86 59 80 C63 70 70 57 70 44 C70 32 66 20 50 20 Z" fill="url(%23g3)"/><polygon points="50,12 53,19 60,19 55,23 57,30 50,26 43,30 45,23 40,19 47,19" fill="%23fbbf24"/></svg>'
  },
  {
    id: 'emerald_health',
    name: 'Emerald Smile',
    preview: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2310b981"/><stop offset="100%" stop-color="%23047857"/></linearGradient></defs><rect width="100" height="100" rx="24" fill="url(%23g4)"/><circle cx="50" cy="50" r="30" fill="white" opacity="0.2"/><path d="M50 24 C36 24 32 34 32 46 C32 58 38 68 42 78 C44 82 48 82 49 78 C50 72 50 66 50 66 C50 66 50 72 51 78 C52 82 56 82 58 78 C62 68 68 58 68 46 C68 34 64 24 50 24 Z" fill="white"/><path d="M42 46 L47 51 L58 40" stroke="%23047857" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
  }
];

const defaultEquipment: EquipmentItem[] = [
  { 
    id: '1', 
    name: 'Planmeca ProMax 3D CBCT Scanner', 
    category: 'Imaging & Diagnostics', 
    location: 'Operatory 1', 
    details: 'Calibration Due: Nov 2026 • Firmware v5.2.1', 
    icon: 'dentistry', 
    status: 'Operational' 
  },
  { 
    id: '2', 
    name: 'iTero Element 5D Intraoral Scanner', 
    category: 'Digital Impression', 
    location: 'Operatory 2', 
    details: 'Last scanned 32m ago • Optical lens sanitized', 
    icon: 'scanner', 
    status: 'Operational' 
  },
  { 
    id: '3', 
    name: 'A-dec 500 LED Dental Curing Light', 
    category: 'Restorative Tools', 
    location: 'Operatory 3', 
    details: 'Bulb intensity degraded (78%) • Replacement diode ordered', 
    icon: 'light_mode', 
    status: 'Service Required' 
  },
  { 
    id: '4', 
    name: 'Midmark M11 UltraClave Automatic Sterilizer', 
    category: 'Sterilization Bay', 
    location: 'Central Sterilization', 
    details: 'Cycle #4,812 passed spore test • Temperature 134°C verified', 
    icon: 'sanitizer', 
    status: 'Operational' 
  }
];

export default function Settings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const tabParam = searchParams.get('tab') as Tab | null;
    const validTabs: Tab[] = ['profile', 'security', 'notifications', 'powerbi', 'equipment', 'voice'];
    return (tabParam && validTabs.includes(tabParam)) ? tabParam : 'profile';
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [highlightCredentials, setHighlightCredentials] = useState(false);
  const credentialsRef = useRef<HTMLDivElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  // Clinic profile form state
  const [clinicName, setClinicName] = useState('Smile Clinic Advanced Dental Studio');
  const [npiNumber, setNpiNumber] = useState('1295847392');
  const [contactEmail, setContactEmail] = useState('admin@smileclinic.net');
  const [phone, setPhone] = useState('+1 (555) 382-9900');
  const [address, setAddress] = useState('742 Evergreen Terrace, Suite 400, Springfield, OR 97477');
  
  // Clinic Logo with persistence & reactive sync
  const [clinicLogo, setClinicLogo] = useState<string>(() => {
    return localStorage.getItem('dental_clinic_logo') || DEFAULT_LOGO;
  });

const generateEquipmentId = () => Date.now().toString();
const getAuditDateStamp = () => new Date().toISOString().split('T')[0];

// Watch URL params for tab & deep section links
  useEffect(() => {
    const tabParam = searchParams.get('tab') as Tab | null;
    const validTabs: Tab[] = ['profile', 'security', 'notifications', 'powerbi', 'equipment', 'voice'];
    if (tabParam && validTabs.includes(tabParam)) {
      setActiveTab((prev) => (prev !== tabParam ? tabParam : prev));
    }

    const sectionParam = searchParams.get('section');
    if (sectionParam === 'credentials') {
      setActiveTab('profile');
      setTimeout(() => {
        if (credentialsRef.current) {
          credentialsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightCredentials(true);
          setTimeout(() => setHighlightCredentials(false), 3000);
        }
      }, 150);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const updateClinicLogo = (newLogoUrl: string, message: string) => {
    setClinicLogo(newLogoUrl);
    localStorage.setItem('dental_clinic_logo', newLogoUrl);
    window.dispatchEvent(new Event('clinic_logo_updated'));
    showToast(message);
  };

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Logo file size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateClinicLogo(dataUrl, 'Clinic logo updated and synchronized across entire portal!');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyPreset = (preset: typeof LOGO_PRESETS[0]) => {
    updateClinicLogo(preset.preview, `Applied "${preset.name}" preset emblem across portal!`);
  };

  const handleResetLogo = () => {
    updateClinicLogo(DEFAULT_LOGO, 'Reset clinic logo to default system emblem.');
  };

  // Security Toggles
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15 Minutes');
  const [auditLogging, setAuditLogging] = useState(true);
  const [phiMasking, setPhiMasking] = useState(true);
  const [biometricLogin, setBiometricLogin] = useState(true);

  // Notifications Toggles
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailRecalls, setEmailRecalls] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [billingDigest, setBillingDigest] = useState(false);
  const [equipmentPush, setEquipmentPush] = useState(true);
  const [senderId, setSenderId] = useState('DENTALPRO');
  const [reminderWindow, setReminderWindow] = useState('24 Hours Prior');

  // Power BI State
  const [workspaceId, setWorkspaceId] = useState('8f4b2c1e-9a3d-4c5e-8b1a-7f6e5d4c3b2a');
  const [refreshFreq, setRefreshFreq] = useState('Real-Time Streaming');
  const [connectionTesting, setConnectionTesting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(true);

  // Equipment State
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(defaultEquipment);
  const [equipmentFilter, setEquipmentFilter] = useState<'all' | 'Operational' | 'Service Required'>('all');
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState('Imaging & Diagnostics');
  const [newEqLocation, setNewEqLocation] = useState('Operatory 1');
  const [newEqSerial, setNewEqSerial] = useState('');

  // Voice Charting State
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [noiseFilter, setNoiseFilter] = useState(true);
  const [audioRetention, setAudioRetention] = useState('Discard Immediately');
  const [vocabularyModel, setVocabularyModel] = useState('Dental Pro v4.2 (US English)');
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [voiceOutput, setVoiceOutput] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveChanges = () => {
    showToast('Practice Settings successfully saved to HIPAA-compliant cloud storage!');
  };

  const handleResetDefaults = () => {
    setClinicName('Smile Clinic Advanced Dental Studio');
    setNpiNumber('1295847392');
    setContactEmail('admin@smileclinic.net');
    setPhone('+1 (555) 382-9900');
    setMfaEnabled(true);
    setAuditLogging(true);
    setPhiMasking(true);
    setSmsReminders(true);
    setEmailRecalls(true);
    setVoiceEnabled(true);
    showToast('Settings reverted to clinical practice defaults.');
  };

  const handleTestPowerBI = () => {
    setConnectionTesting(true);
    setTimeout(() => {
      setConnectionTesting(false);
      setConnectionSuccess(true);
      showToast('Azure Power BI Tenant connection verified: 34ms round-trip latency!');
    }, 1200);
  };

  const handleDownloadAuditCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,Doctor/Staff,Action,Patient_MRN,IP_Address,HIPAA_Status\n" +
      "2026-10-09 15:42:10,Dr. Sarah Sharma,Viewed Perio Chart,#40921,192.168.1.104,Encrypted/Authorized\n" +
      "2026-10-09 15:10:02,Dr. Sarah Sharma,Updated Treatment Plan,#38291,192.168.1.104,Encrypted/Authorized\n" +
      "2026-10-09 14:22:15,Nurse Lisa Wong,Captured Digital X-Ray,#40921,192.168.1.112,Encrypted/Authorized\n" +
      "2026-10-09 13:05:44,Dr. Sarah Sharma,Signed Prescription Renewal,#41093,192.168.1.104,Encrypted/Authorized\n" +
      "2026-10-09 11:30:19,Admin Frontdesk,Created New Patient Record,#41108,192.168.1.101,Encrypted/Authorized\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hipaa_audit_trail_${getAuditDateStamp()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('HIPAA Audit Log exported successfully as CSV.');
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEqName.trim()) return;

    const newEquipment: EquipmentItem = {
      id: generateEquipmentId(),
      name: newEqName,
      category: newEqCategory,
      location: newEqLocation,
      details: `Serial: ${newEqSerial || 'SN-94281'} • Calibrated Today`,
      icon: newEqCategory.includes('Imaging') ? 'dentistry' : newEqCategory.includes('Steril') ? 'sanitizer' : 'medical_services',
      status: 'Operational'
    };

    setEquipmentList(prev => [newEquipment, ...prev]);
    setIsAddEquipmentOpen(false);
    setNewEqName('');
    setNewEqSerial('');
    showToast(`New equipment "${newEquipment.name}" registered into clinic inventory.`);
  };

  const toggleEquipmentStatus = (id: string) => {
    setEquipmentList(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Operational' ? 'Service Required' : 'Operational';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
    showToast('Equipment operational status updated.');
  };

  const simulateVoiceDictation = () => {
    setIsSimulatingVoice(true);
    setVoiceOutput(null);

    setTimeout(() => {
      setIsSimulatingVoice(false);
      setVoiceOutput(
        "\"Patient #40921: Tooth #14 MOD composite restoration completed with dual-cure bonding. Tooth #19 periodontal pocket depths: Mesial 3mm, Buccal 2mm, Distal 3mm. Zero bleeding on probing. Pre-op anesthesia: 1.7ml Lidocaine 2% with 1:100,000 epinephrine. Patient tolerated procedure with no complications.\""
      );
      showToast('AI voice dictation captured & parsed into structured EHR notes.');
    }, 1800);
  };

  const tabs: { id: Tab, icon: string, label: string }[] = [
    { id: 'profile', icon: 'local_hospital', label: 'Profile & Clinic Info' },
    { id: 'security', icon: 'security', label: 'Security & HIPAA' },
    { id: 'notifications', icon: 'notifications', label: 'Notifications & Alerts' },
    { id: 'powerbi', icon: 'analytics', label: 'Power BI Analytics' },
    { id: 'equipment', icon: 'medical_services', label: 'Equipment Status' },
    { id: 'voice', icon: 'mic', label: 'Voice-to-Text Charting' }
  ];

  const filteredEquipment = equipmentFilter === 'all' 
    ? equipmentList 
    : equipmentList.filter(eq => eq.status === equipmentFilter);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="pb-12"
    >
      {/* Shared Non-Intrusive Portaled Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Hero Header */}
      <div className="pt-2 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container-high/60">
        <div>
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Clinical Configuration & Governance
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">Practice Settings & Infrastructure</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage clinical parameters, HIPAA compliance protocols, automated telemetry, and third-party integrations.</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleResetDefaults}
            className="px-4 py-2.5 bg-surface-container-high text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset Defaults
          </button>
          <button 
            onClick={handleSaveChanges}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm hover:bg-primary-container transition-all shadow-md shadow-primary/20 flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs with Smooth Animated Indicator */}
      <div className="border-b border-surface-container-high/60 flex overflow-x-auto gap-1 md:gap-2 no-scrollbar scrollbar-none mt-4 pt-1 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative pb-3.5 pt-2 px-3.5 font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer rounded-t-xl shrink-0 ${
                isActive 
                  ? 'text-primary' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/50'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {tab.icon}
              </span>
              {tab.label}
              {isActive && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-xs"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Container with Smooth Transitions */}
      <div className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 1. Profile & Clinic Info */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Practice Identification */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">domain</span>
                        </div>
                        <h2 className="text-lg font-bold text-on-surface">Practice Identification</h2>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                        Verified Facility
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Clinic Legal Name</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-on-surface-variant">business</span>
                          <input 
                            className="w-full bg-surface border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                            type="text" 
                            value={clinicName}
                            onChange={(e) => setClinicName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Practice NPI Number</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-on-surface-variant">verified</span>
                          <input 
                            className="w-full bg-surface border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                            type="text" 
                            value={npiNumber}
                            onChange={(e) => setNpiNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Primary Contact Email</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-on-surface-variant">mail</span>
                          <input 
                            className="w-full bg-surface border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                            type="email" 
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Direct Clinic Phone</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-on-surface-variant">phone</span>
                          <input 
                            className="w-full bg-surface border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                            type="text" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Facility Physical Address</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-3 text-[18px] text-on-surface-variant">location_on</span>
                        <input 
                          className="w-full bg-surface border border-outline-variant/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" 
                          type="text" 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Doctor In Charge Card with Deep-Link Highlight */}
                  <div 
                    ref={credentialsRef}
                    id="credentials-section"
                    className={`bg-surface-container-lowest rounded-2xl p-6 shadow-sm border transition-all duration-500 space-y-4 ${
                      highlightCredentials 
                        ? 'ring-4 ring-sky-500/50 border-sky-500 bg-sky-50/20 shadow-xl shadow-sky-500/10 scale-[1.01]' 
                        : 'border-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">badge</span>
                        </div>
                        <h2 className="text-lg font-bold text-on-surface">Lead Dentist & Medical Director</h2>
                      </div>
                      {highlightCredentials && (
                        <span className="text-[11px] font-bold text-sky-700 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-500/40 animate-pulse flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                          Doctor Credentials
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-surface rounded-xl border border-surface-container-high">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/20 shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80" 
                          alt="Dr. Sarah Sharma" 
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                      </div>
                      <div className="flex-1 text-center sm:text-left space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="font-bold text-base text-on-surface">Dr. Sarah Sharma, DDS</h3>
                          <span className="text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full w-fit mx-auto sm:mx-0">
                            Chief Medical Officer
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant">Lead Dental Surgeon • Endodontics & Complex Restorations</p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-outline pt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-primary">clinical_notes</span>
                            State Board Lic: #DS-94281
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-teal-600">door_front</span>
                            Assigned Operatory: Room 01
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Clinic Branding & Operating Hours */}
                <div className="space-y-6">
                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high flex flex-col items-center text-center justify-between">
                    <div className="space-y-4 w-full flex flex-col items-center">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="text-lg font-bold text-on-surface">Clinic Logo</h2>
                        <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                          Brand Asset
                        </span>
                      </div>

                      {/* Main Logo Preview Box */}
                      <div className="w-36 h-36 rounded-2xl overflow-hidden bg-surface-container-low border-2 border-primary/30 shadow-md relative flex items-center justify-center p-3 group transition-transform hover:scale-105">
                        <img 
                          className="w-full h-full object-contain drop-shadow-sm transition-all duration-300" 
                          alt="Clinic logo" 
                          src={clinicLogo} 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl backdrop-blur-xs">
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            className="px-3 py-1.5 bg-white text-on-surface text-xs font-bold rounded-lg shadow-md hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px] text-primary">photo_camera</span>
                            Upload
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Recommended 500x500px PNG, SVG or WEBP with transparent background. Updates header & sidebar branding in real time.
                      </p>

                      {/* Quick Emblem Presets */}
                      <div className="w-full pt-3 border-t border-surface-container-high/60">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Quick Presets</span>
                          {clinicLogo !== DEFAULT_LOGO && (
                            <button
                              type="button"
                              onClick={handleResetLogo}
                              className="text-[11px] font-semibold text-error hover:underline flex items-center gap-0.5 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[13px]">history</span>
                              Reset Default
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {LOGO_PRESETS.map((preset) => {
                            const isSelected = clinicLogo === preset.preview;
                            return (
                              <button
                                key={preset.id}
                                type="button"
                                onClick={() => handleApplyPreset(preset)}
                                title={preset.name}
                                className={`relative p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-xs' 
                                    : 'border-surface-container-high bg-surface hover:bg-surface-container-high/70 hover:border-outline-variant'
                                }`}
                              >
                                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center p-0.5">
                                  <img src={preset.preview} alt={preset.name} className="w-full h-full object-contain" />
                                </div>
                                <span className="text-[10px] font-bold text-on-surface truncate w-full">{preset.name}</span>
                                {isSelected && (
                                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Hidden File Input */}
                    <input 
                      ref={logoFileInputRef}
                      type="file" 
                      accept="image/png, image/jpeg, image/svg+xml, image/webp" 
                      onChange={handleLogoFileSelect}
                      className="hidden" 
                    />

                    {/* Change Logo Action Button */}
                    <div className="w-full mt-4 space-y-2">
                      <button 
                        type="button"
                        onClick={() => logoFileInputRef.current?.click()}
                        className="w-full py-2.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                        Upload Custom Logo
                      </button>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-3">
                    <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                      Operating Hours
                    </h2>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-surface-container-low">
                        <span className="font-semibold text-on-surface">Monday – Friday</span>
                        <span className="text-on-surface-variant font-medium">8:00 AM – 6:00 PM</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-surface-container-low">
                        <span className="font-semibold text-on-surface">Saturday</span>
                        <span className="text-on-surface-variant font-medium">9:00 AM – 2:00 PM</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="font-semibold text-on-surface">Sunday</span>
                        <span className="text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded">Closed (Emergency On-Call)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Security & HIPAA Compliance */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">verified_user</span>
                        </div>
                        <h2 className="text-lg font-bold text-on-surface">HIPAA Compliance & Cryptographic Standards</h2>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">All patient protected health information (PHI) is secured under 256-bit AES encryption and strict BAA terms.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Fully Compliant (Tier 4)
                      </span>
                      <button 
                        onClick={handleDownloadAuditCSV}
                        className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Export Audit Log
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* MFA Toggle */}
                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-container-high">
                      <div>
                        <div className="font-bold text-sm text-on-surface">Multi-Factor Authentication (MFA / 2FA) Enforcement</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">Require TOTP authenticator (Google/Microsoft Authenticator) for all doctor and staff logins.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={mfaEnabled} 
                          onChange={(e) => {
                            setMfaEnabled(e.target.checked);
                            showToast(e.target.checked ? 'MFA enforcement activated.' : 'MFA enforcement disabled.');
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Auto Session Timeout */}
                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-container-high">
                      <div>
                        <div className="font-bold text-sm text-on-surface">Automatic Session Inactivity Timeout</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">Automatically lock operatory terminals after idle period to prevent unauthorized chart access.</div>
                      </div>
                      <select 
                        value={sessionTimeout}
                        onChange={(e) => {
                          setSessionTimeout(e.target.value);
                          showToast(`Inactivity timeout set to ${e.target.value}.`);
                        }}
                        className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs font-bold border border-surface-container-highest focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                      >
                        <option>10 Minutes</option>
                        <option>15 Minutes</option>
                        <option>30 Minutes</option>
                        <option>60 Minutes</option>
                      </select>
                    </div>

                    {/* Audit Trail Logging */}
                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-container-high">
                      <div>
                        <div className="font-bold text-sm text-on-surface">Immutable Audit Trail Logging</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">Maintain tamper-proof logs of every record access, diagnosis edit, dental chart view, and export.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={auditLogging} 
                          onChange={(e) => {
                            setAuditLogging(e.target.checked);
                            showToast(e.target.checked ? 'Audit trail logging active.' : 'Warning: Audit logging paused.');
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* PHI Masking */}
                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-container-high">
                      <div>
                        <div className="font-bold text-sm text-on-surface">Patient Health Information (PHI) Masking on Exports</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">Redact social security numbers, dates of birth, and home addresses from analytical reports.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={phiMasking} 
                          onChange={(e) => {
                            setPhiMasking(e.target.checked);
                            showToast(e.target.checked ? 'PHI export masking enabled.' : 'PHI export masking disabled.');
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    {/* Biometrics */}
                    <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-container-high">
                      <div>
                        <div className="font-bold text-sm text-on-surface">Touch ID / Windows Hello Biometric Fast Sign-In</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">Enable fingerprint and facial recognition sensors on compatible operatory chairside tablets.</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={biometricLogin} 
                          onChange={(e) => {
                            setBiometricLogin(e.target.checked);
                            showToast(e.target.checked ? 'Biometric fast login enabled.' : 'Biometric login disabled.');
                          }}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Notification Preferences */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                        </div>
                        <h2 className="text-lg font-bold text-on-surface">Automated Patient Reminders & Clinical Alerts</h2>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">Configure automated SMS triggers, preventive recall emails, and urgent emergency booking notifications.</p>
                    </div>
                  </div>

                  {/* Channel Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-surface-container-low">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">SMS Sender Brand ID</label>
                      <input 
                        className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm font-mono text-on-surface uppercase focus:outline-none focus:border-primary" 
                        type="text" 
                        value={senderId}
                        onChange={(e) => setSenderId(e.target.value)}
                      />
                      <span className="text-[10px] text-outline mt-1 block">Displays on patient handsets (e.g. DENTALPRO)</span>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Reminder Advance Window</label>
                      <select 
                        value={reminderWindow}
                        onChange={(e) => setReminderWindow(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
                      >
                        <option>12 Hours Prior</option>
                        <option>24 Hours Prior</option>
                        <option>48 Hours Prior</option>
                        <option>72 Hours Prior</option>
                      </select>
                      <span className="text-[10px] text-outline mt-1 block">Lead time for dispatching automated appointment SMS reminders</span>
                    </div>
                  </div>

                  {/* Toggles Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        title: "SMS Appointment Reminders", 
                        desc: "Send automated SMS notifications with 1-click confirmation links to patients.", 
                        checked: smsReminders, 
                        toggle: () => setSmsReminders(!smsReminders) 
                      },
                      { 
                        title: "Email Recalls & Preventive Checkups", 
                        desc: "Trigger bi-annual teeth cleaning and hygiene recall reminder emails automatically.", 
                        checked: emailRecalls, 
                        toggle: () => setEmailRecalls(!emailRecalls) 
                      },
                      { 
                        title: "Emergency Booking Push Alerts", 
                        desc: "Instant urgent push notification to Dr. Sharma for emergency pulpitis or trauma bookings.", 
                        checked: emergencyAlerts, 
                        toggle: () => setEmergencyAlerts(!emergencyAlerts) 
                      },
                      { 
                        title: "Billing & Insurance Digest", 
                        desc: "Weekly summary of processed insurance claims, denials, and outstanding patient balances.", 
                        checked: billingDigest, 
                        toggle: () => setBillingDigest(!billingDigest) 
                      },
                      { 
                        title: "Operatory Equipment Telemetry Warnings", 
                        desc: "Receive immediate alerts when autoclaves or imaging units flag maintenance errors.", 
                        checked: equipmentPush, 
                        toggle: () => setEquipmentPush(!equipmentPush) 
                      }
                    ].map((setting, i) => (
                      <div key={i} className="p-4 bg-surface rounded-xl space-y-2 border border-surface-container-high flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-on-surface">{setting.title}</span>
                          <input 
                            type="checkbox" 
                            checked={setting.checked} 
                            onChange={setting.toggle}
                            className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                          />
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{setting.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Power BI Analytics Integration */}
            {activeTab === 'powerbi' && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">analytics</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-on-surface">Power BI Embedded Workspace</h2>
                        <p className="text-xs text-on-surface-variant">Azure Tenant: <span className="font-mono text-primary font-bold">dentalcare-prod-uswest</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                        connectionSuccess 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Active Stream (38ms latency)
                      </span>
                    </div>
                  </div>

                  {/* Config Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Workspace GUID</label>
                      <input 
                        className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm font-mono text-on-surface focus:outline-none focus:border-primary" 
                        type="text" 
                        value={workspaceId}
                        onChange={(e) => setWorkspaceId(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1.5">Dataset Ingestion Cadence</label>
                      <select 
                        value={refreshFreq}
                        onChange={(e) => setRefreshFreq(e.target.value)}
                        className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary"
                      >
                        <option>Real-Time Streaming</option>
                        <option>Every 1 Hour</option>
                        <option>Every 4 Hours</option>
                        <option>Daily at Midnight</option>
                      </select>
                    </div>
                  </div>

                  {/* Connection Card */}
                  <div className="p-4 bg-surface rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-container-high">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">sync</span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-on-surface">Clinical KPI & Patient Flow Data Pipe</div>
                        <div className="text-xs text-on-surface-variant mt-0.5">Last successful synchronization completed 2 minutes ago. 99.98% uptime.</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleTestPowerBI}
                      disabled={connectionTesting}
                      className="px-4 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:bg-primary-container transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {connectionTesting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Testing Link...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">speed</span>
                          Test Azure Connection
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quick Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 bg-surface rounded-xl border border-surface-container-high space-y-1">
                      <div className="text-xs font-semibold text-outline">Telemetry Pipeline</div>
                      <div className="text-xl font-bold text-primary">48 events/min</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">Active streaming</div>
                    </div>
                    <div className="p-4 bg-surface rounded-xl border border-surface-container-high space-y-1">
                      <div className="text-xs font-semibold text-outline">Warehouse Storage</div>
                      <div className="text-xl font-bold text-on-surface">2.4 GB / 50 GB</div>
                      <div className="text-[10px] text-on-surface-variant font-medium">95.2% capacity free</div>
                    </div>
                    <div className="p-4 bg-surface rounded-xl border border-surface-container-high space-y-1">
                      <div className="text-xs font-semibold text-outline">Last Schema Sync</div>
                      <div className="text-xl font-bold text-on-surface">Oct 9, 2026</div>
                      <div className="text-[10px] text-teal-600 font-semibold">v4.1.8 Normalized</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Equipment Status Management */}
            {activeTab === 'equipment' && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-[20px]">medical_services</span>
                        </div>
                        <h2 className="text-lg font-bold text-on-surface">Operatory & Diagnostic Equipment Telemetry</h2>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1">Real-time IoT sensors and calibration schedules for clinical operatories.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Filter pills */}
                      <div className="flex bg-surface-container-high p-1 rounded-xl text-xs font-semibold">
                        <button 
                          onClick={() => setEquipmentFilter('all')}
                          className={`px-3 py-1 rounded-lg transition-all ${equipmentFilter === 'all' ? 'bg-surface-container-lowest shadow-xs text-on-surface font-bold' : 'text-on-surface-variant'}`}
                        >
                          All ({equipmentList.length})
                        </button>
                        <button 
                          onClick={() => setEquipmentFilter('Operational')}
                          className={`px-3 py-1 rounded-lg transition-all ${equipmentFilter === 'Operational' ? 'bg-surface-container-lowest shadow-xs text-emerald-600 font-bold' : 'text-on-surface-variant'}`}
                        >
                          Operational
                        </button>
                        <button 
                          onClick={() => setEquipmentFilter('Service Required')}
                          className={`px-3 py-1 rounded-lg transition-all ${equipmentFilter === 'Service Required' ? 'bg-surface-container-lowest shadow-xs text-rose-600 font-bold' : 'text-on-surface-variant'}`}
                        >
                          Needs Service
                        </button>
                      </div>

                      <button 
                        onClick={() => setIsAddEquipmentOpen(true)}
                        className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Equipment
                      </button>
                    </div>
                  </div>

                  {/* Equipment List */}
                  <div className="space-y-3">
                    {filteredEquipment.map((eq) => (
                      <div 
                        key={eq.id} 
                        className="p-4 bg-surface rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-container-high hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            eq.status === 'Operational' 
                              ? 'bg-teal-500/10 text-teal-600 border border-teal-500/20' 
                              : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          }`}>
                            <span className="material-symbols-outlined text-[22px]">{eq.icon}</span>
                          </div>
                          <div>
                            <div className="font-bold text-sm text-on-surface">{eq.name}</div>
                            <div className="text-xs text-on-surface-variant mt-0.5 flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-primary">{eq.location}</span>
                              <span>•</span>
                              <span>{eq.details}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <button 
                            onClick={() => toggleEquipmentStatus(eq.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              eq.status === 'Operational'
                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border border-rose-500/20'
                            }`}
                            title="Click to toggle status"
                          >
                            {eq.status}
                          </button>
                          <button 
                            onClick={() => {
                              setEquipmentList(prev => prev.filter(i => i.id !== eq.id));
                              showToast(`Removed "${eq.name}" from inventory.`);
                            }}
                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors cursor-pointer"
                            title="Remove equipment"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 6. Voice-to-Text Charting */}
            {activeTab === 'voice' && (
              <div className="space-y-6">
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-surface-container-high space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surface-container-low">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[26px]">mic</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-on-surface">AI Voice-to-Text Perio & Restorative Charting</h2>
                        <p className="text-xs text-on-surface-variant mt-0.5">Hands-free dental dictation for periodontal probe depth soundings and restorative procedures.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input 
                        type="checkbox" 
                        checked={voiceEnabled} 
                        onChange={(e) => {
                          setVoiceEnabled(e.target.checked);
                          showToast(e.target.checked ? 'AI voice charting activated.' : 'AI voice charting disabled.');
                        }}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-container-high">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Auto-Advance Perio Sounding</span>
                        <input 
                          type="checkbox" 
                          checked={autoAdvance} 
                          onChange={(e) => setAutoAdvance(e.target.checked)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                        />
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Automatically advance to next tooth number upon capturing millimeter pocket depths (e.g. "3-2-3").
                      </p>
                    </div>

                    <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-container-high">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Clinical Vocabulary Model</span>
                        <select 
                          value={vocabularyModel}
                          onChange={(e) => setVocabularyModel(e.target.value)}
                          className="bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold border-0 outline-none"
                        >
                          <option>Dental Pro v4.2 (US English)</option>
                          <option>Dental Pro v4.2 (UK English)</option>
                          <option>Specialized Endo / Perio Acoustics</option>
                        </select>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Acoustic model tuned to recognize ADA dental nomenclature and anatomical landmarks.
                      </p>
                    </div>

                    <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-container-high">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Drill & Suction Noise Cancellation</span>
                        <input 
                          type="checkbox" 
                          checked={noiseFilter} 
                          onChange={(e) => setNoiseFilter(e.target.checked)}
                          className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                        />
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Isolates doctor voice frequencies from high-speed turbine drills and saliva ejector hiss.
                      </p>
                    </div>

                    <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-container-high">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-on-surface">Audio Recording Retention</span>
                        <select 
                          value={audioRetention}
                          onChange={(e) => setAudioRetention(e.target.value)}
                          className="bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold border-0 outline-none"
                        >
                          <option>Discard Immediately</option>
                          <option>Retain 30 Days for Audit</option>
                        </select>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        HIPAA edge policy governing raw audio recording files on local operatory hardware.
                      </p>
                    </div>
                  </div>

                  {/* Live Interactive Voice Dictation Simulation */}
                  <div className="mt-4 p-5 bg-surface rounded-xl border border-primary/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">graphic_eq</span>
                        <h4 className="text-sm font-bold text-on-surface">Voice Dictation Testing Console</h4>
                      </div>
                      <button 
                        onClick={simulateVoiceDictation}
                        disabled={isSimulatingVoice}
                        className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-xs hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                      >
                        {isSimulatingVoice ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Listening to audio feed...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">mic</span>
                            Simulate Voice Dictation
                          </>
                        )}
                      </button>
                    </div>

                    {isSimulatingVoice && (
                      <div className="py-4 flex items-center justify-center gap-1">
                        <div className="w-1 h-6 bg-primary animate-pulse"></div>
                        <div className="w-1 h-10 bg-primary animate-pulse delay-75"></div>
                        <div className="w-1 h-4 bg-primary animate-pulse delay-100"></div>
                        <div className="w-1 h-8 bg-primary animate-pulse delay-150"></div>
                        <div className="w-1 h-12 bg-primary animate-pulse delay-200"></div>
                        <div className="w-1 h-5 bg-primary animate-pulse delay-75"></div>
                        <span className="ml-3 text-xs text-primary font-semibold">Capturing oral dictation stream...</span>
                      </div>
                    )}

                    {voiceOutput && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 bg-surface-container-lowest rounded-xl border border-primary/30 text-xs text-on-surface font-mono leading-relaxed"
                      >
                        <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-1 font-sans">
                          Parsed Structured Clinical Note:
                        </span>
                        {voiceOutput}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Add Equipment Modal - Portaled to document.body */}
      {isAddEquipmentOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full border border-surface-container-high overflow-hidden"
          >
            <div className="p-5 border-b border-surface-container-low flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">medical_services</span>
                </div>
                <h3 className="font-bold text-lg text-on-surface">Add Clinic Equipment</h3>
              </div>
              <button 
                onClick={() => setIsAddEquipmentOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddEquipment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Equipment Model / Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Planmeca ProX Intraoral X-ray" 
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Category</label>
                  <select 
                    value={newEqCategory}
                    onChange={(e) => setNewEqCategory(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/50 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>Imaging & Diagnostics</option>
                    <option>Digital Impression</option>
                    <option>Restorative Tools</option>
                    <option>Sterilization Bay</option>
                    <option>Surgical Laser</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1">Operatory</label>
                  <select 
                    value={newEqLocation}
                    onChange={(e) => setNewEqLocation(e.target.value)}
                    className="w-full bg-surface border border-outline-variant/50 rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option>Operatory 1</option>
                    <option>Operatory 2</option>
                    <option>Operatory 3</option>
                    <option>Operatory 4</option>
                    <option>Central Sterilization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Serial / Asset Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. SN-84920-PL" 
                  value={newEqSerial}
                  onChange={(e) => setNewEqSerial(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-surface-container-low flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsAddEquipmentOpen(false)}
                  className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
                >
                  Register Equipment
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
