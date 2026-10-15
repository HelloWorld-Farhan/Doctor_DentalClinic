import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface ScheduleAppointmentData {
  name: string;
  id?: string;
  timeSlot: string;
  proc: string;
  operatory: string;
  doctor: string;
  tooth: string;
  anesthesia?: string;
  insurance?: string;
  medicalAlert?: string;
  status: 'In Progress' | 'Confirmed';
}

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingPatients: { name: string; id: string; phone?: string; insurance?: string }[];
  onConfirmSchedule: (data: ScheduleAppointmentData) => void;
  showToast: (msg: string) => void;
}

export const ScheduleAppointmentModal: React.FC<ScheduleAppointmentModalProps> = ({
  isOpen,
  onClose,
  existingPatients,
  onConfirmSchedule,
  showToast,
}) => {
  const [patientMode, setPatientMode] = useState<'registered' | 'custom'>('registered');
  const [selectedPatientIndex, setSelectedPatientIndex] = useState(0);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('02:30 PM - 03:15 PM');
  const [procedure, setProcedure] = useState('Routine Checkup & Cleaning');
  const [operatory, setOperatory] = useState('Operatory 01 — Dental Chair A');
  const [doctor] = useState('Dr. Sarah Sharma, DDS');
  const [targetTooth, setTargetTooth] = useState('Full Dentition Prophylaxis');
  const [status, setStatus] = useState<'Confirmed' | 'In Progress'>('Confirmed');
  const [medicalAlert, setMedicalAlert] = useState('No Known Drug Allergies (NKDA)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let patientName = '';
    let patientId = '';
    let patientIns = 'Delta Dental Premier';

    if (patientMode === 'registered') {
      const p = existingPatients[selectedPatientIndex] || existingPatients[0];
      if (!p) {
        showToast('Please select a patient.');
        return;
      }
      patientName = p.name;
      patientId = p.id;
      if (p.insurance) patientIns = p.insurance;
    } else {
      if (!customName.trim()) {
        showToast('Please enter the patient name.');
        return;
      }
      patientName = customName.trim();
      patientId = `#${Math.floor(40000 + Math.random() * 9999)}`;
    }

    onConfirmSchedule({
      name: patientName,
      id: patientId,
      timeSlot,
      proc: procedure,
      operatory,
      doctor,
      tooth: targetTooth,
      insurance: patientIns,
      medicalAlert,
      status,
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

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative bg-surface-container-lowest w-full max-w-lg max-h-[92vh] rounded-2xl sm:rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-surface-container-low flex justify-between items-center bg-gradient-to-r from-surface-container-low/60 via-surface-container-lowest to-surface-container-low/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-xs shrink-0">
                  <span className="material-symbols-outlined text-[22px]">calendar_add_on</span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-on-surface">Schedule Appointment</h2>
                  <p className="text-xs text-on-surface-variant">
                    Book chair time into today&apos;s operative schedule
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              {/* Patient Selection Mode Toggle */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1.5 block">
                  Select Patient
                </label>
                <div className="grid grid-cols-2 bg-surface-container-high p-1 rounded-xl text-xs font-semibold mb-2.5">
                  <button
                    type="button"
                    onClick={() => setPatientMode('registered')}
                    className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      patientMode === 'registered'
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">person</span>
                    <span>Existing Patient</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatientMode('custom')}
                    className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      patientMode === 'custom'
                        ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">person_add</span>
                    <span>Walk-In / New</span>
                  </button>
                </div>

                {patientMode === 'registered' ? (
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                      person_search
                    </span>
                    <select
                      value={selectedPatientIndex}
                      onChange={(e) => setSelectedPatientIndex(Number(e.target.value))}
                      className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium cursor-pointer"
                    >
                      {existingPatients.map((p, idx) => (
                        <option key={p.id || idx} value={idx}>
                          {p.name} ({p.id}) — {p.phone || 'In System'}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                        person
                      </span>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Patient Full Name"
                        className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium"
                        required={patientMode === 'custom'}
                      />
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                        call
                      </span>
                      <input
                        type="tel"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        placeholder="Phone Number"
                        className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Appointment Date
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                      calendar_today
                    </span>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Time Window
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                      schedule
                    </span>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium cursor-pointer"
                    >
                      <option>09:00 AM - 09:45 AM</option>
                      <option>10:15 AM - 11:00 AM</option>
                      <option>11:30 AM - 12:15 PM</option>
                      <option>01:30 PM - 02:15 PM</option>
                      <option>02:30 PM - 03:15 PM</option>
                      <option>03:45 PM - 04:30 PM</option>
                      <option>05:00 PM - 05:45 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Procedure & Operatory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Procedure Type
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                      dentistry
                    </span>
                    <select
                      value={procedure}
                      onChange={(e) => setProcedure(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium cursor-pointer"
                    >
                      <option>Routine Checkup &amp; Cleaning</option>
                      <option>Root Canal Therapy</option>
                      <option>Orthodontic Adjustment</option>
                      <option>Emergency Crown Fix</option>
                      <option>Surgical Extraction</option>
                      <option>Dental Implants Consultation</option>
                      <option>Teeth Whitening</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Chair / Operatory
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                      chair
                    </span>
                    <select
                      value={operatory}
                      onChange={(e) => setOperatory(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium cursor-pointer"
                    >
                      <option>Operatory 01 — Dental Chair A</option>
                      <option>Operatory 02 — Hygiene Bay</option>
                      <option>Operatory 03 — Orthodontic Bay</option>
                      <option>Operatory 04 — Surgical Suite</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Target Tooth & Medical Alert */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Target Tooth / Arch
                  </label>
                  <input
                    type="text"
                    value={targetTooth}
                    onChange={(e) => setTargetTooth(e.target.value)}
                    placeholder="e.g. Tooth #19 or Upper Arch"
                    className="w-full px-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                    Initial Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('Confirmed')}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                        status === 'Confirmed'
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant border-surface-container-high'
                      }`}
                    >
                      Confirmed
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('In Progress')}
                      className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                        status === 'In Progress'
                          ? 'bg-primary text-on-primary border-primary shadow-xs'
                          : 'bg-surface-container-low text-on-surface-variant border-surface-container-high'
                      }`}
                    >
                      In Progress
                    </button>
                  </div>
                </div>
              </div>

              {/* Medical Alert / Precaution */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Medical Alert / Clinical Precautions
                </label>
                <input
                  type="text"
                  value={medicalAlert}
                  onChange={(e) => setMedicalAlert(e.target.value)}
                  placeholder="e.g. Penicillin allergy, Pre-medicate, Hypertension"
                  className="w-full px-3 py-2 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-xs font-medium"
                />
              </div>

              {/* Modal Actions */}
              <div className="p-4 sm:p-5 border-t border-surface-container-low bg-surface-container-lowest flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 shrink-0 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-medium text-xs text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-primary text-on-primary shadow-md shadow-primary/20 hover:bg-primary-container transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Confirm Schedule</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
