import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  category: string;
  icon: string;
  unread: boolean;
  bgClass: string;
  textClass: string;
  borderClass: string;
}

const initialNotifications: NotificationItem[] = [
  { 
    id: '1', 
    title: 'New Appointment Booked', 
    desc: 'Alice Ross scheduled a Crown Restoration for tomorrow at 11:30 AM.', 
    time: '5m ago', 
    category: 'Appointment',
    icon: 'event_available', 
    unread: true,
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-600',
    borderClass: 'border-teal-500/20'
  },
  { 
    id: '2', 
    title: 'Chart Summary Pending', 
    desc: 'Patient #40921 root canal requires chart summary & clinical sign-off.', 
    time: '45m ago', 
    category: 'Clinical',
    icon: 'rate_review', 
    unread: true,
    bgClass: 'bg-sky-500/10',
    textClass: 'text-sky-600',
    borderClass: 'border-sky-500/20'
  },
  { 
    id: '3', 
    title: 'Equipment Maintenance Alert', 
    desc: 'Laser Scaler Unit in Operatory 3 has reached 100 operating hours. Due for calibration.', 
    time: '2h ago', 
    category: 'Equipment',
    icon: 'warning', 
    unread: true,
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-600',
    borderClass: 'border-amber-500/20'
  },
  { 
    id: '4', 
    title: '5-Star Patient Review', 
    desc: 'Sarah Jenkins left 5 stars: "Dr. Sharma made my root canal completely painless!"', 
    time: '4h ago', 
    category: 'Review',
    icon: 'reviews', 
    unread: false,
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-600',
    borderClass: 'border-emerald-500/20'
  },
  { 
    id: '5', 
    title: 'Pathology Lab Report In', 
    desc: 'Biopsy report received from LabCorp for Marcus Chen (Incisal biopsy - Normal).', 
    time: '1d ago', 
    category: 'Lab Result',
    icon: 'biotech', 
    unread: false,
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-600',
    borderClass: 'border-purple-500/20'
  }
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');

  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => n.unread).length;
  const filteredNotifications = notifFilter === 'unread' 
    ? notifications.filter(n => n.unread) 
    : notifications;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Primary Clinical Navigation (Settings removed and moved to Doctor Profile dropdown)
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Appointments', path: '/dashboard/appointments', icon: 'calendar_month' },
    { name: 'Patients', path: '/dashboard/patients', icon: 'group' },
    { name: 'Reviews', path: '/dashboard/reviews', icon: 'reviews' },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface flex min-h-screen overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 shadow-2xl lg:shadow-none bg-surface-container-low z-50 flex flex-col pt-8 pb-6 border-r border-surface-container-high/60`}
      >
        {/* Brand Header */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-md shadow-primary/20">
            <span className="material-symbols-outlined text-[24px]">dentistry</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-primary block leading-tight">Dental Clinic Pro</span>
            <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-wider">Doctor Portal</span>
          </div>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-1 px-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <button 
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-primary text-on-primary font-semibold shadow-sm' 
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-medium'
                }`}
              >
                <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`}>{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>
        
        {/* Sidebar Footer - Doctor Mini Card & Sign Out */}
        <div className="px-4 mt-auto pt-5 border-t border-surface-container-high/60 space-y-3">
          <div className="p-3 bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-xs flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary/10 text-primary ring-2 ring-primary/20 shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80" 
                alt="Dr. Sarah Sharma" 
                className="w-full h-full object-cover" 
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-1 ring-white"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-on-surface truncate">Dr. Sarah Sharma, DDS</div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Operatory 01 • Active
              </div>
            </div>
          </div>

          <button 
            onClick={() => navigate('/')} 
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-error hover:bg-error-container/40 transition-all font-medium text-xs"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Lock / Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 w-full">
        {/* Header */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-md shadow-xs z-30 flex items-center justify-between px-6 lg:px-10 border-b border-surface-container-low">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            
            {/* 1. Notifications Dropdown */}
            <div className="relative" ref={notifDropdownRef}>
              <button 
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className={`p-2.5 rounded-full transition-all relative ${
                  notificationsOpen 
                    ? 'bg-primary-container text-on-primary-container shadow-xs' 
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[21px] block">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs ring-2 ring-surface">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-13 right-0 w-88 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high/80 overflow-hidden z-50 ring-1 ring-black/5"
                  >
                    {/* Header */}
                    <div className="p-4 bg-surface-container-lowest border-b border-surface-container-low flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-on-surface">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-primary font-semibold hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">done_all</span>
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex px-4 pt-2 border-b border-surface-container-low/60 gap-4 text-xs font-semibold">
                      <button 
                        onClick={() => setNotifFilter('all')}
                        className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                          notifFilter === 'all' 
                            ? 'text-primary border-primary' 
                            : 'text-on-surface-variant border-transparent hover:text-on-surface'
                        }`}
                      >
                        All
                        <span className="px-1.5 py-0.2 bg-surface-container-high rounded-full text-[10px]">
                          {notifications.length}
                        </span>
                      </button>
                      <button 
                        onClick={() => setNotifFilter('unread')}
                        className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
                          notifFilter === 'unread' 
                            ? 'text-primary border-primary' 
                            : 'text-on-surface-variant border-transparent hover:text-on-surface'
                        }`}
                      >
                        Unread
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${unreadCount > 0 ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'}`}>
                          {unreadCount}
                        </span>
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-surface-container-low/50">
                      {filteredNotifications.length === 0 ? (
                        <div className="py-10 text-center px-4">
                          <div className="w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant mx-auto flex items-center justify-center mb-2">
                            <span className="material-symbols-outlined text-[24px]">notifications_off</span>
                          </div>
                          <p className="text-sm font-semibold text-on-surface">All caught up!</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">No pending clinical alerts or unread messages.</p>
                        </div>
                      ) : (
                        filteredNotifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => markItemAsRead(notif.id)}
                            className={`p-3.5 hover:bg-surface-container-low/40 transition-colors cursor-pointer flex gap-3 relative group ${
                              notif.unread ? 'bg-primary/5' : ''
                            }`}
                          >
                            {/* Icon badge */}
                            <div className={`w-9 h-9 rounded-xl ${notif.bgClass} ${notif.textClass} border ${notif.borderClass} flex items-center justify-center shrink-0`}>
                              <span className="material-symbols-outlined text-[18px]">{notif.icon}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-on-surface truncate">{notif.title}</span>
                                <span className="text-[10px] text-on-surface-variant shrink-0">{notif.time}</span>
                              </div>
                              <p className="text-xs text-on-surface-variant mt-1 leading-snug line-clamp-2">{notif.desc}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-semibold px-2 py-0.5 bg-surface-container-high rounded text-on-surface-variant">
                                  {notif.category}
                                </span>
                                {notif.unread && (
                                  <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                    New
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Dismiss button */}
                            <button
                              onClick={(e) => dismissNotification(notif.id, e)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-all absolute top-2 right-2"
                              title="Dismiss"
                            >
                              <span className="material-symbols-outlined text-[15px]">close</span>
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-3 border-t border-surface-container-low bg-surface-container-low/20 flex items-center justify-between px-4">
                      <button 
                        onClick={clearAllNotifications}
                        className="text-xs font-semibold text-on-surface-variant hover:text-error transition-colors"
                      >
                        Clear All
                      </button>
                      <button 
                        onClick={() => {
                          setNotificationsOpen(false);
                          navigate('/dashboard/settings');
                        }}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">tune</span>
                        Alert Preferences
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Doctor Profile Menu with Doctor Name & Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-3 p-1.5 pl-2 pr-3.5 rounded-full hover:bg-surface-container-high transition-all cursor-pointer border border-surface-container-high/70 bg-surface-container-lowest shadow-xs"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary/10 text-primary ring-2 ring-primary/20 flex items-center justify-center shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80" 
                    alt="Dr. Sarah Sharma" 
                    className="w-full h-full object-cover" 
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                </div>
                
                {/* Doctor Name & Specialty */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-on-surface leading-tight flex items-center gap-1">
                    Dr. Sarah Sharma, DDS
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium">Chief Dental Surgeon</span>
                </div>
                
                <span className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 ${profileOpen ? 'rotate-180 text-primary' : ''}`}>
                  expand_more
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-13 right-0 w-80 bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container-high/80 overflow-hidden z-50 ring-1 ring-black/5"
                  >
                    {/* Header Info Card */}
                    <div className="p-4 bg-gradient-to-br from-primary/5 via-surface-container-lowest to-surface-container-low border-b border-surface-container-low">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30 shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80" 
                            alt="Dr. Sarah Sharma" 
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-on-surface truncate">Dr. Sarah Sharma, DDS</h4>
                          <p className="text-xs text-on-surface-variant truncate">dr.sharma@dentalcarepro.com</p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              Chief Medical Officer
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-2.5 border-t border-surface-container-high/60 flex items-center justify-between text-[11px] text-on-surface-variant">
                        <span className="flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[14px] text-primary">clinical_notes</span>
                          NPI: 1295847392
                        </span>
                        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Operatory 01
                        </span>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2 space-y-1">
                      {/* Settings */}
                      <button 
                        onClick={() => {
                          navigate('/dashboard/settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[18px]">settings</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-on-surface">Practice Settings</div>
                          <div className="text-[10px] text-on-surface-variant truncate">HIPAA, equipment, analytics & clinic parameters</div>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">
                          chevron_right
                        </span>
                      </button>

                      {/* Doctor Profile & Credentials */}
                      <button 
                        onClick={() => {
                          navigate('/dashboard/settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[18px]">badge</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-on-surface">Doctor Credentials</div>
                          <div className="text-[10px] text-on-surface-variant truncate">Licensing, active shifts & clinical bio</div>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-sky-600 transition-colors">
                          chevron_right
                        </span>
                      </button>

                      {/* Security & HIPAA */}
                      <button 
                        onClick={() => {
                          navigate('/dashboard/settings');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[18px]">security</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-on-surface">Security & HIPAA</div>
                          <div className="text-[10px] text-on-surface-variant truncate">2FA MFA, session timeouts & audit trails</div>
                        </div>
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-amber-600 transition-colors">
                          chevron_right
                        </span>
                      </button>
                    </div>

                    {/* Divider & Logout */}
                    <div className="p-2 border-t border-surface-container-low bg-surface-container-low/20">
                      <button 
                        onClick={() => {
                          navigate('/');
                          setProfileOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error-container/40 transition-colors text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center group-hover:bg-error group-hover:text-white transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-error">Log Out Session</div>
                          <div className="text-[10px] text-error/80">Lock terminal and end doctor session</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 mt-16 p-6 lg:p-10 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
