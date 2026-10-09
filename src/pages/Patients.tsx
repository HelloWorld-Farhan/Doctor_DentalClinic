import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface PatientRecord {
  id: string;
  name: string;
  initials: string;
  color: string;
  age: string;
  gender: string;
  visitDate: string;
  dr: string;
  proc: string;
  procColor: string;
  alert: string;
  alertColor: string;
  alertIcon: string;
  ins: string;
  insIcon: string;
  insColor: string;
  phone?: string;
  email?: string;
}

const INITIAL_PATIENTS: PatientRecord[] = [
  { 
    id: "DC-88492", name: "Ananya Sterling", initials: "AS", color: "bg-primary-fixed text-on-primary-fixed", 
    age: "34 yrs", gender: "Female", 
    visitDate: "Oct 12, 2023", dr: "Dr. Priya Patel",
    proc: "Root Canal Therapy", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "Latex Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Delta Dental Premier", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 234-5678", email: "ananya.sterling@example.com"
  },
  { 
    id: "DC-88493", name: "Marcus Chen", initials: "MC", color: "bg-secondary-fixed text-on-secondary-fixed", 
    age: "45 yrs", gender: "Male", 
    visitDate: "Nov 04, 2023", dr: "Dr. Rohan Vance",
    proc: "Crown & Bridge", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "None Reported", alertColor: "bg-surface-container-high text-on-surface-variant", alertIcon: "",
    ins: "MetLife Dental PPO", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 345-6789", email: "marcus.chen@example.com"
  },
  { 
    id: "DC-88494", name: "Amara Patel", initials: "AP", color: "bg-primary-fixed-dim text-on-primary-fixed", 
    age: "28 yrs", gender: "Female", 
    visitDate: "Dec 01, 2023", dr: "Dr. Priya Patel",
    proc: "Orthodontic Adjustment", procColor: "bg-secondary-fixed text-on-secondary-fixed",
    alert: "Penicillin Allergy", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Verification Pending", insIcon: "error", insColor: "text-error",
    phone: "+1 (555) 456-7890", email: "amara.patel@example.com"
  },
  { 
    id: "DC-88495", name: "Jonathan Chopra", initials: "JC", color: "bg-surface-container-high text-on-surface-variant", 
    age: "52 yrs", gender: "Male", 
    visitDate: "Jan 15, 2024", dr: "Dr. Rohan Vance",
    proc: "Dental Implants", procColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    alert: "Hypertension", alertColor: "bg-error-container text-on-error-container", alertIcon: "warning",
    ins: "Cigna Dental Care", insIcon: "verified", insColor: "text-tertiary-container",
    phone: "+1 (555) 567-8901", email: "jonathan.chopra@example.com"
  }
];

const QUICK_ALERTS = [
  "Latex Allergy",
  "Penicillin Allergy",
  "Hypertension",
  "Diabetic (Type 2)",
  "None Reported"
];

