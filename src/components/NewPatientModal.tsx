import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface NewPatientData {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  chiefComplaint: string;
  medicalAlert: string;
  insurance: string;
  scheduleToday: boolean;
  timeSlot?: string;
  operatory?: string;
  initialStatus?: 'In Progress' | 'Confirmed';
}

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterPatient: (data: NewPatientData) => void;
  showToast: (msg: string) => void;
}

const PROCEDURES = [
  'Routine Checkup & Prophylaxis Cleaning',
  'Emergency Toothache & Diagnostic X-Ray',
  'Composite Filling (Cavity Restoration)',
  'Crown Restoration / Impression',
  'Root Canal Therapy (Endodontics)',
  'Invisalign Clear Aligners Consultation',
  'Surgical Extraction / Wisdom Tooth',
  'Teeth Whitening & Aesthetic Smile Design',
  'Periodontal Deep Scaling & Planing',
];

const OPERATORIES = [
  'Operatory 01 — Dental Chair A',
  'Operatory 02 — Dental Chair B',
  'Operatory 03 — Surgical Suite',
  'Operatory 04 — Hygiene Bay',
];

const INSURANCE_PROVIDERS = [
  'Delta Dental Premier',
  'MetLife Dental HMO/PPO',
  'Cigna Dental Care',
  'Aetna Dental Network',
  'Guardian Dental PPO',
  'Humana Dental',
  'Self-Pay / Cash Patient',
];

const MEDICAL_ALERTS = [
  'No Known Drug Allergies (NKDA)',
  'Penicillin Allergy — Flag in chart',
  'Latex Sensitivity — Use latex-free gloves',
  'Hypertension (Controlled) — Monitor BP',
  'Type 2 Diabetes — Pre-med protocol',
  'Aspirin / Blood Thinners therapy',
  'Dental Anxiety / Nitrous recommended',
];

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onRegisterPatient,
  showToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('1994-06-15');
  const [gender, setGender] = useState('Female');
  const [chiefComplaint, setChiefComplaint] = useState(PROCEDURES[0]);
  const [medicalAlert, setMedicalAlert] = useState(MEDICAL_ALERTS[0]);
  const [insurance, setInsurance] = useState(INSURANCE_PROVIDERS[0]);
  
  // Schedule today toggle
  const [scheduleToday, setScheduleToday] = useState(true);
  const [timeSlot, setTimeSlot] = useState('03:30 PM - 04:15 PM');
  const [operatory, setOperatory] = useState(OPERATORIES[0]);
  const [initialStatus, setInitialStatus] = useState<'In Progress' | 'Confirmed'>('Confirmed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Please enter the patient’s full name.');
      return;
    }

    onRegisterPatient({
      name: fullName.trim(),
      phone: phone.trim() || '+1 (555) 234-5678',
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, '.')}@patientmail.com`,
      dob,
      gender,
      chiefComplaint,
      medicalAlert,
      insurance,
      scheduleToday,
      timeSlot: scheduleToday ? timeSlot : undefined,
      operatory: scheduleToday ? operatory : undefined,
      initialStatus: scheduleToday ? initialStatus : undefined,
    });

    onClose();
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col z-10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 p-5 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                  <span className="material-symbols-outlined text-white text-2xl">person_add</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Register New Clinical Patient
                    <span className="text-[10px] font-semibold bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-300/30">
                      Doctor Portal
                    </span>
                  </h3>
                  <p className="text-xs text-teal-100/90 mt-0.5">
                    Onboard patient into clinic database & optionally book today’s chair
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-700">
              {/* Section 1: Demographics */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-100 pb-1.5">
                  <span className="material-symbols-outlined text-base text-teal-600">badge</span>
                  Patient Demographics & Contact
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                        person
                      </span>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Jessica Miller, DDS Patient"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                        call
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 789-2345"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                        mail
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="patient@gmail.com"
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">
                        cake
                      </span>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Non-Binary / Other</option>
                      <option value="Undisclosed">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Clinical Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-slate-100 pb-1.5">
                  <span className="material-symbols-outlined text-base text-teal-600">dentistry</span>
                  Clinical Intent & Medical Flags
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Chief Complaint / Reason for Visit
                    </label>
                    <select
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
                    >
                      {PROCEDURES.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Insurance Coverage
                    </label>
                    <select
                      value={insurance}
                      onChange={(e) => setInsurance(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white"
                    >
                      {INSURANCE_PROVIDERS.map((ins) => (
                        <option key={ins} value={ins}>
                          {ins}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                      <span>Medical History & Allergy Alert</span>
                      <span className="text-[10px] text-amber-600 font-medium">HIPAA Protected</span>
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-amber-500 text-lg">
                        warning
                      </span>
                      <select
                        value={medicalAlert}
                        onChange={(e) => setMedicalAlert(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent bg-white text-slate-700 font-medium"
                      >
                        {MEDICAL_ALERTS.map((alert) => (
                          <option key={alert} value={alert}>
                            {alert}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Add to Today's Schedule Card */}
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 shadow-sm space-y-3.5 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <input
                      id="schedule-today-toggle"
                      type="checkbox"
                      checked={scheduleToday}
                      onChange={(e) => setScheduleToday(e.target.checked)}
                      className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500 cursor-pointer"
                    />
                    <label htmlFor="schedule-today-toggle" className="cursor-pointer select-none">
                      <div className="text-sm font-bold text-teal-950 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-teal-600 text-base">event_upcoming</span>
                        Book into Today’s Practice Schedule Queue Immediately
                      </div>
                      <p className="text-xs text-teal-700/90 mt-0.5">
                        Appears immediately in today’s table & increments today’s patient queue on the dashboard.
                      </p>
                    </label>
                  </div>
                  {scheduleToday && (
                    <span className="shrink-0 text-[10px] uppercase font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                      Live Queue
                    </span>
                  )}
                </div>

                {scheduleToday && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-teal-100"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-teal-900 mb-1">
                        Time Slot Today
                      </label>
                      <input
                        type="text"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        placeholder="03:30 PM - 04:15 PM"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-teal-900 mb-1">
                        Operatory
                      </label>
                      <select
                        value={operatory}
                        onChange={(e) => setOperatory(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
                      >
                        {OPERATORIES.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-teal-900 mb-1">
                        Initial Queue Status
                      </label>
                      <select
                        value={initialStatus}
                        onChange={(e) => setInitialStatus(e.target.value as 'In Progress' | 'Confirmed')}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-teal-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-medium"
                      >
                        <option value="Confirmed">Confirmed (Waiting)</option>
                        <option value="In Progress">In Progress (In Chair)</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-teal-600">verified_user</span>
                  Synced with Doctor Clinic Records
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 rounded-xl shadow-md shadow-teal-700/20 hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">how_to_reg</span>
                    Register & Save Patient
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
