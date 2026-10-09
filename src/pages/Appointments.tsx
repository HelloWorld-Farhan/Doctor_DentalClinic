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
  dateDay?: number;
}

// Master appointments across multiple calendar days
const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  // Day 21 (Today)
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
    statusColor: "bg-tertiary-container text-on-tertiary-container",
    dateDay: 21
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
    statusColor: "bg-primary-fixed text-on-primary-fixed",
    dateDay: 21
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
    statusColor: "bg-primary-fixed text-on-primary-fixed",
    dateDay: 21
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
    statusColor: "bg-surface-container text-on-surface-variant",
    dateDay: 21
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
    statusColor: "bg-primary-fixed text-on-primary-fixed",
    dateDay: 21
  },

  // Day 20
  {
    id: "6",
    time: "09:15 AM - 10:00 AM",
    name: "David Miller",
    patientId: "#PT-5521",
    initials: "DM",
    initialsBg: "bg-teal-100 text-teal-800",
    proc: "Routine Cleaning",
    chair: "Chair 01",
    status: "Completed",
    statusColor: "bg-surface-container text-on-surface-variant",
    dateDay: 20
  },
  {
    id: "7",
    time: "11:00 AM - 12:00 PM",
    name: "Sophia Washington",
    patientId: "#PT-5522",
    initials: "SW",
    initialsBg: "bg-purple-100 text-purple-800",
    proc: "Root Canal Therapy",
    chair: "Chair 02",
    status: "Completed",
    statusColor: "bg-surface-container text-on-surface-variant",
    dateDay: 20
  },
  {
    id: "8",
    time: "02:30 PM - 03:15 PM",
    name: "Carlos Hernandez",
    patientId: "#PT-5523",
    initials: "CH",
    initialsBg: "bg-amber-100 text-amber-800",
    proc: "Crown Fitting",
    chair: "Chair 03",
    status: "Completed",
    statusColor: "bg-surface-container text-on-surface-variant",
    dateDay: 20
  },

  // Day 22
  {
    id: "9",
    time: "09:30 AM - 10:15 AM",
    name: "Elena Rostova",
    patientId: "#PT-6611",
    initials: "ER",
    initialsBg: "bg-pink-100 text-pink-800",
    proc: "Porcelain Veneers",
    chair: "Chair 01",
    status: "Confirmed",
    statusColor: "bg-primary-fixed text-on-primary-fixed",
    dateDay: 22
  },
  {
    id: "10",
    time: "11:00 AM - 11:45 AM",
    name: "Liam O'Connor",
    patientId: "#PT-6612",
    initials: "LO",
    initialsBg: "bg-emerald-100 text-emerald-800",
    proc: "Routine Cleaning",
    chair: "Chair 02",
    status: "Confirmed",
    statusColor: "bg-primary-fixed text-on-primary-fixed",
    dateDay: 22
  },
  {
    id: "11",
    time: "01:30 PM - 02:30 PM",
    name: "Zoe Ramirez",
    patientId: "#PT-6613",
    initials: "ZR",
    initialsBg: "bg-indigo-100 text-indigo-800",
    proc: "Orthodontic Adjustment",
    chair: "Chair 03",
    status: "Confirmed",
    statusColor: "bg-primary-fixed text-on-primary-fixed",
    dateDay: 22
  },
  {
    id: "12",
    time: "03:00 PM - 03:45 PM",
    name: "Arthur Pendelton",
    patientId: "#PT-6614",
    initials: "AP",
    initialsBg: "bg-blue-100 text-blue-800",
    proc: "Dental Implants",
    chair: "Chair 01",
    status: "Confirmed",
    statusColor: "bg-primary-fixed text-on-primary-fixed",
    dateDay: 22
  }
];

// Calendar appointment indicators map for all days of October 2023
// Colors:
// teal: Routine Cleaning / Hygiene
// blue: Root Canal / Endodontics
// amber: Crown & Bridge / Restorative
// purple: Orthodontics & Implants
// rose: Surgical / Wisdom Extraction
interface DayAppointmentMarker {
  day: number;
  dots: ('teal' | 'blue' | 'amber' | 'purple' | 'rose')[];
  count: number;
}