export default function Patients() {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [historyPatientName, setHistoryPatientName] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // New Patient Form States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Female");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [procedure, setProcedure] = useState("Routine Cleaning & Exam");
  const [medicalAlert, setMedicalAlert] = useState("");
  const [insurance, setInsurance] = useState("Delta Dental Premier");
  const [policyId, setPolicyId] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredPatients = patients.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return p.name.toLowerCase().includes(q) ||
           p.id.toLowerCase().includes(q) ||
           p.proc.toLowerCase().includes(q) ||
           p.alert.toLowerCase().includes(q) ||
           p.ins.toLowerCase().includes(q);
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const initials = `${firstName.trim()[0]}${lastName.trim()[0]}`.toUpperCase();
    
    // Calculate approximate age
    let ageStr = "29 yrs";
    if (dob) {
      const birthYear = new Date(dob).getFullYear();
      if (!isNaN(birthYear)) {
        const calculatedAge = new Date().getFullYear() - birthYear;
        if (calculatedAge > 0 && calculatedAge < 120) {
          ageStr = `${calculatedAge} yrs`;
        }
      }
    }

    const newRecord: PatientRecord = {
      id: `DC-${Math.floor(88500 + Math.random() * 9000)}`,
      name: fullName,
      initials: initials,
      color: "bg-primary-fixed text-on-primary-fixed",
      age: ageStr,
      gender: gender,
      visitDate: "Today",
      dr: "Dr. Sharma",
      proc: procedure,
      procColor: "bg-primary-fixed text-on-primary-fixed",
      alert: medicalAlert.trim() || "None Reported",
      alertColor: medicalAlert.trim() && medicalAlert.trim() !== "None Reported" 
        ? "bg-error-container text-on-error-container" 
        : "bg-surface-container-high text-on-surface-variant",
      alertIcon: medicalAlert.trim() && medicalAlert.trim() !== "None Reported" ? "warning" : "",
      ins: insurance,
      insIcon: insurance.includes("Self-Pay") ? "credit_card" : "verified",
      insColor: insurance.includes("Self-Pay") ? "text-on-surface-variant" : "text-tertiary-container",
      phone: phone || "+1 (555) 000-0000",
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
    };

    setPatients([newRecord, ...patients]);
    setShowNewPatientModal(false);
    showToast(`Patient record created for ${fullName}!`);

    // Reset Form
    setFirstName("");
    setLastName("");
    setDob("");
    setPhone("");
    setEmail("");
    setMedicalAlert("");
    setPolicyId("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-[100] bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-primary-container"
          >
            <span className="material-symbols-outlined text-[20px] text-emerald-300">check_circle</span>
            <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Power BI Analytics Summary Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-container via-surface-container-low to-surface-container-high rounded-2xl p-6 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div>
            <div className="flex items-center gap-1 text-primary mb-1">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              <span className="text-xs font-semibold tracking-wider uppercase">Power BI Clinical Analytics</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface">Patient Demographics & Treatment Flow</h2>
          </div>
          <div className="flex items-center gap-2 bg-surface/80 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
            <span className="w-2.5 h-2.5 bg-tertiary-container rounded-full animate-pulse"></span>
            <span className="text-sm text-on-surface-variant font-medium">Live Sync: Active Database</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Total Active Patients", val: `${2482 + patients.length - 4}`, sub: "+12% this month", subColor: "text-tertiary-container", barColor: "bg-primary", pct: "78%" },
            { label: "Preventive Care Ratio", val: "64.5%", sub: "Optimal", subColor: "text-secondary", barColor: "bg-secondary", pct: "64.5%" },
            { label: "Insurance Verified", val: "91.2%", sub: "High tier", subColor: "text-tertiary-container", barColor: "bg-tertiary-container", pct: "91.2%" },
            { label: "Medical Alerts Flagged", val: "142", sub: "Requires Review", subColor: "text-error", barColor: "bg-error", pct: "25%" }
          ].map((kpi, i) => (
            <div key={i} className="bg-surface/60 backdrop-blur-md p-4 rounded-xl shadow-sm">
              <div className="text-xs font-medium text-on-surface-variant mb-1">{kpi.label}</div>
              <div className="text-xl font-bold text-on-surface flex items-baseline justify-between">
                <span>{kpi.val}</span>
                <span className={`text-[10px] ${kpi.subColor} font-semibold`}>{kpi.sub}</span>
              </div>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-2 overflow-hidden">
                <div className={`${kpi.barColor} h-full rounded-full`} style={{ width: kpi.pct }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Directory Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest text-on-surface pl-10 pr-4 py-2.5 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-outline" 
              placeholder="Search by patient name, ID, or procedure..." 
              type="text"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => showToast("Applied clinical filter preset")}
              className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Filter</span>
            </button>
            <button 
              onClick={() => {
                setPatients([...patients].reverse());
                showToast("Toggled patient sorting order");
              }}
              className="flex items-center gap-1 bg-surface-container-lowest text-on-surface px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-surface-container-high transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
              <span>Sort</span>
            </button>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowNewPatientModal(true)}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          <span>Add New Patient</span>
        </motion.button>
      </div>

      {/* Patient Table Card */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-surface-container-low">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Patient Name & ID</th>
                <th className="py-3 px-4 font-semibold">Age / Gender</th>
                <th className="py-3 px-4 font-semibold">Last Visit</th>
                <th className="py-3 px-4 font-semibold">Primary Procedure</th>
                <th className="py-3 px-4 font-semibold">Medical Alerts</th>
                <th className="py-3 px-4 font-semibold">Insurance Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/20 text-sm text-on-surface">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-outline">
                    No patients found matching your search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${patient.color} shadow-sm`}>
                          {patient.initials}
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{patient.name}</div>
                          <div className="text-xs text-on-surface-variant font-mono">ID: #{patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{patient.age}</div>
                      <div className="text-xs text-on-surface-variant">{patient.gender}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{patient.visitDate}</div>
                      <div className="text-xs text-secondary font-medium">{patient.dr}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${patient.procColor}`}>
                        {patient.proc}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold ${patient.alertColor}`}>
                        {patient.alertIcon && <span className="material-symbols-outlined text-[14px]">{patient.alertIcon}</span>}
                        {patient.alert}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-sm ${patient.insColor}`}>
                        <span className="material-symbols-outlined text-[16px]">{patient.insIcon}</span>
                        {patient.ins}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => setHistoryPatientName(patient.name)}
                          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" 
                          title="View History"
                        >
                          <span className="material-symbols-outlined text-[18px]">history</span>
                        </button>
                        <button 
                          onClick={() => showToast(`Editing record for ${patient.name}`)}
                          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" 
                          title="Edit Record"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => showToast(`Opened Odontogram charting for ${patient.name}`)}
                          className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all" 
                          title="Odontogram Profile"
                        >
                          <span className="material-symbols-outlined text-[18px]">dentistry</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-surface-container-low/30 border-t border-surface-variant/20 gap-4">
          <div className="text-xs text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1-{filteredPatients.length}</span> of <span className="font-bold text-on-surface">{2482 + patients.length - 4}</span> patients
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface-variant opacity-50 text-xs font-medium" disabled>Previous</button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-bold shadow-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-variant transition-all">2</button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-variant transition-all">3</button>
            <span className="px-1 text-on-surface-variant">...</span>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-variant transition-all">62</button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-variant transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. UPGRADED & BEAUTIFUL "ADD NEW PATIENT" MODAL (Portaled to document.body) */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showNewPatientModal && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Fullscreen Backdrop Blur (Prevents ANY top bar or white background leakage) */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setShowNewPatientModal(false)}
              />

              {/* Modal Card */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl border border-surface-container-low overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 shadow-sm">
                      <span className="material-symbols-outlined text-[26px]">person_add</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">Add New Patient Record</h3>
                      <p className="text-xs text-outline mt-0.5">
                        Register clinical demographics, medical alerts & insurance provider.
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors" 
                    onClick={() => setShowNewPatientModal(false)}
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Modal Scrollable Form Body */}
                <form onSubmit={handleCreatePatient} className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Section 1: Demographics */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      <span>1. Personal & Contact Information</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">First Name</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">person</span>
                          <input 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
                            placeholder="e.g. John" 
                            required 
                            type="text"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">Last Name</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">id_card</span>
                          <input 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
                            placeholder="e.g. Doe" 
                            required 
                            type="text"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">Date of Birth</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">calendar_today</span>
                          <input 
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
                            required 
                            type="date"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">Gender</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">wc</span>
                          <select 
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-8 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium appearance-none cursor-pointer"
                          >
                            <option>Female</option>
                            <option>Male</option>
                            <option>Non-Binary / Other</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">Phone Number</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">call</span>
                          <input 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
                            placeholder="+1 (555) 000-0000" 
                            type="tel"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">Email Address</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">mail</span>
                          <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
                            placeholder="patient@example.com" 
                            type="email"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Clinical Care & Medical Alerts */}
                  <div className="space-y-3 pt-2 border-t border-surface-container-low">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-secondary">
                      <span className="material-symbols-outlined text-[16px]">medical_services</span>
                      <span>2. Clinical Care & Safety Alerts</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-on-surface mb-1">Primary Procedure / Concern</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">dentistry</span>
                        <select 
                          value={procedure}
                          onChange={(e) => setProcedure(e.target.value)}
                          className="w-full bg-surface-container-low pl-10 pr-8 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium appearance-none cursor-pointer"
                        >
                          <option>Routine Cleaning & Exam</option>
                          <option>Root Canal Therapy</option>
                          <option>Dental Implants</option>
                          <option>Porcelain Veneers</option>
                          <option>Crown & Bridge</option>
                          <option>Orthodontic Adjustment</option>
                          <option>Wisdom Tooth Extraction</option>
                          <option>Laser Teeth Whitening</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="block text-xs font-semibold text-on-surface">Medical Alerts & Allergies</label>
                        <span className="text-[11px] text-outline">Click chip to add</span>
                      </div>
                      <div className="relative mb-2">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-error pointer-events-none">warning</span>
                        <input 
                          value={medicalAlert}
                          onChange={(e) => setMedicalAlert(e.target.value)}
                          className="w-full bg-surface-container-low pl-10 pr-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
                          placeholder="e.g. Latex Allergy, Penicillin allergy, Hypertension" 
                          type="text"
                        />
                      </div>
                      {/* Clickable Quick Alert Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_ALERTS.map((alertText, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => {
                              if (alertText === "None Reported") {
                                setMedicalAlert("None Reported");
                              } else if (!medicalAlert || medicalAlert === "None Reported") {
                                setMedicalAlert(alertText);
                              } else {
                                setMedicalAlert(`${medicalAlert}, ${alertText}`);
                              }
                            }}
                            className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs rounded-lg transition-colors flex items-center gap-1 font-medium"
                          >
                            <span className="material-symbols-outlined text-[14px] text-primary">add</span>
                            <span>{alertText}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Insurance & Billing */}
                  <div className="space-y-3 pt-2 border-t border-surface-container-low">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-tertiary">
                      <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      <span>3. Insurance Provider & Billing</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">Insurance Provider</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">health_and_safety</span>
                          <select 
                            value={insurance}
                            onChange={(e) => setInsurance(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-8 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium appearance-none cursor-pointer"
                          >
                            <option>Delta Dental Premier</option>
                            <option>MetLife Dental PPO</option>
                            <option>Cigna Dental Care</option>
                            <option>Guardian Dental Network</option>
                            <option>Self-Pay / Direct Billing</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-on-surface mb-1">Subscriber / Policy ID</label>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">credit_card</span>
                          <input 
                            value={policyId}
                            onChange={(e) => setPolicyId(e.target.value)}
                            className="w-full bg-surface-container-low pl-10 pr-3 py-2.5 rounded-xl text-sm text-on-surface border border-surface-container-high focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium" 
                            placeholder="#INS-84920" 
                            type="text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-surface-container-low">
                    <button 
                      type="button"
                      className="px-5 py-2.5 rounded-xl text-outline hover:text-on-surface text-sm font-medium hover:bg-surface-container-low transition-colors" 
                      onClick={() => setShowNewPatientModal(false)} 
                    >
                      Cancel
                    </button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center gap-2" 
                    >
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      <span>Save Patient Record</span>
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. PATIENT HISTORY DRAWER (Portaled to document.body) */}
      {/* ========================================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {historyPatientName && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-end">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={() => setHistoryPatientName(null)}
              />
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="bg-surface-container-lowest h-full w-full max-w-lg shadow-2xl flex flex-col p-6 relative z-10"
              >
                <div className="flex justify-between items-center pb-4 border-b border-surface-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-fixed text-secondary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">history_edu</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">{historyPatientName}</h3>
                      <div className="text-xs text-on-surface-variant mt-0.5">Clinical timeline & treatment records</div>
                    </div>
                  </div>
                  <button 
                    className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors" 
                    onClick={() => setHistoryPatientName(null)}
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 space-y-6">
                  <div className="relative pl-6 border-l-2 border-primary/30 space-y-8">
                    <div className="relative">
                      <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-primary ring-4 ring-surface-container-lowest shadow-sm"></span>
                      <div className="text-xs text-primary font-bold font-mono">October 12, 2023</div>
                      <div className="font-bold text-on-surface text-base mt-1">Root Canal Therapy (Tooth #14)</div>
                      <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Completed successful endodontic treatment. Placed temporary crown. Follow-up scheduled in 2 weeks.
                      </p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-secondary ring-4 ring-surface-container-lowest shadow-sm"></span>
                      <div className="text-xs text-secondary font-bold font-mono">May 04, 2023</div>
                      <div className="font-bold text-on-surface text-base mt-1">Routine Cleaning & Exam</div>
                      <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Periodontal probing showed healthy pocket depths (2-3mm). Minor plaque buildup removed via ultrasonic scaling.
                      </p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-tertiary-container ring-4 ring-surface-container-lowest shadow-sm"></span>
                      <div className="text-xs text-tertiary font-bold font-mono">January 15, 2023</div>
                      <div className="font-bold text-on-surface text-base mt-1">Initial Comprehensive Consultation</div>
                      <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
                        Full mouth series radiographs taken. Treatment plan established for caries management and restorative work.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-surface-variant/20 flex justify-end">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold shadow-sm hover:bg-primary-container transition-all" 
                    onClick={() => setHistoryPatientName(null)}
                  >
                    Close History
                  </motion.button>
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
