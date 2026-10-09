import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'profile' | 'security' | 'notifications' | 'powerbi' | 'equipment' | 'voice';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab, icon: string, label: string }[] = [
    { id: 'profile', icon: 'local_hospital', label: 'Profile & Clinic Info' },
    { id: 'security', icon: 'security', label: 'Security & HIPAA' },
    { id: 'notifications', icon: 'notifications', label: 'Notifications' },
    { id: 'powerbi', icon: 'analytics', label: 'Power BI Analytics' },
    { id: 'equipment', icon: 'medical_services', label: 'Equipment Status' },
    { id: 'voice', icon: 'mic', label: 'Voice-to-Text Charting' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-8"
    >
      {/* Hero / Header Section */}
      <div className="pt-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-on-surface-variant mb-1">
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span className="text-xs font-semibold uppercase tracking-wider">Configuration & System Control</span>
          </div>
          <h1 className="text-3xl font-bold text-on-surface">Practice Settings & Infrastructure</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage clinical parameters, HIPAA compliance protocols, automated telemetry, and third-party integrations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm hover:bg-surface-dim transition-all flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset Defaults
          </button>
          <button className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-surface-variant/40 flex overflow-x-auto gap-6 scrollbar-none mt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 font-bold text-sm flex items-center gap-1.5 whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id 
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant border-transparent hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {/* 1. Profile & Clinic Info */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface-container-low rounded-2xl p-6 shadow-sm space-y-4 border border-surface-container-highest">
                  <h2 className="text-xl font-bold text-on-surface">Practice Identification</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Clinic Legal Name</label>
                      <input className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" type="text" defaultValue="Dental Clinic Pro Advanced Dental Studio"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Practice NPI Number</label>
                      <input className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" type="text" defaultValue="1295847392"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Primary Contact Email</label>
                      <input className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" type="email" defaultValue="admin@dentalclinicpro.net"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-1">Phone Number</label>
                      <input className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" type="text" defaultValue="+1 (555) 382-9900"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Physical Address</label>
                    <input className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:border-primary" type="text" defaultValue="742 Evergreen Terrace, Suite 400, Springfield, OR 97477"/>
                  </div>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm flex flex-col items-center text-center justify-between border border-surface-container-highest">
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <h2 className="text-xl font-bold text-on-surface w-full text-left">Clinic Logo</h2>
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary/20 shadow-sm relative">
                      <img className="w-full h-full object-cover" alt="Clinic logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClzs2qLi01u8zRP56sdKHGde1f5v8kA1yymHxyLBBL5MgYaln6q_mBLPAf_1laSNAh36wBiFZLcKOB3z-HfMwdAn7BMkr82AhTfIofnTWYa52t35hawrdE-mnBYyVIDhGqBuAhMVADjuNnI3QLg4_fIv2VdrEsGkUY4s6IPjvCjj_Wy1JoD7bCnoKpL3UxbrsWz6GDsR4ajAF-_U38bNQL-RiwpXMAxUkZV-Pn2A9WeS-sFYW36jcU"/>
                    </div>
                    <p className="text-xs text-on-surface-variant">Recommended 500x500px PNG or SVG with transparent background.</p>
                  </div>
                  <button className="w-full mt-4 py-2 bg-surface-container-high text-on-surface rounded-xl font-bold text-sm hover:bg-surface-dim transition-all">
                    Upload New Logo
                  </button>
                </div>
              </div>
            )}

            {/* 2. Security & HIPAA Compliance */}
            {activeTab === 'security' && (
              <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm space-y-4 border border-surface-container-highest">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">HIPAA Compliance & Encryption Protocols</h2>
                    <p className="text-sm text-on-surface-variant">All patient health records (PHI) are protected under 256-bit AES encryption standards.</p>
                  </div>
                  <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    Fully Compliant
                  </span>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-variant/20">
                    <div>
                      <div className="font-bold text-on-surface">Multi-Factor Authentication (MFA) Enforcement</div>
                      <div className="text-xs text-on-surface-variant">Require all clinical staff and administrators to use TOTP authenticator apps.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-variant/20">
                    <div>
                      <div className="font-bold text-on-surface">Automatic Session Timeout</div>
                      <div className="text-xs text-on-surface-variant">Automatically log out idle terminals after 15 minutes of inactivity.</div>
                    </div>
                    <select className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-sm font-bold border-0 focus:ring-1 focus:ring-primary outline-none">
                      <option>15 Minutes</option>
                      <option>30 Minutes</option>
                      <option>60 Minutes</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface rounded-xl border border-surface-variant/20">
                    <div>
                      <div className="font-bold text-on-surface">Audit Trail Logging</div>
                      <div className="text-xs text-on-surface-variant">Maintain immutable logs of every record access, modification, and export.</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Notification Preferences */}
            {activeTab === 'notifications' && (
              <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm space-y-4 border border-surface-container-highest">
                <div>
                  <h2 className="text-xl font-bold text-on-surface">Automated Patient Reminders & Alerts</h2>
                  <p className="text-sm text-on-surface-variant">Configure SMS and email communication triggers for appointments and recalls.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {[
                    { title: "SMS Appointment Reminders", desc: "Send automated SMS notifications 24 hours prior to scheduled procedures.", checked: true },
                    { title: "Email Recalls & Checkups", desc: "Trigger bi-annual cleaning and preventive care reminder emails automatically.", checked: true },
                    { title: "Emergency Booking Alerts", desc: "Instant push notification to lead dentist for urgent trauma or pain appointments.", checked: true },
                    { title: "Billing & Insurance Digest", desc: "Weekly financial and claim processing summary sent to practice managers.", checked: false }
                  ].map((setting, i) => (
                    <div key={i} className="p-4 bg-surface rounded-xl space-y-1 border border-surface-variant/20">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-on-surface">{setting.title}</span>
                        <input type="checkbox" defaultChecked={setting.checked} className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" />
                      </div>
                      <p className="text-xs text-on-surface-variant">{setting.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Power BI Analytics Integration */}
            {activeTab === 'powerbi' && (
              <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm space-y-4 border border-surface-container-highest">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">analytics</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">Power BI Embedded Workspace</h2>
                      <p className="text-sm text-on-surface-variant">Connected to Azure Tenant: <span className="font-mono text-primary font-bold">dentalcare-prod-uswest</span></p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-primary text-on-primary rounded-full text-xs font-bold">Active Sync</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Workspace ID</label>
                    <input className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-mono text-on-surface focus:outline-none focus:border-primary" type="text" defaultValue="8f4b2c1e-9a3d-4c5e-8b1a-7f6e5d4c3b2a"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Dataset Refresh Frequency</label>
                    <select className="w-full bg-surface border border-outline-variant/40 rounded-xl px-4 py-2.5 text-sm font-bold text-on-surface focus:outline-none focus:border-primary">
                      <option>Real-Time Streaming</option>
                      <option>Every 1 Hour</option>
                      <option>Every 4 Hours</option>
                      <option>Daily at Midnight</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 bg-surface rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-surface-variant/20">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[24px] text-primary">sync</span>
                    <div>
                      <div className="font-bold text-on-surface">Telemetry & Patient Flow Data Feed</div>
                      <div className="text-xs text-on-surface-variant mt-0.5">Last successful synchronization completed 4 minutes ago.</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary-container text-on-primary-container rounded-xl font-bold text-sm hover:bg-primary-container/80 transition-all shrink-0">
                    Test Connection
                  </button>
                </div>
              </div>
            )}

            {/* 5. Equipment Status Management */}
            {activeTab === 'equipment' && (
              <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm space-y-4 border border-surface-container-highest">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-bold text-on-surface">Operatory & Diagnostic Equipment Telemetry</h2>
                  <button className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add Equipment
                  </button>
                </div>
                <div className="space-y-2 pt-2">
                  {[
                    { name: "Planmeca ProMax 3D CBCT Scanner", details: "Operatory 1 • Calibration Due: Oct 2025", icon: "dentistry", status: "Operational", statusColor: "bg-primary-fixed text-on-primary-fixed", iconBg: "bg-surface-container-high text-primary" },
                    { name: "iTero Element 5D Intraoral Scanner", details: "Operatory 2 • Firmware v4.12.0", icon: "scanner", status: "Operational", statusColor: "bg-primary-fixed text-on-primary-fixed", iconBg: "bg-surface-container-high text-primary" },
                    { name: "A-dec 500 LED Dental Curing Light", details: "Operatory 3 • Bulb intensity degraded (78%)", icon: "light_mode", status: "Service Required", statusColor: "bg-error-container text-on-error-container", iconBg: "bg-error-container text-on-error-container" }
                  ].map((eq, i) => (
                    <div key={i} className="p-4 bg-surface rounded-xl flex items-center justify-between border border-surface-variant/20">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${eq.iconBg}`}>
                          <span className="material-symbols-outlined text-[20px]">{eq.icon}</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{eq.name}</div>
                          <div className="text-xs text-on-surface-variant mt-0.5">{eq.details}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${eq.statusColor}`}>{eq.status}</span>
                        <button className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">more_vert</span></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Voice-to-Text Charting Toggles */}
            {activeTab === 'voice' && (
              <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm space-y-4 border border-surface-container-highest">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">mic</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">AI Voice-to-Text Perio & Restorative Charting</h2>
                      <p className="text-sm text-on-surface-variant mt-1">Dictate periodontal depths, missing teeth, and restorations hands-free during exams.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">Auto-Advance Perio Sounding</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" />
                    </div>
                    <p className="text-xs text-on-surface-variant">Automatically jump to the next tooth/pocket number upon successful numerical speech capture.</p>
                  </div>
                  <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">Clinical Medical Vocabulary Model</span>
                      <select className="bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold border-0 outline-none">
                        <option>Dental Pro v4.2 (US English)</option>
                        <option>Dental Pro v4.2 (UK English)</option>
                      </select>
                    </div>
                    <p className="text-xs text-on-surface-variant">Optimized acoustic models trained on dental terminology and ADA code identifiers.</p>
                  </div>
                  <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">Noise Cancellation Filter</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-primary rounded focus:ring-primary accent-primary" />
                    </div>
                    <p className="text-xs text-on-surface-variant">Filter out high-frequency dental drill and suction background noise during speech recognition.</p>
                  </div>
                  <div className="p-4 bg-surface rounded-xl space-y-2 border border-surface-variant/20">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">Audio Recording Retention</span>
                      <select className="bg-surface-container-high text-on-surface px-3 py-1.5 rounded-lg text-xs font-bold border-0 outline-none">
                        <option>Discard Immediately</option>
                        <option>Retain 30 Days for Audit</option>
                      </select>
                    </div>
                    <p className="text-xs text-on-surface-variant">Compliance setting governing raw voice file storage on local secure edge servers.</p>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
