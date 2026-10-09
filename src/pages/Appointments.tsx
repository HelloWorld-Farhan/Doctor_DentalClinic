import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface AppointmentItem {
  id: string;
  time: string;
  name: string;
  patientId: string;
  initials: string;
  initialsBg: string;
  proc: string;
  chair: string;
  status: 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  statusColor: string;
}

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: "1",
    time: "09:00 AM - 09:45 AM",
    name: "Jonathan Chopra",
    patientId: "#PT-8492",
    initials: "JC",
    initialsBg: "bg-secondary-fixed text-on-secondary-fixed",
    proc: "Root Canal Therapy",
    chair: "Chair 01",
    status: "In Progress",
    statusColor: "bg-tertiary-container text-on-tertiary-container"
  },
  {
    id: "2",
    time: "10:00 AM - 10:30 AM",
    name: "Sarah Mehta",
    patientId: "#PT-9021",
    initials: "SM",
    initialsBg: "bg-primary-fixed text-on-primary-fixed",
    proc: "Routine Cleaning",
    chair: "Chair 02",
    status: "Confirmed",
    statusColor: "bg-primary-fixed text-on-primary-fixed"
  },
  {
    id: "3",
    time: "10:45 AM - 11:30 AM",
    name: "Robert King",
    patientId: "#PT-1182",
    initials: "RK",
    initialsBg: "bg-secondary-container text-on-secondary-container",
    proc: "Crown Fitting",
    chair: "Chair 01",
    status: "Confirmed",
    statusColor: "bg-primary-fixed text-on-primary-fixed"
  },
  {
    id: "4",
    time: "11:45 AM - 12:30 PM",
    name: "Anjali Chatterjee",
    patientId: "#PT-3329",
    initials: "AC",
    initialsBg: "bg-surface-container-high text-on-surface",
    proc: "Teeth Whitening",
    chair: "Chair 03",
    status: "Completed",
    statusColor: "bg-surface-container text-on-surface-variant"
  },
  {
    id: "5",
    time: "02:00 PM - 02:45 PM",
    name: "Michael Chang",
    patientId: "#PT-4401",
    initials: "MC",
    initialsBg: "bg-tertiary-fixed text-on-tertiary-fixed",
    proc: "Wisdom Tooth Extraction",
    chair: "Chair 02",
    status: "Confirmed",
    statusColor: "bg-primary-fixed text-on-primary-fixed"
  }
];

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(21);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Appointment Form State
  const [newName, setNewName] = useState("");
  const [newProc, setNewProc] = useState("Routine Cleaning");
  const [newChair, setNewChair] = useState("Chair 01");
  const [newTime, setNewTime] = useState("01:30 PM - 02:15 PM");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesFilter = activeFilter === "All" || apt.status === activeFilter;
    const matchesSearch = apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.proc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const initials = newName.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const newApt: AppointmentItem = {
      id: String(Date.now()),
      time: newTime,
      name: newName.trim(),
      patientId: `#PT-${Math.floor(1000 + Math.random() * 9000)}`,
      initials: initials || "PT",
      initialsBg: "bg-primary-fixed text-on-primary-fixed",
      proc: newProc,
      chair: newChair,
      status: "Confirmed",
      statusColor: "bg-primary-fixed text-on-primary-fixed"
    };

    setAppointments([newApt, ...appointments]);
    setIsNewAppointmentOpen(false);
    setNewName("");
    showToast(`Appointment scheduled for ${newApt.name}!`);
  };

  const handleCancelAppointment = (id: string, name: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled', statusColor: 'bg-error-container text-on-error-container' } : a));
    showToast(`Appointment for ${name} marked as cancelled.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-primary-container"
          >
            <span className="material-symbols-outlined text-[20px] text-emerald-300">check_circle</span>
            <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats / Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Today's Appointments", value: `${appointments.length + 19} Scheduled`, change: "+12% from yesterday", icon: "trending_up", mainIcon: "calendar_today", color: "text-primary", bgInfo: "bg-primary-container text-on-primary-container" },
          { title: "In Progress", value: "4 Active Chairs", change: "On time", icon: "schedule", mainIcon: "clinical_notes", color: "text-tertiary", bgInfo: "bg-tertiary-container text-on-tertiary-container" },
          { title: "Completed Today", value: "16 Patients", change: "98% satisfaction", icon: "check_circle", mainIcon: "task_alt", color: "text-secondary", bgInfo: "bg-secondary-container text-on-secondary-container" },
          { title: "Cancelled / Rescheduled", value: "2 Requests", change: "Requires action", icon: "warning", mainIcon: "event_busy", color: "text-error", bgInfo: "bg-error-container text-on-error-container" }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1">{stat.value}</h3>
              <span className={`inline-flex items-center text-sm ${stat.color} mt-1 font-semibold`}>
                <span className="material-symbols-outlined text-[16px] mr-1">{stat.icon}</span> {stat.change}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgInfo}`}>
              <span className="material-symbols-outlined text-[24px]">{stat.mainIcon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section: Analytics & Calendar/Queue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Appointment Queue & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface">Appointment Queue</h2>
                <p className="text-sm text-on-surface-variant">Manage daily clinical schedule, patient intake, and statuses.</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsNewAppointmentOpen(true)}
                  className="bg-primary text-on-primary px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-primary-container transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  New Appointment
                </motion.button>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {["All", "Confirmed", "In Progress", "Completed", "Cancelled"].map(filter => (
                  <button 
                    key={filter} 
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      activeFilter === filter 
                        ? 'bg-primary text-on-primary shadow-sm' 
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-1.5 bg-surface-container-high rounded-xl text-on-surface text-sm outline-none w-full md:w-64 focus:ring-1 focus:ring-primary" 
                  placeholder="Search patient or procedure..." 
                  type="text"
                />
              </div>
            </div>

            {/* Appointment List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-xs font-semibold text-on-surface-variant border-b border-surface-variant/20">
                    <th className="py-2 px-4">Time Slot</th>
                    <th className="py-2 px-4">Patient Details</th>
                    <th className="py-2 px-4">Procedure</th>
                    <th className="py-2 px-4">Chair</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant/10 text-sm text-on-surface">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-outline">
                        No appointments found matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-surface-container transition-colors">
                        <td className="py-4 px-4 font-bold">{apt.time}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${apt.initialsBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                              {apt.initials}
                            </div>
                            <div>
                              <p className="font-bold">{apt.name}</p>
                              <p className="text-xs text-on-surface-variant">ID: {apt.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-surface-container-high rounded-md text-xs font-bold">{apt.proc}</span>
                        </td>
                        <td className="py-4 px-4 text-on-surface-variant font-medium">{apt.chair}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${apt.statusColor}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right space-x-2">
                          <button 
                            onClick={() => showToast(`Reschedule requested for ${apt.name}`)}
                            className="p-1 text-on-surface-variant hover:text-primary transition-colors" 
                            title="Reschedule"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                          </button>
                          <button 
                            onClick={() => handleCancelAppointment(apt.id, apt.name)}
                            className="p-1 text-on-surface-variant hover:text-error transition-colors" 
                            title="Cancel"
                          >
                            <span className="material-symbols-outlined text-[18px]">cancel</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Calendar Date Picker & Quick Actions */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-on-surface">October 2023</h3>
              <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                <button className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-on-surface-variant mb-2">
              <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
              {[25,26,27,28,29,30].map(d => <span key={`prev-${d}`} className="p-2 text-on-surface-variant/40">{d}</span>)}
              {Array.from({length: 20}).map((_, i) => {
                const day = i + 1;
                return (
                  <button 
                    key={`d-${day}`} 
                    onClick={() => { setSelectedDate(day); showToast(`Selected Oct ${day}, 2023`); }}
                    className={`p-2 rounded-xl transition-all ${selectedDate === day ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface hover:bg-surface-container-high'}`}
                  >
                    {day}
                  </button>
                );
              })}
              <button 
                onClick={() => { setSelectedDate(21); showToast("Selected Oct 21, 2023 (Today)"); }}
                className={`p-2 rounded-xl transition-all ${selectedDate === 21 ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface hover:bg-surface-container-high'}`}
              >
                21
              </button>
              {[22,23,24,25,26,27,28,29].map(d => (
                <button 
                  key={`d-${d}`} 
                  onClick={() => { setSelectedDate(d); showToast(`Selected Oct ${d}, 2023`); }}
                  className={`p-2 rounded-xl transition-all ${selectedDate === d ? 'bg-primary text-on-primary font-bold shadow-sm' : 'text-on-surface hover:bg-surface-container-high'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Card */}
          <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-bold mb-2">Chair Availability</h3>
            <p className="text-sm opacity-90 mb-4">3 of 4 chairs are fully operational with real-time telemetry connected.</p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showToast("Schedule slots optimized for high throughput!")}
              className="bg-on-primary-container text-primary px-4 py-2 rounded-xl text-sm w-full font-bold hover:bg-surface-bright transition-all shadow-sm"
            >
              Optimize Schedule Slots
            </motion.button>
          </div>
        </div>
      </div>

      {/* Power BI Style Analytics Section */}
      <div className="bg-surface-container-low p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1 text-xs text-primary font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px]">analytics</span> Power BI Telemetry
            </div>
            <h2 className="text-xl font-bold text-on-surface">Appointment Volume & Peak Hours Analysis</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-on-surface-variant">Filter by:</span>
            <select className="bg-surface-container-high text-on-surface px-3 py-1.5 rounded-xl text-sm outline-none font-medium">
              <option>Current Week</option>
              <option>Last Month</option>
              <option>Quarterly Breakdown</option>
            </select>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Animated Bar Chart for Peak Hours */}
          <div className="lg:col-span-2 bg-surface-container-high p-6 rounded-2xl flex flex-col justify-between h-64 border border-surface-container-highest">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant mb-2">
              <span>Peak Patient Density by Hour</span>
              <span className="text-primary font-bold">Max: 11:00 AM (98% Capacity)</span>
            </div>
            <div className="flex items-end justify-between h-40 gap-2 pt-4">
              {[
                { time: "8 AM", pct: "30%", hover: "hover:bg-primary/40", base: "bg-primary/20", bold: false },
                { time: "9 AM", pct: "60%", hover: "hover:bg-primary/60", base: "bg-primary/40", bold: false },
                { time: "10 AM", pct: "85%", hover: "hover:bg-primary", base: "bg-primary/80", bold: true },
                { time: "11 AM", pct: "98%", hover: "hover:bg-primary/90", base: "bg-primary", bold: true, isMax: true },
                { time: "12 PM", pct: "50%", hover: "hover:bg-primary/80", base: "bg-primary/60", bold: false },
                { time: "1 PM", pct: "40%", hover: "hover:bg-primary/50", base: "bg-primary/30", bold: false },
                { time: "2 PM", pct: "75%", hover: "hover:bg-primary", base: "bg-primary/70", bold: false },
                { time: "3 PM", pct: "65%", hover: "hover:bg-primary/70", base: "bg-primary/50", bold: false },
                { time: "4 PM", pct: "45%", hover: "hover:bg-primary/50", base: "bg-primary/30", bold: false }
              ].map((bar, i) => (
                <motion.div 
                  key={i} 
                  initial={{ height: 0 }}
                  animate={{ height: bar.pct }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={`w-full ${bar.base} rounded-t-lg flex flex-col justify-end items-center pb-2 ${bar.hover} transition-colors cursor-pointer group`}
                >
                  <span className={`text-[10px] ${bar.isMax ? 'text-on-primary font-bold' : (bar.bold ? 'text-on-surface group-hover:font-bold' : 'text-on-surface-variant group-hover:text-on-surface')}`}>
                    {bar.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Procedure Distribution */}
          <div className="bg-surface-container-high p-6 rounded-2xl flex flex-col justify-center h-64 space-y-4 border border-surface-container-highest">
            <h4 className="text-lg font-bold text-on-surface">Procedure Distribution</h4>
            <div className="space-y-2">
              {[
                { label: "Cleanings", pct: "42%", color: "bg-primary" },
                { label: "Root Canals", pct: "28%", color: "bg-secondary" },
                { label: "Crown & Bridge", pct: "18%", color: "bg-tertiary" },
                { label: "Orthodontics", pct: "12%", color: "bg-outline" }
              ].map((proc, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-on-surface-variant font-medium flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${proc.color}`}></span> 
                    {proc.label}
                  </span>
                  <span className="font-bold text-on-surface">{proc.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SCHEDULE NEW APPOINTMENT MODAL */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* SCHEDULE NEW APPOINTMENT MODAL (Portaled to document.body) */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isNewAppointmentOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsNewAppointmentOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container-low overflow-hidden flex flex-col z-10 my-auto"
              >
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">calendar_add_on</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">Schedule Appointment</h2>
                      <p className="text-xs text-outline">Book a procedure slot in the chair queue</p>
                    </div>
                  </div>
                  <button onClick={() => setIsNewAppointmentOpen(false)} className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <form onSubmit={handleCreateAppointment} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Patient Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">person</span>
                      <input 
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        type="text" 
                        placeholder="e.g. Liam Henderson" 
                        className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Procedure Type</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">dentistry</span>
                        <select 
                          value={newProc}
                          onChange={(e) => setNewProc(e.target.value)}
                          className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                        >
                          <option>Routine Cleaning</option>
                          <option>Root Canal Therapy</option>
                          <option>Crown Fitting</option>
                          <option>Teeth Whitening</option>
                          <option>Wisdom Tooth Extraction</option>
                          <option>Dental Implants</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Chair Operatory</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">airline_seat_recline_extra</span>
                        <select 
                          value={newChair}
                          onChange={(e) => setNewChair(e.target.value)}
                          className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                        >
                          <option>Chair 01</option>
                          <option>Chair 02</option>
                          <option>Chair 03</option>
                          <option>Surgical Suite</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Time Slot</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">schedule</span>
                      <select 
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option>09:00 AM - 09:45 AM</option>
                        <option>10:00 AM - 10:30 AM</option>
                        <option>11:00 AM - 11:45 AM</option>
                        <option>01:30 PM - 02:15 PM</option>
                        <option>02:30 PM - 03:15 PM</option>
                        <option>03:30 PM - 04:15 PM</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  <div className="p-6 -mx-6 -mb-6 border-t border-surface-container-low bg-surface flex justify-end gap-3 mt-6">
                    <button type="button" onClick={() => setIsNewAppointmentOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-sm text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors">
                      Cancel
                    </button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-on-primary shadow-sm hover:bg-primary-container transition-colors"
                    >
                      Confirm & Schedule
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
