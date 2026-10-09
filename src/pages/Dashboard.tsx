import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

export interface QuickNote {
  id: string;
  text: string;
  tag: 'Urgent' | 'Clinical' | 'Rx' | 'Lab' | 'Follow-up';
  time: string;
  completed: boolean;
}

export interface EquipmentStatusItem {
  id: string;
  name: string;
  status: 'Operational' | 'Maintenance Due' | 'In Use';
  operatory: string;
}

export interface TodayScheduleItem {
  time: string;
  timeSlot: string;
  name: string;
  id: string;
  initials: string;
  proc: string;
  tooth: string;
  operatory: string;
  doctor: string;
  anesthesia: string;
  status: 'In Progress' | 'Confirmed' | 'Completed';
  statusColor: string;
  avatarColor: string;
  ageGender: string;
  phone: string;
  email: string;
  medicalAlert: string;
  alertLevel: 'normal' | 'medium' | 'high';
  insurance: string;
  vitals: {
    bp: string;
    pulse: string;
    spo2: string;
    painLevel: string;
  };
  clinicalNotes: string;
  nextAction: string;
  prescriptions: string;
}

const INITIAL_TODAY_SCHEDULE: TodayScheduleItem[] = [
  {
    time: "09:00 AM",
    timeSlot: "09:00 AM - 09:45 AM",
    name: "Neha Gupta",
    id: "#40921",
    initials: "NG",
    proc: "Root Canal Therapy",
    tooth: "Tooth #19 (Lower Left First Molar)",
    operatory: "Operatory 01 — Dental Chair A",
    doctor: "Dr. Sarah Sharma, DDS",
    anesthesia: "2% Lidocaine with 1:100,000 Epinephrine (1.7 ml administered)",
    status: "In Progress",
    statusColor: "bg-primary text-on-primary",
    avatarColor: "bg-primary/10 text-primary",
    ageGender: "28 yrs • Female",
    phone: "+1 (555) 382-4910",
    email: "neha.gupta@example.com",
    medicalAlert: "Severe Penicillin Allergy • Pre-medicated with Clindamycin 600mg",
    alertLevel: "high",
    insurance: "Delta Dental Premier • Pre-authorized (#AUTH-84920)",
    vitals: { bp: "118/76 mmHg", pulse: "72 bpm", spo2: "99%", painLevel: "2 / 10" },
    clinicalNotes: "Rubber dam isolation verified. Working length confirmed with Apex Locator: MB 21mm, ML 21mm, Distal 22mm. Biomechanical prep completed to size #30.04. Calcium hydroxide paste placed.",
    nextAction: "Obturation with gutta-percha & permanent resin core restoration in 10 days.",
    prescriptions: "Amoxicillin contraindicated. Rx: Clindamycin 300mg QID x 7 days, Ibuprofen 600mg PRN pain."
  },
  {
    time: "10:15 AM",
    timeSlot: "10:15 AM - 11:00 AM",
    name: "Mark Singh",
    id: "#40922",
    initials: "MS",
    proc: "Routine Cleaning & Exam",
    tooth: "Full Dentition Prophylaxis (All Quadrants)",
    operatory: "Operatory 02 — Hygiene Bay",
    doctor: "Dr. Sarah Sharma, DDS • Hygienist Lisa Wong",
    anesthesia: "None • Topical 20% Benzocaine Gel applied to sulcus",
    status: "Confirmed",
    statusColor: "bg-surface-container-high text-on-surface",
    avatarColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    ageGender: "34 yrs • Male",
    phone: "+1 (555) 791-3042",
    email: "mark.singh@example.com",
    medicalAlert: "No Known Drug Allergies (NKDA) • Mild Gingival Bleeding",
    alertLevel: "normal",
    insurance: "MetLife Dental PPO • Policy #ML-99214 (100% Preventive)",
    vitals: { bp: "122/80 mmHg", pulse: "68 bpm", spo2: "98%", painLevel: "0 / 10" },
    clinicalNotes: "Full mouth ultrasonic Cavitron scaling completed. Fine hand scaling on lingual lower anteriors. Applied 5% Sodium Fluoride varnish. 4-bitewing radiographs captured with zero recurrent caries.",
    nextAction: "6-month periodontal maintenance recall scheduled for April 2027.",
    prescriptions: "Prescription chlorhexidine gluconate 0.12% oral rinse BID x 14 days."
  },
  {
    time: "11:30 AM",
    timeSlot: "11:30 AM - 12:15 PM",
    name: "Alice Ross",
    id: "#40925",
    initials: "AR",
    proc: "Orthodontic Adjustment",
    tooth: "Maxillary & Mandibular Fixed Brackets (Roth 0.022)",
    operatory: "Operatory 03 — Orthodontic Bay",
    doctor: "Dr. Sarah Sharma, DDS",
    anesthesia: "None required",
    status: "Confirmed",
    statusColor: "bg-surface-container-high text-on-surface",
    avatarColor: "bg-secondary-container text-on-secondary-container",
    ageGender: "22 yrs • Female",
    phone: "+1 (555) 843-1992",
    email: "alice.ross@example.com",
    medicalAlert: "Latex Allergy (Confirmed) — Non-Latex Gloves & Elastics Only",
    alertLevel: "medium",
    insurance: "Cigna Dental Care • Lifetime Ortho Coverage ($2,500 max)",
    vitals: { bp: "114/72 mmHg", pulse: "74 bpm", spo2: "99%", painLevel: "1 / 10" },
    clinicalNotes: "Upper archwire stepped up from 0.014 to 0.016 x 0.022 Rectangular NiTi. Lower archwire cinched. Power chain placed from #6 to #11 to consolidate anterior spacing. Good oral hygiene maintained.",
    nextAction: "4-week follow-up for torque verification and Class II elastic check.",
    prescriptions: "Orthodontic relief wax provided for comfort."
  },
  {
    time: "01:30 PM",
    timeSlot: "01:30 PM - 02:30 PM",
    name: "Robert King",
    id: "#40930",
    initials: "RK",
    proc: "Teeth Whitening Session",
    tooth: "Anterior Aesthetic Zone (#6 - #11, #22 - #27)",
    operatory: "Operatory 04 — Aesthetic Suite",
    doctor: "Dr. Sarah Sharma, DDS",
    anesthesia: "None • Potassium Nitrate desensitizing pre-treatment",
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-800",
    avatarColor: "bg-surface-container-high text-on-surface",
    ageGender: "45 yrs • Male",
    phone: "+1 (555) 629-8401",
    email: "robert.king@example.com",
    medicalAlert: "Mild Enamel Micro-crack on Tooth #8 • No Allergies",
    alertLevel: "normal",
    insurance: "Self-Pay / Patient Financing ($450 Paid in Full)",
    vitals: { bp: "126/82 mmHg", pulse: "70 bpm", spo2: "98%", painLevel: "0 / 10" },
    clinicalNotes: "In-office 38% Hydrogen Peroxide light-cured whitening completed in three 15-minute passes. Gingival barrier placed with zero tissue blanching. Starting shade A3.5 -> Final shade B1 (6 shades brighter).",
    nextAction: "Post-whitening review in 2 weeks. Custom take-home maintenance trays delivered.",
    prescriptions: "Relief ACP oral care gel for 48-hour post-bleaching sensitivity."
  },
  {
    time: "03:00 PM",
    timeSlot: "03:00 PM - 03:45 PM",
    name: "Anjali Lane",
    id: "#40935",
    initials: "AL",
    proc: "Emergency Crown Fix",
    tooth: "Tooth #14 (Upper Left First Molar PFM Crown)",
    operatory: "Operatory 01 — Urgent Operatory",
    doctor: "Dr. Sarah Sharma, DDS",
    anesthesia: "Local Infiltration: 4% Articaine with 1:100,000 Epinephrine (1.2 ml)",
    status: "Confirmed",
    statusColor: "bg-surface-container-high text-on-surface",
    avatarColor: "bg-error-container text-on-error-container",
    ageGender: "41 yrs • Female",
    phone: "+1 (555) 914-7260",
    email: "anjali.lane@example.com",
    medicalAlert: "Hypertension (Managed on Lisinopril 10mg) • Monitored BP",
    alertLevel: "medium",
    insurance: "Guardian Dental Gold • Pre-approved Emergency Copay: $35",
    vitals: { bp: "132/84 mmHg", pulse: "78 bpm", spo2: "97%", painLevel: "3 / 10" },
    clinicalNotes: "Patient arrived with dislodged porcelain-fused-to-metal crown. Tooth prep examined under loupes: core build-up intact with no secondary caries. Internal surface sandblasted with 50um alumina. Recemented with RelyX Luting Plus resin-modified glass ionomer. Occlusion checked with 21um articulating paper.",
    nextAction: "Check margin stability and gingival response at 3-week post-op.",
    prescriptions: "Warm salt water rinses TID. PRN Ibuprofen 400mg."
  }
];

