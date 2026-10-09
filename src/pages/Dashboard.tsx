import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dashboard() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 relative"
    >
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
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-sm font-semibold text-primary tracking-wider uppercase mb-1">Clinical Workspace</div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight mb-1">Good morning, Dr. Sharma</h1>
          <p className="text-base text-on-surface-variant">Here is your practice overview and patient schedule for today.</p>
        </div>
        <div className="flex items-center gap-3 z-10">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => setIsNewPatientOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            New Patient
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={() => setIsScheduleOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary hover:bg-primary-container rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
            Schedule Appointment
          </motion.button>
        </div>
      </div>

      {/* Key Metrics Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Today's Appointments", icon: "calendar_month", val: "8", stat: "+12%", statLabel: "vs yesterday", colorClass: "bg-primary/5", iconBg: "bg-primary-fixed", iconText: "text-on-primary-fixed", statColor: "text-emerald-600" },
          { title: "Pending Reviews", icon: "rate_review", val: "3", stat: "Action req.", statLabel: "chart summaries", colorClass: "bg-tertiary/5", iconBg: "bg-tertiary-fixed", iconText: "text-on-tertiary-fixed", statColor: "text-amber-600" },
          { title: "Patient Satisfaction", icon: "sentiment_satisfied", val: "4.9", valSuffix: "/5", stat: "Top 5%", statLabel: "regional clinic", colorClass: "bg-secondary/5", iconBg: "bg-secondary-fixed", iconText: "text-on-secondary-fixed", statColor: "text-emerald-600" },
          { title: "Active Patients", icon: "group", val: "1,240", stat: "+38", statLabel: "this month", colorClass: "bg-primary/5", iconBg: "bg-surface-container-high", iconText: "text-on-surface", statColor: "text-emerald-600" }
        ].map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-low flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all"
          >
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${item.colorClass} rounded-full group-hover:scale-125 transition-transform`}></div>
            <div className="flex justify-between items-start mb-6">
              <span className="text-sm font-semibold text-on-surface-variant z-10">{item.title}</span>
              <div className={`p-2 rounded-xl z-10 ${item.iconBg} ${item.iconText}`}>
                <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
              </div>
            </div>
            <div className="z-10">
              <div className="text-3xl font-bold text-on-surface tracking-tight">
                {item.val}{item.valSuffix && <span className="text-lg text-on-surface-variant font-medium">{item.valSuffix}</span>}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm font-bold ${item.statColor}`}>{item.stat}</span>
                <span className="text-xs text-on-surface-variant font-medium">{item.statLabel}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 flex flex-col overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Today's Schedule</h2>
              <p className="text-sm text-on-surface-variant mt-1">Showing active patient queue for today, Oct 24</p>
            </div>
            <button className="text-primary text-sm hover:underline font-bold flex items-center gap-1">
              View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="text-sm font-semibold text-on-surface-variant bg-surface-container-low/50">
                  <th className="p-3 rounded-l-xl pl-4">Time</th>
                  <th className="p-3">Patient Name</th>
                  <th className="p-3">Procedure</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-on-surface divide-y divide-surface-container-low/50">
                {[
                  { time: "09:00 AM", name: "Neha Gupta", id: "#40921", initials: "JD", proc: "Root Canal Therapy", status: "In Progress", statusColor: "bg-primary-fixed text-on-primary-fixed", avatarColor: "bg-secondary-fixed text-on-secondary-fixed" },
                  { time: "10:15 AM", name: "Mark Singh", id: "#40922", initials: "MS", proc: "Routine Cleaning & Exam", status: "Confirmed", statusColor: "bg-surface-container-high text-on-surface", avatarColor: "bg-tertiary-fixed text-on-tertiary-fixed" },
                  { time: "11:30 AM", name: "Alice Ross", id: "#40925", initials: "AR", proc: "Orthodontic Adjustment", status: "Confirmed", statusColor: "bg-surface-container-high text-on-surface", avatarColor: "bg-secondary-container text-on-secondary-container" },
                  { time: "01:30 PM", name: "Robert King", id: "#40930", initials: "RK", proc: "Teeth Whitening Session", status: "Completed", statusColor: "bg-emerald-100 text-emerald-800", avatarColor: "bg-surface-container-high text-on-surface" },
                  { time: "03:00 PM", name: "Anjali Lane", id: "#40935", initials: "EL", proc: "Emergency Crown Fix", status: "Confirmed", statusColor: "bg-surface-container-high text-on-surface", avatarColor: "bg-error-container text-on-error-container" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="p-4 pl-4 font-bold whitespace-nowrap">{row.time}</td>
                    <td className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${row.avatarColor}`}>{row.initials}</div>
                      <div>
                        <div className="font-bold whitespace-nowrap">{row.name}</div>
                        <div className="text-xs text-on-surface-variant font-medium mt-0.5">ID: {row.id}</div>
                      </div>
                    </td>
                    <td className="p-4 text-on-surface-variant whitespace-nowrap font-medium">{row.proc}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${row.statusColor}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 pr-4 text-right whitespace-nowrap">
                      <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Schedule Overview */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-on-surface">Weekly Overview</h2>
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-lg">Oct 20 - Oct 26</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-6">Appointment volume distribution across weekdays.</p>
            
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
                  <div className={`w-full transition-all rounded-t-xl ${bar.active ? 'bg-primary hover:bg-primary-container shadow-md' : 'bg-primary/20 hover:bg-primary'}`} style={{ height: bar.height }}></div>
                  <span className={`text-xs mt-3 ${bar.active ? 'font-bold text-primary' : 'text-on-surface-variant font-semibold'}`}>{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-surface-container-low/80 flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold text-on-surface-variant mb-1">Total Weekly Load</div>
              <div className="text-xl font-bold text-on-surface">69 Patients</div>
            </div>
            <div className="w-12 h-12 bg-primary-fixed text-on-primary-fixed rounded-xl flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[24px]">trending_up</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-on-surface">Quick Note Pad</h2>
              <span className="material-symbols-outlined text-primary text-[24px]">edit_note</span>
            </div>
            <textarea className="w-full p-4 bg-surface-container-low/50 rounded-xl text-on-surface border border-transparent focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-sm transition-all" placeholder="Type quick patient reminders or prescription notes here..." rows={4}></textarea>
          </div>
          <div className="flex justify-end mt-4">
            <button className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary-container transition-all shadow-sm">
              Save Note
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-on-surface">Equipment Status</h2>
              <span className="material-symbols-outlined text-emerald-600 text-[24px]">check_circle</span>
            </div>
            <div className="space-y-3">
              {[
                { name: "Digital X-Ray Unit A", status: "Operational", color: "text-emerald-700 bg-emerald-100" },
                { name: "Autoclave Sterilizer #2", status: "Operational", color: "text-emerald-700 bg-emerald-100" },
                { name: "Laser Scaler Unit", status: "Maintenance Due", color: "text-amber-700 bg-amber-100" }
              ].map((eq, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-surface-container-low/50 rounded-xl">
                  <span className="text-sm font-semibold text-on-surface">{eq.name}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${eq.color}`}>{eq.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary text-on-primary rounded-2xl shadow-md p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
            <span className="material-symbols-outlined text-[180px]">dentistry</span>
          </div>
          <div className="z-10">
            <div className="text-xs font-bold text-primary-fixed uppercase tracking-wider mb-3">Dental Clinic Pro Tip</div>
            <h3 className="text-2xl font-bold text-on-primary mb-3 leading-tight">Streamline Charting with Voice</h3>
            <p className="text-sm text-on-primary/90 leading-relaxed font-medium">Enable automated voice-to-text periodontal charting in the settings menu to save up to 4 minutes per patient consultation.</p>
          </div>
          <div className="mt-8 z-10">
            <button className="px-5 py-3 bg-surface-container-lowest text-primary rounded-xl text-sm font-bold hover:bg-surface-bright transition-all shadow-md">
              Enable Feature
            </button>
          </div>
        </div>
      </div>

      {/* Modals rendered via createPortal directly to document.body to prevent top bar clipping */}
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
                      <p className="text-xs text-outline">Select patient, chair operatory and procedure slot.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsScheduleOpen(false)} className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Patient Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">person_search</span>
                      <input type="text" placeholder="Search patient name or ID..." className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Date</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">calendar_today</span>
                        <input type="date" defaultValue="2023-10-24" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Time Slot</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">schedule</span>
                        <input type="time" defaultValue="10:30" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Procedure Type</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">dentistry</span>
                      <select className="w-full pl-10 pr-8 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer text-sm font-medium">
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
                <div className="p-6 border-t border-surface-container-low bg-surface flex justify-end gap-3">
                  <button onClick={() => setIsScheduleOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-sm text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
                  <button 
                    onClick={() => { 
                      setIsScheduleOpen(false); 
                      showToast("Appointment scheduled successfully!"); 
                    }} 
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-on-primary shadow-sm hover:bg-primary-container transition-colors"
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
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container-low overflow-hidden flex flex-col z-10 my-auto"
              >
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">person_add</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">Register New Patient</h2>
                      <p className="text-xs text-outline">Enter patient demographics & contact details.</p>
                    </div>
                  </div>
                  <button onClick={() => setIsNewPatientOpen(false)} className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Full Name</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">person</span>
                      <input type="text" placeholder="e.g. John Doe" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Phone Number</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">call</span>
                        <input type="tel" placeholder="+1 (555) 000-0000" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-outline">Date of Birth</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">calendar_today</span>
                        <input type="date" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-outline">Email Address</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">mail</span>
                      <input type="email" placeholder="john.doe@example.com" className="w-full pl-10 pr-3 py-2.5 bg-surface-container-low rounded-xl border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium" />
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-surface-container-low bg-surface flex justify-end gap-3">
                  <button onClick={() => setIsNewPatientOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-sm text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors">Cancel</button>
                  <button 
                    onClick={() => { 
                      setIsNewPatientOpen(false); 
                      showToast("New patient record created successfully!"); 
                    }} 
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-on-primary shadow-sm hover:bg-primary-container transition-colors"
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
