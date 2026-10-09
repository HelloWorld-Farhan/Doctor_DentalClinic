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
                  {[
                    { time: "09:00 AM", name: "Neha Gupta", id: "#40921", initials: "NG", proc: "Root Canal Therapy", status: "In Progress", statusColor: "bg-primary text-on-primary", avatarColor: "bg-primary/10 text-primary" },
                    { time: "10:15 AM", name: "Mark Singh", id: "#40922", initials: "MS", proc: "Routine Cleaning & Exam", status: "Confirmed", statusColor: "bg-surface-container-high text-on-surface", avatarColor: "bg-tertiary-fixed text-on-tertiary-fixed" },
                    { time: "11:30 AM", name: "Alice Ross", id: "#40925", initials: "AR", proc: "Orthodontic Adjustment", status: "Confirmed", statusColor: "bg-surface-container-high text-on-surface", avatarColor: "bg-secondary-container text-on-secondary-container" },
                    { time: "01:30 PM", name: "Robert King", id: "#40930", initials: "RK", proc: "Teeth Whitening Session", status: "Completed", statusColor: "bg-emerald-100 text-emerald-800", avatarColor: "bg-surface-container-high text-on-surface" },
                    { time: "03:00 PM", name: "Anjali Lane", id: "#40935", initials: "AL", proc: "Emergency Crown Fix", status: "Confirmed", statusColor: "bg-surface-container-high text-on-surface", avatarColor: "bg-error-container text-on-error-container" }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
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
                          onClick={() => showToast(`Opening patient chart for ${row.name}`)}
                          className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
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

        {/* 3. AI VOICE-TO-TEXT CHARTING CARD */}
        <div className="bg-primary text-on-primary rounded-2xl shadow-md p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 pointer-events-none">
            <span className="material-symbols-outlined text-[180px]">dentistry</span>
          </div>
          
          <div className="z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-primary-fixed uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">mic</span>
                {isVoiceEnabled ? 'AI Voice Active • Operatory 01' : 'Dental Clinic Pro Tip'}
              </span>
              {isVoiceEnabled && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              )}
            </div>

            <h3 className="text-2xl font-bold text-on-primary mb-3 leading-tight">Streamline Charting with Voice</h3>
            <p className="text-xs text-on-primary/90 leading-relaxed font-medium">
              {isVoiceEnabled 
                ? "Voice dictation is connected and streaming hands-free periodontal probe depths and restorative findings."
                : "Enable automated voice-to-text periodontal charting in the settings menu to save up to 4 minutes per patient consultation."
              }
            </p>
          </div>

          <div className="mt-6 z-10">
            <button 
              onClick={() => setIsVoiceConfigOpen(true)}
              className="px-5 py-3 bg-surface-container-lowest text-primary rounded-xl text-xs font-bold hover:bg-surface-bright transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isVoiceEnabled ? 'tune' : 'auto_awesome'}
              </span>
              {isVoiceEnabled ? 'Voice Active • Configure' : 'Enable Feature'}
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
    </motion.div>
  );
}