const CALENDAR_MARKERS: Record<number, ('teal' | 'blue' | 'amber' | 'purple' | 'rose')[]> = {
  2: ['teal'],
  4: ['teal', 'amber'],
  6: ['blue'],
  9: ['blue', 'purple'],
  11: ['teal', 'blue', 'amber'],
  13: ['teal', 'rose'],
  16: ['blue', 'amber', 'purple'],
  18: ['teal', 'blue'],
  20: ['teal', 'blue', 'amber'],
  21: ['blue', 'teal', 'amber', 'rose'], // Today (4 multi-discipline appointments)
  22: ['amber', 'teal', 'purple', 'blue'],
  24: ['teal', 'purple'],
  25: ['blue', 'amber'],
  27: ['rose', 'teal'],
  29: ['amber', 'blue']
};

// Power BI Telemetry datasets for periods
interface TelemetryPeriodData {
  maxText: string;
  bars: { time: string; pct: string; val: number; capacity: number; isMax?: boolean }[];
  distribution: { label: string; pct: string; count: number; color: string }[];
  totalCompleted: number;
  avgWaitMins: number;
  efficiency: string;
}

const TELEMETRY_DATA: Record<string, TelemetryPeriodData> = {
  "Current Week": {
    maxText: "Max: 11:00 AM (98% Capacity)",
    totalCompleted: 124,
    avgWaitMins: 4.2,
    efficiency: "94.8%",
    bars: [
      { time: "8 AM", pct: "30%", val: 4, capacity: 30 },
      { time: "9 AM", pct: "60%", val: 8, capacity: 60 },
      { time: "10 AM", pct: "85%", val: 12, capacity: 85 },
      { time: "11 AM", pct: "98%", val: 15, capacity: 98, isMax: true },
      { time: "12 PM", pct: "50%", val: 7, capacity: 50 },
      { time: "1 PM", pct: "40%", val: 5, capacity: 40 },
      { time: "2 PM", pct: "75%", val: 11, capacity: 75 },
      { time: "3 PM", pct: "65%", val: 9, capacity: 65 },
      { time: "4 PM", pct: "45%", val: 6, capacity: 45 }
    ],
    distribution: [
      { label: "Cleanings & Hygiene", pct: "42%", count: 52, color: "bg-teal-600" },
      { label: "Root Canal Therapy", pct: "28%", count: 35, color: "bg-blue-600" },
      { label: "Crown & Bridge", pct: "18%", count: 22, color: "bg-amber-500" },
      { label: "Orthodontics & Implants", pct: "12%", count: 15, color: "bg-purple-600" }
    ]
  },
  "Last Week": {
    maxText: "Max: 10:00 AM (92% Capacity)",
    totalCompleted: 118,
    avgWaitMins: 6.8,
    efficiency: "89.2%",
    bars: [
      { time: "8 AM", pct: "45%", val: 6, capacity: 45 },
      { time: "9 AM", pct: "70%", val: 10, capacity: 70 },
      { time: "10 AM", pct: "92%", val: 14, capacity: 92, isMax: true },
      { time: "11 AM", pct: "80%", val: 12, capacity: 80 },
      { time: "12 PM", pct: "65%", val: 9, capacity: 65 },
      { time: "1 PM", pct: "35%", val: 4, capacity: 35 },
      { time: "2 PM", pct: "82%", val: 12, capacity: 82 },
      { time: "3 PM", pct: "55%", val: 7, capacity: 55 },
      { time: "4 PM", pct: "38%", val: 5, capacity: 38 }
    ],
    distribution: [
      { label: "Cleanings & Hygiene", pct: "38%", count: 45, color: "bg-teal-600" },
      { label: "Root Canal Therapy", pct: "32%", count: 38, color: "bg-blue-600" },
      { label: "Crown & Bridge", pct: "20%", count: 24, color: "bg-amber-500" },
      { label: "Orthodontics & Implants", pct: "10%", count: 11, color: "bg-purple-600" }
    ]
  },
  "This Month": {
    maxText: "Max: 02:00 PM (95% Capacity)",
    totalCompleted: 512,
    avgWaitMins: 5.1,
    efficiency: "92.4%",
    bars: [
      { time: "8 AM", pct: "55%", val: 28, capacity: 55 },
      { time: "9 AM", pct: "78%", val: 42, capacity: 78 },
      { time: "10 AM", pct: "88%", val: 48, capacity: 88 },
      { time: "11 AM", pct: "91%", val: 52, capacity: 91 },
      { time: "12 PM", pct: "60%", val: 32, capacity: 60 },
      { time: "1 PM", pct: "48%", val: 25, capacity: 48 },
      { time: "2 PM", pct: "95%", val: 55, capacity: 95, isMax: true },
      { time: "3 PM", pct: "72%", val: 38, capacity: 72 },
      { time: "4 PM", pct: "50%", val: 26, capacity: 50 }
    ],
    distribution: [
      { label: "Cleanings & Hygiene", pct: "45%", count: 230, color: "bg-teal-600" },
      { label: "Root Canal Therapy", pct: "25%", count: 128, color: "bg-blue-600" },
      { label: "Crown & Bridge", pct: "19%", count: 97, color: "bg-amber-500" },
      { label: "Orthodontics & Implants", pct: "11%", count: 57, color: "bg-purple-600" }
    ]
  },
  "Next Week (Projected)": {
    maxText: "Max: 11:00 AM (84% Projected)",
    totalCompleted: 98,
    avgWaitMins: 3.5,
    efficiency: "96.0%",
    bars: [
      { time: "8 AM", pct: "25%", val: 3, capacity: 25 },
      { time: "9 AM", pct: "50%", val: 7, capacity: 50 },
      { time: "10 AM", pct: "70%", val: 10, capacity: 70 },
      { time: "11 AM", pct: "84%", val: 13, capacity: 84, isMax: true },
      { time: "12 PM", pct: "45%", val: 6, capacity: 45 },
      { time: "1 PM", pct: "30%", val: 4, capacity: 30 },
      { time: "2 PM", pct: "60%", val: 8, capacity: 60 },
      { time: "3 PM", pct: "45%", val: 6, capacity: 45 },
      { time: "4 PM", pct: "30%", val: 4, capacity: 30 }
    ],
    distribution: [
      { label: "Cleanings & Hygiene", pct: "50%", count: 49, color: "bg-teal-600" },
      { label: "Root Canal Therapy", pct: "20%", count: 20, color: "bg-blue-600" },
      { label: "Crown & Bridge", pct: "18%", count: 18, color: "bg-amber-500" },
      { label: "Orthodontics & Implants", pct: "12%", count: 11, color: "bg-purple-600" }
    ]
  }
};