const INITIAL_NOTES: QuickNote[] = [
  { 
    id: '1', 
    text: 'Check incisal biopsy pathology report from LabCorp for Marcus Chen #40921', 
    tag: 'Lab', 
    time: '15m ago', 
    completed: false 
  },
  { 
    id: '2', 
    text: 'Restock 2% Mepivacaine carpules & 30G short needles in Operatory 02', 
    tag: 'Clinical', 
    time: '1h ago', 
    completed: false 
  },
  { 
    id: '3', 
    text: 'Follow up with Ananya Sterling post-root canal checkup in 2 weeks', 
    tag: 'Follow-up', 
    time: '3h ago', 
    completed: true 
  }
];

export default function Dashboard() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [isVoiceConfigOpen, setIsVoiceConfigOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Today's Patient Schedule State & Detailed Popup
  const [todaySchedule, setTodaySchedule] = useState<TodayScheduleItem[]>(INITIAL_TODAY_SCHEDULE);
  const [selectedSchedulePatient, setSelectedSchedulePatient] = useState<TodayScheduleItem | null>(null);

  const handleUpdateScheduleStatus = (patientId: string, newStatus: 'In Progress' | 'Confirmed' | 'Completed') => {
    const statusColorMap = {
      'In Progress': 'bg-primary text-on-primary',
      'Confirmed': 'bg-surface-container-high text-on-surface',
      'Completed': 'bg-emerald-100 text-emerald-800'
    };

    setTodaySchedule(prev => prev.map(item => {
      if (item.id === patientId) {
        const updated: TodayScheduleItem = {
          ...item,
          status: newStatus,
          statusColor: statusColorMap[newStatus]
        };
        if (selectedSchedulePatient?.id === patientId) {
          setSelectedSchedulePatient(updated);
        }
        return updated;
      }
      return item;
    }));

    showToast(`Appointment status updated to "${newStatus}"!`);
  };

  const handleCopyChartSummary = (patient: TodayScheduleItem) => {
    const summary = `PATIENT: ${patient.name} (${patient.id})\nPROCEDURE: ${patient.proc} - ${patient.tooth}\nOPERATORY: ${patient.operatory} | DOCTOR: ${patient.doctor}\nVITALS: BP: ${patient.vitals.bp}, HR: ${patient.vitals.pulse}, SpO2: ${patient.vitals.spo2}\nALERTS: ${patient.medicalAlert}\nNOTES: ${patient.clinicalNotes}\nNEXT STEP: ${patient.nextAction}`;
    navigator.clipboard.writeText(summary);
    showToast(`Clinical chart summary for ${patient.name} copied to clipboard!`);
  };

  // Quick Notes State
  const [notes, setNotes] = useState<QuickNote[]>(INITIAL_NOTES);
  const [noteText, setNoteText] = useState("");
  const [noteTag, setNoteTag] = useState<'Urgent' | 'Clinical' | 'Rx' | 'Lab' | 'Follow-up'>('Clinical');
  const [noteTab, setNoteTab] = useState<'write' | 'list'>('write');

  // AI Voice Charting Feature State
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [audioSource, setAudioSource] = useState('Chairside Wireless Headset (Recommended)');
  const [noiseFilterEnabled, setNoiseFilterEnabled] = useState(true);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [vocabularyModel, setVocabularyModel] = useState('Dental Pro v4.2 — ADA Diagnostic Nomenclature');
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [testAudioOutput, setTestAudioOutput] = useState<string | null>(null);

  // Equipment Status State
  const [equipmentList, setEquipmentList] = useState<EquipmentStatusItem[]>([
    { id: '1', name: "Digital X-Ray Unit A", status: "Operational", operatory: "Operatory 1" },
    { id: '2', name: "Autoclave Sterilizer #2", status: "Operational", operatory: "Sterilization Bay" },
    { id: '3', name: "Laser Scaler Unit", status: "Maintenance Due", operatory: "Operatory 3" }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Quick Note Actions
  const handleSaveNote = () => {
    if (!noteText.trim()) {
      showToast("Please enter note text first.");
      return;
    }

    const newNote: QuickNote = {
      id: Date.now().toString(),
      text: noteText.trim(),
      tag: noteTag,
      time: "Just now",
      completed: false
    };

    setNotes([newNote, ...notes]);
    setNoteText("");
    showToast(`Quick note saved under "${noteTag}" tag!`);
    setNoteTab('list');
  };

  const handleToggleNoteComplete = (id: string) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, completed: !n.completed } : n));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast("Note removed from pad.");
  };

  // Toggle Equipment Status
  const handleToggleEquipment = (id: string) => {
    setEquipmentList(prev => prev.map(eq => {
      if (eq.id === id) {
        const nextStatus = eq.status === 'Operational' ? 'Maintenance Due' : 'Operational';
        return { ...eq, status: nextStatus };
      }
      return eq;
    }));
    showToast("Operatory equipment status updated.");
  };

  // Test Audio Simulation
  const handleTestAudioStream = () => {
    setIsTestingAudio(true);
    setTestAudioOutput(null);

    setTimeout(() => {
      setIsTestingAudio(false);
      setTestAudioOutput("Tooth #14: MOD composite resin placed. Tooth #19: Periodontal probing depth 3-2-3 mm, zero bleeding upon probing. Anesthesia: 1.7ml Lidocaine 2% with 1:100,000 epinephrine.");
      showToast("Operatory audio test successful! Acoustic parsing verified.");
    }, 1400);
  };

  // Save Voice Configuration
  const handleSaveVoiceConfig = () => {
    setIsVoiceEnabled(true);
    setIsVoiceConfigOpen(false);
    showToast("AI Voice-to-Text Charting enabled and configured for all operatories!");
  };

  const getTagBadgeStyle = (tag: QuickNote['tag']) => {
    switch (tag) {
      case 'Urgent': return 'bg-rose-100 text-rose-700 border-rose-300';
      case 'Lab': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Rx': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Clinical': return 'bg-teal-100 text-teal-700 border-teal-300';
      case 'Follow-up': return 'bg-amber-100 text-amber-700 border-amber-300';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 relative pb-12"
    >
      {/* Shared Non-Intrusive Portaled Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-xs font-bold text-primary tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">stethoscope</span>
            Clinical Workspace
          </div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-1">Good morning, Dr. Sharma</h1>
          <p className="text-sm text-on-surface-variant">Here is your practice overview and patient schedule for today.</p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => setIsNewPatientOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer border border-surface-container-highest"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            New Patient
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-semibold transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
            Schedule Appointment
          </motion.button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FEATURED: PROPNEX AI VOICE AGENT (INBOUND & OUTBOUND CALLING HUB)          */}
      {/* ========================================================================= */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#02444c] to-[#01272c] text-on-primary p-6 lg:p-8 shadow-xl border border-white/15"
      >
        {/* Ambient Gradient Glows & Watermarks */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-6 -bottom-6 opacity-5 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[260px]">support_agent</span>
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column (7 cols): Hero & Calling Capabilities */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Indicator Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                PropNex AI Voice Agent Online
              </span>
              <span className="text-[11px] font-semibold text-primary-fixed-dim bg-black/25 px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-emerald-400">bolt</span>
                380ms Latency • HIPAA Tier 4
              </span>
              <span className="text-[11px] font-semibold text-primary-fixed-dim bg-black/25 px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-cyan-300">phone_in_talk</span>
                24/7 Inbound & Outbound Calling
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2 leading-tight">
                Autonomous Dental Voice Agent & Receptionist Suite
              </h2>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed max-w-2xl font-normal">
                PropNex AI delivers autonomous 24/7 inbound patient intake and automated outbound recall campaigns. The agent screens dental emergencies, books directly into operatory chairs, and verifies insurance with human-grade conversational intelligence.
              </p>
            </div>

            {/* Inbound vs Outbound Calling Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Inbound Calling Box */}
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-start gap-3 hover:bg-white/15 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">call_received</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Inbound Calling Hub
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-400/20 text-emerald-300 rounded font-bold">24/7 LIVE</span>
                  </div>
                  <div className="text-[11px] text-white/80 leading-snug mt-0.5 font-normal">
                    Instant call answering, direct chair booking, emergency triage & copay screening.
                  </div>
                </div>
              </div>

              {/* Outbound Calling Box */}
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-start gap-3 hover:bg-white/15 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/30 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">call_made</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Outbound Campaigns
                    <span className="text-[9px] px-1.5 py-0.2 bg-cyan-400/20 text-cyan-300 rounded font-bold">AUTONOMOUS</span>
                  </div>
                  <div className="text-[11px] text-white/80 leading-snug mt-0.5 font-normal">
                    Automated 6-month hygiene recalls, 24h post-op check-ins & no-show reduction.
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons & Direct Redirection Link */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://propnexai.com/auth/sign-in"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-white text-primary hover:bg-slate-50 font-bold text-xs shadow-lg shadow-black/20 flex items-center gap-2 cursor-pointer transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">rocket_launch</span>
                <span>Launch PropNex AI Voice Dashboard</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-primary/70">open_in_new</span>
              </a>

              <button
                type="button"
                onClick={() => setIsVoiceConfigOpen(true)}
                className="px-4 py-3 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold text-xs border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">graphic_eq</span>
                <span>Voice Simulator & Setup</span>
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Live Telemetry Glass Card & Audio Wave */}
          <div className="lg:col-span-5 bg-black/30 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex flex-col justify-between space-y-4 shadow-inner">
            {/* Agent Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 p-0.5 shadow-md">
                    <div className="w-full h-full bg-[#01353c] rounded-[14px] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[24px]">support_agent</span>
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-primary"></span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Aria • Dental AI Receptionist
                  </div>
                  <div className="text-[10px] text-white/70">PropNex Neural Voice Engine v4.2</div>
                </div>
              </div>
              
              {/* Equalizer Wave Bars */}
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="w-1 h-5 bg-cyan-300 rounded-full animate-pulse delay-75"></span>
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
                <span className="w-1 h-6 bg-cyan-300 rounded-full animate-pulse delay-100"></span>
                <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-200"></span>
              </div>
            </div>

            {/* Live Telemetry Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-emerald-400">call_received</span>
                  Inbound Handled
                </div>
                <div className="text-lg font-bold text-white mt-1">142 Calls</div>
                <div className="text-[10px] text-emerald-300 font-medium">99.4% Zero-wait resolution</div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-cyan-300">call_made</span>
                  Outbound Recalls
                </div>
                <div className="text-lg font-bold text-white mt-1">89 Patients</div>
                <div className="text-[10px] text-cyan-300 font-medium">74% Re-booked into chairs</div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-amber-300">speed</span>
                  Speech Latency
                </div>
                <div className="text-lg font-bold text-white mt-1">~380 ms</div>
                <div className="text-[10px] text-white/70 font-medium">Ultra-low human tempo</div>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-purple-300">verified</span>
                  Staff Time Saved
                </div>
                <div className="text-lg font-bold text-white mt-1">18.5 hrs</div>
                <div className="text-[10px] text-white/70 font-medium">This week across clinic</div>
              </div>
            </div>

            {/* Quick Redirect Link Strip */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/80">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                SIP Trunking Online
              </span>
              <a
                href="https://propnexai.com/auth/sign-in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-white font-semibold underline flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <span>propnexai.com</span>
                <span className="material-symbols-outlined text-[13px]">north_east</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Appointments", value: "24", sub: "+12% from yesterday", icon: "calendar_today", color: "text-primary", bg: "bg-primary-container/10 border-primary-container/20" },
          { label: "Pending Reviews", value: "7", sub: "3 urgent responses", icon: "rate_review", color: "text-secondary", bg: "bg-secondary-container/10 border-secondary-container/20" },
          { label: "Clinical Satisfaction", value: "98.4%", sub: "Top 5% in district", icon: "sentiment_very_satisfied", color: "text-tertiary", bg: "bg-tertiary-container/10 border-tertiary-container/20" },
          { label: "Active Patients", value: "2,482", sub: "Live database sync", icon: "group", color: "text-primary", bg: "bg-primary-fixed/10 border-primary-fixed/20" },
        ].map((item, i) => (
          <div key={i} className={`p-5 rounded-2xl bg-surface-container-lowest border ${item.bg} shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{item.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center ${item.color}`}>
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-on-surface mb-1">{item.value}</div>
              <div className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {item.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mid Section: Active Schedule Table & Weekly Volume Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Schedule Queue */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Today's Patient Schedule</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Operatory queues & procedure timeline</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                5 Active Today
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-surface-container-low text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    <th className="p-3 pl-4">Time</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Procedure</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-on-surface divide-y divide-surface-container-low/50">
                  {todaySchedule.map((row) => (
                    <tr key={row.id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="p-4 pl-4 font-bold whitespace-nowrap text-xs">{row.time}</td>
                      <td className="p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${row.avatarColor}`}>{row.initials}</div>
                        <div>
                          <div className="font-bold whitespace-nowrap text-xs">{row.name}</div>
                          <div className="text-[11px] text-on-surface-variant font-medium">ID: {row.id}</div>
                        </div>
                      </td>
                      <td className="p-4 text-on-surface-variant whitespace-nowrap text-xs font-medium">{row.proc}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-4 pr-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => setSelectedSchedulePatient(row)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer group"
                          title={`Open clinical appointment details for ${row.name}`}
                        >
                          <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Weekly Schedule Overview */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-on-surface">Weekly Overview</h2>
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg">Oct 20 - Oct 26</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-6">Appointment volume distribution across weekdays.</p>
            
            <div className="flex items-end justify-between h-48 pt-4 px-2 gap-2">
              {[
                { day: "Mon", val: "10", height: "60%" },
                { day: "Tue", val: "14", height: "85%" },
                { day: "Wed", val: "12", height: "70%" },
                { day: "Thu", val: "16", height: "100%", active: true },
                { day: "Fri", val: "11", height: "65%" },
                { day: "Sat", val: "6", height: "35%" },
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                  <div className="text-xs font-bold text-on-surface-variant mb-2 opacity-0 group-hover:opacity-100 transition-opacity">{bar.val}</div>
                  <div className={`w-full transition-all rounded-t-xl ${bar.active ? 'bg-primary hover:bg-primary-container shadow-sm' : 'bg-primary/20 hover:bg-primary'}`} style={{ height: bar.height }}></div>
                  <span className={`text-xs mt-3 ${bar.active ? 'font-bold text-primary' : 'text-on-surface-variant font-semibold'}`}>{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-surface-container-low/80 flex justify-between items-center">
            <div>
              <div className="text-xs font-semibold text-on-surface-variant mb-1">Total Weekly Load</div>
              <div className="text-xl font-bold text-on-surface">69 Patients</div>
            </div>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">trending_up</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section: Quick Note Pad, Equipment Status, and AI Voice Charting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        
        {/* 1. UPGRADED & FUNCTIONAL QUICK NOTE PAD */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-on-surface">Quick Note Pad</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                  {notes.filter(n => !n.completed).length} Active
                </span>
              </div>
              
              {/* Tab Selector: Write vs View Saved */}
              <div className="flex bg-surface-container-high p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setNoteTab('write')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    noteTab === 'write' ? 'bg-surface-container-lowest text-primary font-bold shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  New Note
                </button>
                <button
                  onClick={() => setNoteTab('list')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    noteTab === 'list' ? 'bg-surface-container-lowest text-primary font-bold shadow-xs' : 'text-on-surface-variant'
                  }`}
                >
                  Saved ({notes.length})
                </button>
              </div>
            </div>

            {/* View Mode 1: Write New Note */}
            {noteTab === 'write' ? (
              <div className="space-y-3">
                {/* Tag Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                    Category Tag:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {(['Clinical', 'Rx', 'Lab', 'Urgent', 'Follow-up'] as QuickNote['tag'][]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNoteTag(t)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          noteTag === t 
                            ? 'bg-primary text-on-primary border-primary shadow-xs' 
                            : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container-high'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-3.5 bg-surface-container-low/60 rounded-xl text-on-surface border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-xs leading-relaxed transition-all font-medium" 
                  placeholder="Type quick patient reminders, prescription notes, or chairside alerts here..." 
                  rows={4}
                />
              </div>
            ) : (
              /* View Mode 2: Saved Notes List */
              <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
                {notes.length === 0 ? (
                  <div className="py-8 text-center text-xs text-outline">
                    No saved notes currently.
                  </div>
                ) : (
                  notes.map((note) => (
                    <div 
                      key={note.id}
                      className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5 ${
                        note.completed 
                          ? 'bg-surface-container-low/40 border-surface-container-high/60 opacity-60' 
                          : 'bg-surface-container-lowest border-surface-container-high shadow-xs'
                      }`}
                    >
                      <button 
                        onClick={() => handleToggleNoteComplete(note.id)}
                        className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer ${
                          note.completed ? 'bg-primary border-primary text-white' : 'border-outline hover:border-primary'
                        }`}
                        title={note.completed ? "Mark active" : "Mark completed"}
                      >
                        {note.completed && <span className="material-symbols-outlined text-[12px]">check</span>}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTagBadgeStyle(note.tag)}`}>
                            {note.tag}
                          </span>
                          <span className="text-[10px] text-on-surface-variant">{note.time}</span>
                        </div>
                        <p className={`text-xs text-on-surface leading-snug ${note.completed ? 'line-through text-outline' : ''}`}>
                          {note.text}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-on-surface-variant hover:text-error transition-colors p-1"
                        title="Delete note"
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-surface-container-low">
            <span className="text-[11px] text-outline font-medium">Auto-saves to browser session</span>
            {noteTab === 'write' ? (
              <button 
                onClick={handleSaveNote}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">save</span>
                Save Note
              </button>
            ) : (
              <button 
                onClick={() => setNoteTab('write')}
                className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                Write New Note
              </button>
            )}
          </div>
        </div>

        {/* 2. EQUIPMENT STATUS CARD */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-surface-container-high p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Equipment Status</h2>
                <p className="text-xs text-on-surface-variant mt-0.5">Real-time telemetry indicators</p>
              </div>
              <span className="material-symbols-outlined text-emerald-600 text-[24px]">check_circle</span>
            </div>
            
            <div className="space-y-3">
              {equipmentList.map((eq) => (
                <div 
                  key={eq.id} 
                  onClick={() => handleToggleEquipment(eq.id)}
                  className="flex justify-between items-center p-3.5 bg-surface-container-low/60 rounded-xl border border-surface-container-high hover:border-primary/40 transition-colors cursor-pointer group"
                  title="Click to toggle status"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${eq.status === 'Operational' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    <div>
                      <span className="text-xs font-bold text-on-surface block">{eq.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-medium">{eq.operatory}</span>
                    </div>
                  </div>
                  
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    eq.status === 'Operational' 
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                      : 'text-amber-700 bg-amber-50 border-amber-200'
                  }`}>
                    {eq.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-surface-container-low flex justify-between items-center text-xs text-on-surface-variant">
            <span>Operatory Telemetry: Active</span>
            <span className="font-bold text-primary">All Systems Online</span>
          </div>
        </div>

        {/* 3. PROPNEX AI VOICE & TELEPHONY CALLING CARD */}
        <div className="bg-gradient-to-br from-primary to-[#01353c] text-on-primary rounded-2xl shadow-md p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden border border-white/10">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 pointer-events-none">
            <span className="material-symbols-outlined text-[180px]">support_agent</span>
          </div>
          
          <div className="z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-400">phone_in_talk</span>
                PropNex AI Calling Suite
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Inbound & Outbound Live
              </span>
            </div>

            <h3 className="text-xl font-bold text-on-primary leading-tight">Autonomous Dental Voice Agent</h3>
            <p className="text-xs text-on-primary/85 leading-relaxed font-medium">
              Seamlessly handles 24/7 patient call triage, chair bookings, emergency screenings, and automated 6-month hygiene recall campaigns.
            </p>

            {/* Inbound & Outbound Micro Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 bg-white/10 rounded-xl border border-white/15 text-left">
                <span className="text-[10px] text-white/70 font-semibold block uppercase">INBOUND CALLS</span>
                <span className="text-xs font-bold text-white">142 Handled</span>
                <span className="text-[10px] text-emerald-300 block">0s Hold Time</span>
              </div>
              <div className="p-2 bg-white/10 rounded-xl border border-white/15 text-left">
                <span className="text-[10px] text-white/70 font-semibold block uppercase">OUTBOUND RECALLS</span>
                <span className="text-xs font-bold text-white">89 Dispatched</span>
                <span className="text-[10px] text-cyan-300 block">74% Re-booked</span>
              </div>
            </div>
          </div>

          <div className="mt-5 z-10 flex flex-col sm:flex-row items-center gap-2 pt-1 border-t border-white/10">
            <a 
              href="https://propnexai.com/auth/sign-in"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 px-4 py-2.5 bg-white text-primary rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">rocket_launch</span>
              <span>Launch PropNex AI</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform text-primary/70">open_in_new</span>
            </a>

            <button 
              type="button"
              onClick={() => setIsVoiceConfigOpen(true)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-white/15 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Setup</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 1. AI VOICE CHARTING CONFIGURATION MODAL (Portaled to document.body)      */}
      {/* ========================================================================= */}
      {isVoiceConfigOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Fullscreen Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsVoiceConfigOpen(false)}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 0 }} 
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">mic</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-on-surface">AI Voice-to-Text Charting Setup</h2>
                  <p className="text-xs text-outline mt-0.5">Automated hands-free periodontal soundings & restorative dictation</p>
                </div>
              </div>
              <button 
                onClick={() => setIsVoiceConfigOpen(false)} 
                className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Hardware Selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-outline">Operatory Microphone Source</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">headset_mic</span>
                  <select 
                    value={audioSource}
                    onChange={(e) => setAudioSource(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium appearance-none cursor-pointer"
                  >
                    <option>Chairside Wireless Headset (Recommended)</option>
                    <option>Operatory 1 Lapel Microphone</option>
                    <option>Ceiling Beamforming Array (Noise-Isolated)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Acoustic Model */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-outline">Clinical Vocabulary Model</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">model_training</span>
                  <select 
                    value={vocabularyModel}
                    onChange={(e) => setVocabularyModel(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium appearance-none cursor-pointer"
                  >
                    <option>Dental Pro v4.2 — ADA Diagnostic Nomenclature</option>
                    <option>Dental Pro Specialty — Perio & Endo Depth Coding</option>
                    <option>General Medical EHR Model</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-surface-container-low">
                <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-surface-container-high">
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Drill & Suction High-Pass Filter</span>
                    <span className="text-[11px] text-on-surface-variant">Suppress high-frequency dental drill whine and saliva ejector hiss</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={noiseFilterEnabled} 
                    onChange={(e) => setNoiseFilterEnabled(e.target.checked)} 
                    className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-surface-container-high">
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Auto-Advance Perio Soundings</span>
                    <span className="text-[11px] text-on-surface-variant">Advance to next tooth number automatically upon capturing pocket depths</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoAdvanceEnabled} 
                    onChange={(e) => setAutoAdvanceEnabled(e.target.checked)} 
                    className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-surface rounded-xl border border-surface-container-high">
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Audio Confirmation Chime</span>
                    <span className="text-[11px] text-on-surface-variant">Play gentle tone after completing quadrant examination</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={chimeEnabled} 
                    onChange={(e) => setChimeEnabled(e.target.checked)} 
                    className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                  />
                </div>
              </div>

              {/* Audio Test Console */}
              <div className="p-4 bg-surface rounded-xl border border-primary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">graphic_eq</span>
                    <span className="text-xs font-bold text-on-surface">Test Operatory Audio Stream</span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleTestAudioStream}
                    disabled={isTestingAudio}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:bg-primary-container transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingAudio ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Listening...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[15px]">play_arrow</span>
                        Simulate Audio
                      </>
                    )}
                  </button>
                </div>

                {isTestingAudio && (
                  <div className="py-3 flex items-center justify-center gap-1">
                    <div className="w-1 h-4 bg-primary animate-pulse"></div>
                    <div className="w-1 h-8 bg-primary animate-pulse delay-75"></div>
                    <div className="w-1 h-12 bg-primary animate-pulse delay-150"></div>
                    <div className="w-1 h-6 bg-primary animate-pulse delay-75"></div>
                    <span className="ml-3 text-xs text-primary font-semibold">Parsing speech frequencies...</span>
                  </div>
                )}

                {testAudioOutput && (
                  <div className="p-3 bg-surface-container-lowest rounded-xl border border-primary/30 text-xs text-on-surface font-mono leading-relaxed">
                    <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-0.5 font-sans">
                      Recognized Charting Data:
                    </span>
                    {testAudioOutput}
                  </div>
                )}
              </div>

              {/* PropNex AI Inbound & Outbound Calling Cloud Integration */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-2xl border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">PropNex AI Telephony & Calling Portal</h4>
                    <p className="text-[11px] text-on-surface-variant">Manage live 24/7 inbound patient intake, SIP trunk routing & automated outbound recall campaigns.</p>
                  </div>
                </div>
                <a
                  href="https://propnexai.com/auth/sign-in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-xs cursor-pointer"
                >
                  <span>Sign In to PropNex AI</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-surface-container-low bg-surface-container-lowest flex justify-end gap-3 px-6">
              <button 
                type="button" 
                onClick={() => setIsVoiceConfigOpen(false)} 
                className="px-5 py-2.5 rounded-xl font-medium text-xs text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSaveVoiceConfig} 
                className="px-6 py-2.5 rounded-xl font-semibold text-xs bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container transition-colors cursor-pointer flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Save & Enable Voice Charting
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. SCHEDULE APPOINTMENT MODAL (Portaled to document.body)                 */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isScheduleOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setIsScheduleOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 0 }} 
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto"
              >
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">calendar_add_on</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">Schedule Appointment</h2>
                      <p className="text-xs text-outline">Select patient, chair operatory and procedure slot.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsScheduleOpen(false)} className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Patient Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">person_search</span>
                      <input type="text" placeholder="Search patient name or ID..." className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Date</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">calendar_today</span>
                        <input type="date" defaultValue="2023-10-24" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Time Slot</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">schedule</span>
                        <input type="time" defaultValue="10:30" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Procedure Type</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">dentistry</span>
                      <select className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer text-xs font-medium">
                        <option>Routine Checkup & Cleaning</option>
                        <option>Root Canal Therapy</option>
                        <option>Orthodontic Adjustment</option>
                        <option>Teeth Whitening</option>
                        <option>Dental Implants</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-surface-container-low bg-surface-container-lowest flex justify-end gap-3 px-6">
                  <button onClick={() => setIsScheduleOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-xs text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer">Cancel</button>
                  <button 
                    onClick={() => { 
                      setIsScheduleOpen(false); 
                      showToast("Appointment scheduled successfully!"); 
                    }} 
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-primary text-on-primary shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
                  >
                    Confirm Schedule
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 3. REGISTER NEW PATIENT MODAL (Portaled to document.body)                 */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isNewPatientOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setIsNewPatientOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 0 }} 
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto"
              >
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">person_add</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">Register New Patient</h2>
                      <p className="text-xs text-outline">Enter patient demographics & contact details.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsNewPatientOpen(false)} className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">person</span>
                      <input type="text" placeholder="e.g. John Doe" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Phone Number</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">call</span>
                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Date of Birth</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">calendar_today</span>
                        <input type="date" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">mail</span>
                      <input type="email" placeholder="john.doe@example.com" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium" />
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-surface-container-low bg-surface-container-lowest flex justify-end gap-3 px-6">
                  <button onClick={() => setIsNewPatientOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-xs text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer">Cancel</button>
                  <button 
                    onClick={() => { 
                      setIsNewPatientOpen(false); 
                      showToast("New patient record created successfully!"); 
                    }} 
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-primary text-on-primary shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
                  >
                    Create Record
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 4. PATIENT SCHEDULE DETAIL & CONFIGURATION MODAL (Portaled to body)       */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedSchedulePatient && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setSelectedSchedulePatient(null)}
              />
              
              {/* Dialog Content */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.94, y: 15 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.94, y: 10 }} 
                transition={{ type: "spring", damping: 25, stiffness: 320 }}
                className="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
              >
                {/* Modal Header */}
                <div className="p-5 sm:p-6 border-b border-surface-container-low flex justify-between items-center bg-gradient-to-r from-surface-container-low/50 via-surface-container-lowest to-surface-container-low/30">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shadow-sm shrink-0 ${selectedSchedulePatient.avatarColor}`}>
                      {selectedSchedulePatient.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-on-surface">{selectedSchedulePatient.name}</h2>
                        <span className="text-xs font-mono font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
                          {selectedSchedulePatient.id}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${selectedSchedulePatient.statusColor}`}>
                          {selectedSchedulePatient.status}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5 flex items-center gap-2">
                        <span>{selectedSchedulePatient.ageGender}</span>
                        <span>•</span>
                        <span>{selectedSchedulePatient.phone}</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedSchedulePatient(null)} 
                    className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer shrink-0"
                    title="Close modal"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
                  {/* Quick Overview Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Time Slot</span>
                      <span className="text-xs font-bold text-on-surface mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">schedule</span>
                        {selectedSchedulePatient.timeSlot}
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Operatory Location</span>
                      <span className="text-xs font-bold text-on-surface mt-0.5 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-teal-600">door_front</span>
                        {selectedSchedulePatient.operatory}
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Lead Clinician</span>
                      <span className="text-xs font-bold text-on-surface mt-0.5 truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-sky-600">badge</span>
                        {selectedSchedulePatient.doctor}
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Target Tooth / Arch</span>
                      <span className="text-xs font-bold text-primary mt-0.5 truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">dentistry</span>
                        {selectedSchedulePatient.tooth}
                      </span>
                    </div>
                  </div>

                  {/* Medical Alert Callout */}
                  <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                    selectedSchedulePatient.alertLevel === 'high'
                      ? 'bg-rose-50 border-rose-200 text-rose-900'
                      : selectedSchedulePatient.alertLevel === 'medium'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <span className={`material-symbols-outlined text-[20px] shrink-0 ${
                      selectedSchedulePatient.alertLevel === 'high' ? 'text-rose-600' : selectedSchedulePatient.alertLevel === 'medium' ? 'text-amber-600' : 'text-emerald-600'
                    }`}>
                      {selectedSchedulePatient.alertLevel === 'normal' ? 'verified_user' : 'warning'}
                    </span>
                    <div>
                      <span className="font-bold block text-xs">Medical Alerts & Clinical Precautions</span>
                      <p className="text-xs mt-0.5 leading-relaxed">{selectedSchedulePatient.medicalAlert}</p>
                    </div>
                  </div>

                  {/* Vitals Telemetry Grid */}
                  <div className="p-3.5 bg-surface-container-low/70 rounded-xl border border-surface-container-high space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-rose-500">cardiology</span>
                        Pre-Procedure Patient Vitals (Telemetry)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Normal Range
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container-high/70">
                        <span className="text-[10px] text-outline font-medium block">Blood Pressure</span>
                        <span className="text-xs font-bold text-on-surface">{selectedSchedulePatient.vitals.bp}</span>
                      </div>
                      <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container-high/70">
                        <span className="text-[10px] text-outline font-medium block">Pulse Rate</span>
                        <span className="text-xs font-bold text-on-surface">{selectedSchedulePatient.vitals.pulse}</span>
                      </div>
                      <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container-high/70">
                        <span className="text-[10px] text-outline font-medium block">Oxygen (SpO2)</span>
                        <span className="text-xs font-bold text-on-surface">{selectedSchedulePatient.vitals.spo2}</span>
                      </div>
                      <div className="bg-surface-container-lowest p-2 rounded-lg border border-surface-container-high/70">
                        <span className="text-[10px] text-outline font-medium block">Pain Level</span>
                        <span className="text-xs font-bold text-primary">{selectedSchedulePatient.vitals.painLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Procedure & Anesthesia Config */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container-high space-y-1">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Clinical Procedure</span>
                      <span className="font-bold text-on-surface text-sm block">{selectedSchedulePatient.proc}</span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Target: <strong>{selectedSchedulePatient.tooth}</strong>
                      </p>
                    </div>

                    <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container-high space-y-1">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block">Anesthesia Protocol</span>
                      <span className="font-bold text-on-surface text-xs block flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-amber-600">vaccines</span>
                        {selectedSchedulePatient.anesthesia}
                      </span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        Payer: <strong>{selectedSchedulePatient.insurance}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Doctor Chart Notes */}
                  <div className="p-3.5 bg-surface-container-lowest rounded-xl border border-surface-container-high space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[15px] text-primary">clinical_notes</span>
                        Operative Chart Notes
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyChartSummary(selectedSchedulePatient)}
                        className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        Copy Notes
                      </button>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-sans bg-surface-container-low/40 p-2.5 rounded-lg border border-surface-container-low">
                      {selectedSchedulePatient.clinicalNotes}
                    </p>
                  </div>

                  {/* Prescriptions & Follow-up Action */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60 space-y-1">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-rose-500">medication</span>
                        Prescriptions Issued
                      </span>
                      <p className="text-xs text-on-surface font-medium leading-relaxed">{selectedSchedulePatient.prescriptions}</p>
                    </div>

                    <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container-high/60 space-y-1">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-teal-600">event_repeat</span>
                        Next Clinical Action
                      </span>
                      <p className="text-xs text-on-surface font-medium leading-relaxed">{selectedSchedulePatient.nextAction}</p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer with Status Change & Close */}
                <div className="p-4 border-t border-surface-container-low bg-surface-container-lowest flex flex-wrap items-center justify-between gap-3 px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-on-surface-variant">Update Status:</span>
                    <button
                      type="button"
                      onClick={() => handleUpdateScheduleStatus(selectedSchedulePatient.id, 'In Progress')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSchedulePatient.status === 'In Progress'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateScheduleStatus(selectedSchedulePatient.id, 'Confirmed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSchedulePatient.status === 'Confirmed'
                          ? 'bg-primary text-on-primary shadow-xs'
                          : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      Confirmed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateScheduleStatus(selectedSchedulePatient.id, 'Completed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSchedulePatient.status === 'Completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                      }`}
                    >
                      Completed
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={() => handleCopyChartSummary(selectedSchedulePatient)}
                      className="px-4 py-2 rounded-xl font-medium text-xs text-on-surface bg-surface-container-high hover:bg-surface-container-highest transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[15px]">print</span>
                      Export Chart
                    </button>
                    <button 
                      type="button"
                      onClick={() => setSelectedSchedulePatient(null)} 
                      className="px-5 py-2 rounded-xl font-semibold text-xs bg-primary text-on-primary shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
