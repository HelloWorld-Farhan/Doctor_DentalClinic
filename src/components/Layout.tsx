import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Appointments', path: '/dashboard/appointments', icon: 'calendar_month' },
    { name: 'Patients', path: '/dashboard/patients', icon: 'group' },
    { name: 'Reviews', path: '/dashboard/reviews', icon: 'reviews' },
    { name: 'Settings', path: '/dashboard/settings', icon: 'settings' },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface flex min-h-screen overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 shadow-2xl lg:shadow-none bg-surface-container-low z-50 flex flex-col pt-10 pb-8`}
      >
        <div className="px-6 mb-8 text-headline-sm font-bold tracking-tight text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-[28px]">dentistry</span>
          <span>Dental Clinic Pro</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <button 
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
              >
                <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive ? '' : 'opacity-80'}`}>{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>
        
        <div className="px-4 mt-auto pt-6 border-t border-surface-container-high/50">
           <button 
             onClick={() => navigate('/')} 
             className="w-full flex items-center px-4 py-3 rounded-xl text-error hover:bg-error-container/50 transition-all font-medium"
           >
             <span className="material-symbols-outlined mr-3 text-[22px]">logout</span>
             Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64 w-full">
        {/* Header */}
        <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-md shadow-sm z-30 flex items-center justify-between lg:justify-end px-6 lg:px-10 border-b border-surface-container-low">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
          
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`p-2 rounded-full transition-colors relative ${notificationsOpen ? 'bg-surface-container-high text-on-surface' : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}`}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
            
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 right-12 w-80 bg-surface-container-lowest rounded-2xl shadow-xl border border-surface-container-low overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-surface-container-low flex justify-between items-center">
                    <h3 className="font-bold text-on-surface">Notifications</h3>
                    <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {[
                      { title: 'New Appointment', desc: 'Alice Ross scheduled a visit for tomorrow at 11:30 AM.', time: '5m ago', icon: 'event', color: 'primary' },
                      { title: 'Review Pending', desc: 'Patient #40921 root canal requires chart summary.', time: '1h ago', icon: 'rate_review', color: 'tertiary' },
                      { title: 'Equipment Alert', desc: 'Laser Scaler Unit is due for scheduled maintenance.', time: '2h ago', icon: 'warning', color: 'amber-600' }
                    ].map((notif, i) => (
                      <div key={i} className="p-4 border-b border-surface-container-low/50 hover:bg-surface-container-low/30 transition-colors cursor-pointer flex gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${notif.color}/10 text-${notif.color} flex items-center justify-center shrink-0`}>
                          <span className="material-symbols-outlined text-[16px]">{notif.icon}</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-on-surface">{notif.title}</div>
                          <div className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{notif.desc}</div>
                          <div className="text-[10px] text-outline mt-1 font-medium">{notif.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-surface-container-low bg-surface-container-low/20 hover:bg-surface-container-low/50 transition-colors cursor-pointer">
                    <span className="text-sm font-semibold text-primary">View all notifications</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90 transition-opacity ml-2">
              <span className="material-symbols-outlined text-[20px]">person</span>
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