export default function Appointments() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isOptimizeOpen, setIsOptimizeOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(21);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Power BI Telemetry Period filter
  const [telemetryFilter, setTelemetryFilter] = useState<string>("Current Week");
  const currentTelemetry = TELEMETRY_DATA[telemetryFilter] || TELEMETRY_DATA["Current Week"];

  // Optimize modal algorithm state
  const [optEngineRunning, setOptEngineRunning] = useState(false);
  const [autoReassign, setAutoReassign] = useState(true);
  const [notifyPatients, setNotifyPatients] = useState(true);

  // New Appointment Form State
  const [newName, setNewName] = useState("");
  const [newProc, setNewProc] = useState("Routine Cleaning");
  const [newChair, setNewChair] = useState("Chair 01");
  const [newTime, setNewTime] = useState("01:30 PM - 02:15 PM");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Filter appointments by selected calendar date + status + search
  const visibleAppointments = appointments.filter(apt => {
    const matchesDate = apt.dateDay === undefined || apt.dateDay === selectedDate;
    const matchesFilter = activeFilter === "All" || apt.status === activeFilter;
    const matchesSearch = !searchQuery || 
      apt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.proc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesFilter && matchesSearch;
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
      statusColor: "bg-primary-fixed text-on-primary-fixed",
      dateDay: selectedDate
    };

    setAppointments([newApt, ...appointments]);
    setIsNewAppointmentOpen(false);
    setNewName("");
    showToast(`Appointment scheduled for ${newApt.name} on Oct ${selectedDate}, 2023!`);
  };

  const handleCancelAppointment = (id: string, name: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled', statusColor: 'bg-error-container text-on-error-container' } : a));
    showToast(`Appointment for ${name} marked as cancelled.`);
  };

  const handleApplyOptimization = () => {
    setOptEngineRunning(true);
    setTimeout(() => {
      setOptEngineRunning(false);
      setIsOptimizeOpen(false);
      // Re-balance chair queue
      setAppointments(prev => prev.map(a => {
        if (a.name === "Robert King") {
          return { ...a, chair: "Chair 03", time: "11:00 AM - 11:45 AM" };
        }
        return a;
      }));
      showToast("AI schedule optimization applied! 3 chair gaps eliminated and wait times reduced by 14m.");
    }, 1200);
  };

  const getDotColorClass = (color: 'teal' | 'blue' | 'amber' | 'purple' | 'rose') => {
    switch (color) {
      case 'teal': return 'bg-teal-500';
      case 'blue': return 'bg-blue-500';
      case 'amber': return 'bg-amber-500';
      case 'purple': return 'bg-purple-500';
      case 'rose': return 'bg-rose-500';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 relative pb-12"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-8 z-[9999] bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-primary-container"
          >
            <span className="material-symbols-outlined text-[20px] text-teal-300">check_circle</span>
            <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Stats / Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Today's Appointments", value: `${appointments.filter(a => a.dateDay === 21).length + 19} Scheduled`, change: "+12% from yesterday", icon: "trending_up", mainIcon: "calendar_today", color: "text-primary", bgInfo: "bg-primary-container text-on-primary-container" },
          { title: "In Progress", value: "4 Active Chairs", change: "Telemetry Synced", icon: "schedule", mainIcon: "clinical_notes", color: "text-tertiary", bgInfo: "bg-tertiary-container text-on-tertiary-container" },
          { title: "Completed Today", value: "16 Patients", change: "98% satisfaction", icon: "check_circle", mainIcon: "task_alt", color: "text-secondary", bgInfo: "bg-secondary-container text-on-secondary-container" },
          { title: "Cancelled / Requests", value: "2 Requests", change: "Requires action", icon: "warning", mainIcon: "event_busy", color: "text-error", bgInfo: "bg-error-container text-on-error-container" }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between shadow-xs border border-surface-container-high">
            <div>
              <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">{stat.title}</p>
              <h3 className="text-2xl font-bold text-on-surface mt-1">{stat.value}</h3>
              <span className={`inline-flex items-center text-xs ${stat.color} mt-1 font-semibold`}>
                <span className="material-symbols-outlined text-[15px] mr-1">{stat.icon}</span> {stat.change}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bgInfo} shadow-xs`}>
              <span className="material-symbols-outlined text-[24px]">{stat.mainIcon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section: Analytics & Calendar/Queue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Appointment Queue & Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-low p-6 rounded-2xl shadow-xs border border-surface-container-high">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-on-surface">Appointment Queue</h2>
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold">
                    Oct {selectedDate}, 2023
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">Manage daily clinical schedule, operatory chair intake, and procedure status.</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsNewAppointmentOpen(true)}
                  className="bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-primary-container transition-all shadow-md shadow-primary/20 cursor-pointer"
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeFilter === filter 
                        ? 'bg-primary text-on-primary shadow-xs' 
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
                  className="pl-10 pr-4 py-1.5 bg-surface-container-high rounded-xl text-on-surface text-xs outline-none w-full md:w-64 focus:ring-1 focus:ring-primary" 
                  placeholder="Search patient or procedure..." 
                  type="text"
                />
              </div>
            </div>

            {/* Appointment List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="text-xs font-semibold text-on-surface-variant border-b border-surface-container-highest">
                    <th className="py-2.5 px-4">Time Slot</th>
                    <th className="py-2.5 px-4">Patient Details</th>
                    <th className="py-2.5 px-4">Procedure</th>
                    <th className="py-2.5 px-4">Chair</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container-high/60 text-sm text-on-surface">
                  {visibleAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-outline">
                        <span className="material-symbols-outlined text-[32px] block text-outline/60 mb-1">event_busy</span>
                        No appointments scheduled for October {selectedDate}, 2023.
                      </td>
                    </tr>
                  ) : (
                    visibleAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-surface-container transition-colors">
                        <td className="py-3.5 px-4 font-bold text-xs">{apt.time}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${apt.initialsBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                              {apt.initials}
                            </div>
                            <div>
                              <p className="font-bold text-xs">{apt.name}</p>
                              <p className="text-[11px] text-on-surface-variant">ID: {apt.patientId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-surface-container-high rounded-md text-xs font-bold">{apt.proc}</span>
                        </td>
                        <td className="py-3.5 px-4 text-on-surface-variant font-medium text-xs">{apt.chair}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${apt.statusColor}`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button 
                            onClick={() => showToast(`Reschedule requested for ${apt.name}`)}
                            className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer" 
                            title="Reschedule"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit_calendar</span>
                          </button>
                          <button 
                            onClick={() => handleCancelAppointment(apt.id, apt.name)}
                            className="p-1 text-on-surface-variant hover:text-error transition-colors cursor-pointer" 
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
          {/* Calendar Widget with Appointment Indicators & Color Legend */}
          <div className="bg-surface-container-low p-6 rounded-2xl shadow-xs border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface">October 2023</h3>
                <p className="text-[11px] text-on-surface-variant">Click day to inspect schedule</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => showToast("Navigated to September 2023")}
                  className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button 
                  onClick={() => showToast("Navigated to November 2023")}
                  className="p-1 hover:bg-surface-container-high rounded-lg text-on-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            {/* COLOR LEGEND: Mentions which color denotes what procedure */}
            <div className="p-2.5 bg-surface-container-lowest rounded-xl border border-surface-container-high space-y-1.5">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                Appointment Color Legend
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                  <span className="text-on-surface-variant font-medium">Routine Cleaning</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                  <span className="text-on-surface-variant font-medium">Root Canal (Endo)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="text-on-surface-variant font-medium">Crown & Bridge</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                  <span className="text-on-surface-variant font-medium">Orthodontics / Implants</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                  <span className="text-on-surface-variant font-medium">Surgery / Extractions</span>
                </div>
              </div>
            </div>

            {/* Weekday Names */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-on-surface-variant mb-1">
              <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>

            {/* Calendar Days with Multiple Colored Appointment Dots */}
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
              {[25,26,27,28,29,30].map(d => (
                <span key={`prev-${d}`} className="p-2 text-on-surface-variant/30 text-xs">{d}</span>
              ))}

              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDate === day;
                const dots = CALENDAR_MARKERS[day];

                return (
                  <button 
                    key={`d-${day}`} 
                    onClick={() => { 
                      setSelectedDate(day); 
                      const count = appointments.filter(a => a.dateDay === day).length || (dots ? dots.length : 0);
                      showToast(`Selected Oct ${day}, 2023 (${count} appointments scheduled)`); 
                    }}
                    className={`p-1.5 rounded-xl transition-all flex flex-col items-center justify-between min-h-[42px] cursor-pointer relative group ${
                      isSelected 
                        ? 'bg-primary text-on-primary font-bold shadow-sm' 
                        : 'text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="text-xs leading-none">{day}</span>
                    
                    {/* Multiple appointment dots on the same day */}
                    {dots && dots.length > 0 && (
                      <div className="flex items-center gap-0.5 mt-1 justify-center">
                        {dots.slice(0, 3).map((dotColor, idx) => (
                          <span 
                            key={idx} 
                            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white ring-1 ring-primary' : getDotColorClass(dotColor)}`}
                          />
                        ))}
                        {dots.length > 3 && (
                          <span className={`text-[8px] font-bold leading-none ${isSelected ? 'text-white' : 'text-primary'}`}>
                            +{dots.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chair Availability Card & Optimize Schedule Slots Button */}
          <div className="bg-primary-container text-on-primary-container p-6 rounded-2xl shadow-xs relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Chair Availability</h3>
              <span className="text-xs px-2 py-0.5 bg-on-primary-container/20 rounded-full font-bold">
                Telemetry Active
              </span>
            </div>
            <p className="text-xs opacity-90 mb-4 leading-relaxed">
              3 of 4 operatory chairs are fully active with real-time pressure & vacuum sensor telemetry connected.
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOptimizeOpen(true)}
              className="bg-on-primary-container text-primary px-4 py-2.5 rounded-xl text-xs w-full font-bold hover:bg-surface-bright transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Optimize Schedule Slots
            </motion.button>
          </div>
        </div>
      </div>

      {/* Power BI Style Analytics Section with Working Period Selector */}
      <div className="bg-surface-container-low p-6 rounded-2xl shadow-xs border border-surface-container-high space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container-highest pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[18px]">analytics</span> Power BI Telemetry
            </div>
            <h2 className="text-xl font-bold text-on-surface">Appointment Volume & Peak Hours Analysis</h2>
            <div className="flex items-center gap-4 text-xs text-on-surface-variant mt-1 font-medium">
              <span>Completed Sessions: <strong className="text-on-surface">{currentTelemetry.totalCompleted}</strong></span>
              <span>•</span>
              <span>Avg Wait Time: <strong className="text-emerald-600">{currentTelemetry.avgWaitMins}m</strong></span>
              <span>•</span>
              <span>Efficiency: <strong className="text-primary">{currentTelemetry.efficiency}</strong></span>
            </div>
          </div>
          
          {/* Dynamic Filter Dropdown (Current Week, Last Week, This Month, Next Week) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Filter by:</span>
            <select 
              value={telemetryFilter}
              onChange={(e) => {
                setTelemetryFilter(e.target.value);
                showToast(`Loaded analytics telemetry for ${e.target.value}`);
              }}
              className="bg-surface-container-high text-on-surface px-3 py-2 rounded-xl text-xs font-bold outline-none border border-surface-container-highest cursor-pointer focus:ring-1 focus:ring-primary"
            >
              <option>Current Week</option>
              <option>Last Week</option>
              <option>This Month</option>
              <option>Next Week (Projected)</option>
            </select>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Animated Bar Chart for Peak Hours */}
          <div className="lg:col-span-2 bg-surface-container-high p-6 rounded-2xl flex flex-col justify-between h-72 border border-surface-container-highest">
            <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant mb-2">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">bar_chart</span>
                Peak Patient Density by Hour ({telemetryFilter})
              </span>
              <span className="text-primary font-bold bg-primary/10 px-2.5 py-1 rounded-full">
                {currentTelemetry.maxText}
              </span>
            </div>

            {/* Dynamic Bars with smooth Framer Motion */}
            <div className="flex items-end justify-between h-44 gap-2 pt-4">
              {currentTelemetry.bars.map((bar, i) => (
                <div key={bar.time} className="w-full flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-on-surface text-surface text-[10px] py-1 px-2 rounded-lg whitespace-nowrap shadow-md pointer-events-none z-20 font-bold">
                    {bar.val} Patients ({bar.capacity}% Full)
                  </div>

                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: bar.pct }}
                    transition={{ duration: 0.5, delay: i * 0.04 }}
                    className={`w-full rounded-t-lg flex flex-col justify-end items-center pb-2 cursor-pointer transition-colors ${
                      bar.isMax 
                        ? 'bg-primary hover:bg-primary-container shadow-xs' 
                        : 'bg-primary/40 hover:bg-primary/70'
                    }`}
                  >
                    <span className={`text-[10px] ${bar.isMax ? 'text-on-primary font-bold' : 'text-on-surface font-medium'}`}>
                      {bar.time}
                    </span>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Procedure Distribution */}
          <div className="bg-surface-container-high p-6 rounded-2xl flex flex-col justify-center h-72 space-y-4 border border-surface-container-highest">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-on-surface">Procedure Distribution</h4>
              <span className="text-[10px] text-on-surface-variant font-mono">100% Normalized</span>
            </div>

            <div className="space-y-3">
              {currentTelemetry.distribution.map((proc, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-on-surface-variant font-medium flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${proc.color}`}></span> 
                      {proc.label}
                    </span>
                    <span className="font-bold text-on-surface">{proc.pct} ({proc.count})</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: proc.pct }}
                      transition={{ duration: 0.5 }}
                      className={`h-full ${proc.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OPTIMIZE SCHEDULE SLOTS MODAL (Portaled to document.body)              */}
      {/* ========================================================================= */}
      {isOptimizeOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Fullscreen Backdrop Blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setIsOptimizeOpen(false)}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-on-surface">AI Operatory Schedule Optimization</h3>
                  <p className="text-xs text-outline mt-0.5">
                    Real-time chair load balancing, turnaround reduction & idle gap recovery
                  </p>
                </div>
              </div>
              <button 
                type="button"
                className="p-2 rounded-xl text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer" 
                onClick={() => setIsOptimizeOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Telemetry Metric Gains */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-surface rounded-xl border border-surface-container-high text-center">
                  <span className="text-[11px] text-outline font-medium block">Chair Utilization</span>
                  <div className="text-lg font-bold text-primary mt-0.5">78% → 94%</div>
                  <span className="text-[10px] text-emerald-600 font-bold">+16% Gain</span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-surface-container-high text-center">
                  <span className="text-[11px] text-outline font-medium block">Patient Wait Time</span>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">18m → 4m</div>
                  <span className="text-[10px] text-emerald-600 font-bold">-14m Saved</span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-surface-container-high text-center">
                  <span className="text-[11px] text-outline font-medium block">Idle Gaps Recovered</span>
                  <div className="text-lg font-bold text-on-surface mt-0.5">3 Gaps</div>
                  <span className="text-[10px] text-primary font-bold">45m Billable</span>
                </div>
              </div>

              {/* Recommended Action Items */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Algorithm Rebalancing Actions (Oct 21, 2023)
                </span>

                <div className="p-3.5 bg-surface rounded-xl border border-surface-container-high space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">swap_horiz</span>
                      Shift Robert King (Crown Fitting) to Chair 03
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-200">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Moves 11:00 AM slot to Chair 03 to eliminate 15m idle time in Operatory 1.
                  </p>
                </div>

                <div className="p-3.5 bg-surface rounded-xl border border-surface-container-high space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-teal-600">group_work</span>
                      Batch Hygiene Slots in Operatory 02
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-teal-50 text-teal-600 rounded-full border border-teal-200">
                      Efficiency
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Clusters Sarah Mehta & follow-up cleaning back-to-back to conserve autoclave cycles.
                  </p>
                </div>

                <div className="p-3.5 bg-surface rounded-xl border border-surface-container-high space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-rose-600">emergency</span>
                      Reserve 30m Emergency Cushion Buffer
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full border border-rose-200">
                      Safety Protocol
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Locks 03:00 PM – 03:30 PM in Chair 04 for walk-in pulpitis or trauma.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-surface-container-low space-y-2">
                <div className="flex items-center justify-between p-2">
                  <span className="text-xs font-semibold text-on-surface">Auto-reassign chair operatory tags</span>
                  <input 
                    type="checkbox" 
                    checked={autoReassign} 
                    onChange={(e) => setAutoReassign(e.target.checked)} 
                    className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                  />
                </div>
                <div className="flex items-center justify-between p-2">
                  <span className="text-xs font-semibold text-on-surface">Send automated SMS notifications to shifted patients</span>
                  <input 
                    type="checkbox" 
                    checked={notifyPatients} 
                    onChange={(e) => setNotifyPatients(e.target.checked)} 
                    className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary cursor-pointer" 
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-surface-container-low bg-surface-container-lowest flex justify-end gap-3 px-6">
              <button 
                type="button"
                className="px-5 py-2.5 rounded-xl text-outline hover:text-on-surface text-xs font-semibold cursor-pointer"
                onClick={() => setIsOptimizeOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button"
                disabled={optEngineRunning}
                onClick={handleApplyOptimization}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold shadow-md shadow-primary/20 hover:bg-primary-container transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {optEngineRunning ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Applying Optimization...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Apply Schedule Optimization
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 2. SCHEDULE NEW APPOINTMENT MODAL (Portaled to document.body)              */}
      {/* ========================================================================= */}
      {isNewAppointmentOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNewAppointmentOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
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
                  <p className="text-xs text-outline">Book a procedure slot for Oct {selectedDate}, 2023</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewAppointmentOpen(false)} 
                className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer"
              >
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

              <div className="pt-4 border-t border-surface-container-low flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsNewAppointmentOpen(false)} 
                  className="px-5 py-2.5 rounded-xl font-medium text-xs text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-primary text-on-primary shadow-xs hover:bg-primary-container transition-colors cursor-pointer"
                >
                  Confirm & Schedule
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}
    </motion.div>
  );
}
