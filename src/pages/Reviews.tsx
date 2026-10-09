import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export interface ReviewItem {
  id: number;
  name: string;
  initials: string;
  proc: string;
  procColor: string;
  avatarBg: string;
  avatarText: string;
  stars: number;
  time: string;
  timestamp: number;
  text: string;
  completed: string;
  hasReply: boolean;
  replyText?: string;
  replyDate?: string;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  { 
    id: 1, 
    name: "Ananya Verma", 
    initials: "AV", 
    avatarBg: "bg-secondary-fixed",
    avatarText: "text-on-secondary-fixed",
    proc: "Root Canal", 
    procColor: "bg-primary-fixed text-on-primary-fixed", 
    stars: 5, 
    time: "2 hours ago", 
    timestamp: 1698150000000,
    text: "I was terrified of getting a root canal, but Dr. Sharma and the entire team were exceptionally gentle. They explained every step of the procedure and checked in on my comfort constantly. Felt absolutely zero pain! Highly recommended.", 
    completed: "Oct 24, 2023",
    hasReply: false 
  },
  { 
    id: 2, 
    name: "James Mitchell", 
    initials: "JM", 
    avatarBg: "bg-tertiary-fixed",
    avatarText: "text-on-tertiary-fixed",
    proc: "Teeth Whitening", 
    procColor: "bg-secondary-fixed text-on-secondary-fixed", 
    stars: 5, 
    time: "Yesterday", 
    timestamp: 1698063600000,
    text: "Amazing results with the laser teeth whitening session! My teeth are significantly brighter without any sensitivity issues afterward. The clinic is pristine and modern.", 
    completed: "Oct 23, 2023",
    hasReply: false
  },
  { 
    id: 3, 
    name: "Sarah Robinson", 
    initials: "SR", 
    avatarBg: "bg-surface-container-high",
    avatarText: "text-on-surface-variant",
    proc: "Routine Checkup", 
    procColor: "bg-tertiary-fixed text-on-tertiary-fixed", 
    stars: 4, 
    time: "3 days ago", 
    timestamp: 1697890800000,
    text: "Very thorough cleaning and friendly hygienist. Only giving 4 stars because there was about a 20-minute delay past my scheduled appointment time before I was called in. Otherwise, great care as always.", 
    completed: "Oct 20, 2023",
    hasReply: true,
    replyText: "Hello Sarah, thank you for your feedback! We apologize for the wait time during your visit and are actively working on our scheduling flow to ensure better punctuality next time.",
    replyDate: "Oct 21, 2023"
  },
  { 
    id: 4, 
    name: "David Chen", 
    initials: "DC", 
    avatarBg: "bg-primary-fixed",
    avatarText: "text-on-primary-fixed",
    proc: "Dental Implants", 
    procColor: "bg-primary-fixed text-on-primary-fixed", 
    stars: 5, 
    time: "5 days ago", 
    timestamp: 1697718000000,
    text: "Dr. Sharma performed a complete titanium implant surgery for my lower molar. The 3D scan planning beforehand gave me complete confidence. Healing has been seamless with no swelling.", 
    completed: "Oct 18, 2023",
    hasReply: true,
    replyText: "Thank you David! Your jaw bone integration looks fantastic on the post-op scan. Looking forward to fitting your permanent zirconia crown next month.",
    replyDate: "Oct 19, 2023"
  },
  { 
    id: 5, 
    name: "Elena Rostova", 
    initials: "ER", 
    avatarBg: "bg-secondary-fixed",
    avatarText: "text-on-secondary-fixed",
    proc: "Invisalign Aligners", 
    procColor: "bg-secondary-fixed text-on-secondary-fixed", 
    stars: 5, 
    time: "1 week ago", 
    timestamp: 1697545200000,
    text: "Six months into my Invisalign treatment and the alignment results are already staggering. The digital monitoring app makes check-ins effortless between clinic visits.", 
    completed: "Oct 16, 2023",
    hasReply: false 
  },
  { 
    id: 6, 
    name: "Michael Brown", 
    initials: "MB", 
    avatarBg: "bg-surface-container-high",
    avatarText: "text-on-surface-variant",
    proc: "Wisdom Tooth Extraction", 
    procColor: "bg-tertiary-fixed text-on-tertiary-fixed", 
    stars: 4, 
    time: "10 days ago", 
    timestamp: 1697286000000,
    text: "Extracted two impacted wisdom teeth under local anesthesia. Virtually zero pain during the procedure itself. Recovery was smooth with the prescribed post-care kit. Friendly front desk.", 
    completed: "Oct 14, 2023",
    hasReply: false 
  },
  { 
    id: 7, 
    name: "Priya Patel", 
    initials: "PP", 
    avatarBg: "bg-tertiary-fixed",
    avatarText: "text-on-tertiary-fixed",
    proc: "Porcelain Veneers", 
    procColor: "bg-primary-fixed text-on-primary-fixed", 
    stars: 5, 
    time: "2 weeks ago", 
    timestamp: 1696940400000,
    text: "Completed my 6-unit upper veneer makeover! The color matching and natural translucency are masterpiece level. Dr. Sharma's aesthetic eye is unmatched.", 
    completed: "Oct 10, 2023",
    hasReply: true,
    replyText: "Priya, thank you for the glowing words! Your smile transformation looks breathtaking and completely natural. Enjoy every moment showing it off!",
    replyDate: "Oct 11, 2023"
  },
  { 
    id: 8, 
    name: "Robert Garcia", 
    initials: "RG", 
    avatarBg: "bg-surface-container-high",
    avatarText: "text-on-surface-variant",
    proc: "Deep Periodontal Scaling", 
    procColor: "bg-tertiary-fixed text-on-tertiary-fixed", 
    stars: 4, 
    time: "3 weeks ago", 
    timestamp: 1696335600000,
    text: "Professional periodontal deep cleaning session. The ultrasonic scaler made a massive difference to my gum pockets. Took a bit longer than expected, but quality was top notch.", 
    completed: "Oct 03, 2023",
    hasReply: false 
  },
  { 
    id: 9, 
    name: "Jessica Taylor", 
    initials: "JT", 
    avatarBg: "bg-secondary-fixed",
    avatarText: "text-on-secondary-fixed",
    proc: "Pediatric Dental Care", 
    procColor: "bg-secondary-fixed text-on-secondary-fixed", 
    stars: 5, 
    time: "1 month ago", 
    timestamp: 1695558000000,
    text: "Brought my 7-year-old son for his first cavity fillings. Dr. Sharma used child-friendly explanations and was so patient that my son didn't shed a single tear! Outstanding pediatric bedside manner.", 
    completed: "Sep 24, 2023",
    hasReply: true,
    replyText: "Thank you Jessica! Your son was such a brave dental champion today. Give him a high five from the whole Dental Clinic Pro team!",
    replyDate: "Sep 25, 2023"
  },
  { 
    id: 10, 
    name: "Amitabh Roy", 
    initials: "AR", 
    avatarBg: "bg-surface-container-high",
    avatarText: "text-on-surface-variant",
    proc: "Ceramic Crown Fitting", 
    procColor: "bg-primary-fixed text-on-primary-fixed", 
    stars: 4, 
    time: "1 month ago", 
    timestamp: 1695212400000,
    text: "Replaced an old fractured metal crown with a high-translucency ceramic one. Bite feels natural and fit was exact on the first try. Only minor issue was the 15-minute lobby delay.", 
    completed: "Sep 20, 2023",
    hasReply: false 
  },
  { 
    id: 11, 
    name: "Sophia Williams", 
    initials: "SW", 
    avatarBg: "bg-primary-fixed",
    avatarText: "text-on-primary-fixed",
    proc: "Emergency Care", 
    procColor: "bg-secondary-fixed text-on-secondary-fixed", 
    stars: 5, 
    time: "1 month ago", 
    timestamp: 1694866800000,
    text: "Chipped my front incisor on a Sunday evening. Dr. Sharma accommodated me in their emergency slot first thing Monday morning. Composite bonding repair is completely invisible!", 
    completed: "Sep 16, 2023",
    hasReply: true,
    replyText: "Thank you Sophia! We always reserve priority time for acute dental traumas. Glad we could restore your incisor so seamlessly.",
    replyDate: "Sep 17, 2023"
  },
  { 
    id: 12, 
    name: "Marcus Vance", 
    initials: "MV", 
    avatarBg: "bg-tertiary-fixed",
    avatarText: "text-on-tertiary-fixed",
    proc: "Laser Teeth Whitening", 
    procColor: "bg-secondary-fixed text-on-secondary-fixed", 
    stars: 5, 
    time: "2 months ago", 
    timestamp: 1692274800000,
    text: "Top-tier whitening experience before my wedding. The clinic provided custom desensitizing trays to take home. Five stars all around!", 
    completed: "Aug 17, 2023",
    hasReply: false 
  }
];

const QUICK_TEMPLATES = [
  {
    title: "Warm Gratitude",
    text: "Thank you so much for your kind words! Our clinical team strives to provide gentle, comfortable care, and we are thrilled you had such a positive experience."
  },
  {
    title: "Wait Time Apology",
    text: "Thank you for your valuable feedback! We sincerely apologize for the delay during your visit and are actively refining our scheduling flow to ensure optimal punctuality."
  },
  {
    title: "Post-Procedure Check-in",
    text: "Thank you for trusting us with your dental health! Please reach out to our clinic anytime if you experience any post-treatment sensitivity or need further guidance."
  },
  {
    title: "Gentle Care Acknowledgment",
    text: "We appreciate your kind review! Making dental visits stress-free and pain-free is our top priority. We look forward to seeing you at your next regular checkup!"
  }
];

const HISTOGRAM_MONTHS = [
  { month: "May", height: "60%", count: 42, avg: "4.82", nps: "96%", active: false },
  { month: "Jun", height: "75%", count: 58, avg: "4.86", nps: "97%", active: false },
  { month: "Jul", height: "70%", count: 52, avg: "4.79", nps: "95%", active: false },
  { month: "Aug", height: "85%", count: 71, avg: "4.91", nps: "98%", active: false },
  { month: "Sep", height: "90%", count: 84, avg: "4.94", nps: "98%", active: false },
  { month: "Oct", height: "100%", count: 98, avg: "4.98", nps: "99%", active: true }
];

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<'all' | '5' | '4' | 'needs_reply'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Selected review for Reply Popup Modal
  const [replyingReview, setReplyingReview] = useState<ReviewItem | null>(null);
  const [replyInputText, setReplyInputText] = useState("");
  const [notifyPatient, setNotifyPatient] = useState(true);

  // Export Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv' | 'powerbi'>('pdf');
  const [exportDateRange, setExportDateRange] = useState('Current Quarter (Q3-Q4)');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStepText, setExportStepText] = useState("");
  const [exportCompleted, setExportCompleted] = useState(false);

  // Histogram Hover State
  const [hoveredMonth, setHoveredMonth] = useState<typeof HISTOGRAM_MONTHS[0] | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("Oct");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Real Counts for Filter Pills
  const counts = useMemo(() => {
    return {
      all: reviews.length,
      five: reviews.filter(r => r.stars === 5).length,
      four: reviews.filter(r => r.stars === 4).length,
      needsReply: reviews.filter(r => !r.hasReply).length
    };
  }, [reviews]);

  // Filtered & Sorted Reviews
  const processedReviews = useMemo(() => {
    let result = reviews.filter(item => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = query === "" || 
        item.name.toLowerCase().includes(query) ||
        item.proc.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Category Filter
      if (selectedFilter === '5') return item.stars === 5;
      if (selectedFilter === '4') return item.stars === 4;
      if (selectedFilter === 'needs_reply') return !item.hasReply;
      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'highest') {
        if (b.stars !== a.stars) return b.stars - a.stars;
        return b.timestamp - a.timestamp;
      }
      if (sortBy === 'lowest') {
        if (a.stars !== b.stars) return a.stars - b.stars;
        return b.timestamp - a.timestamp;
      }
      // 'recent'
      return b.timestamp - a.timestamp;
    });

    return result;
  }, [reviews, searchQuery, selectedFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(processedReviews.length / itemsPerPage));
  
  // Safe current page adjustment if filter reduces total pages
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedReviews = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    return processedReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [processedReviews, validCurrentPage, itemsPerPage]);

  const handleFilterChange = (filter: 'all' | '5' | '4' | 'needs_reply') => {
    setSelectedFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reply Modal Open
  const openReplyModal = (review: ReviewItem) => {
    setReplyingReview(review);
    setReplyInputText(review.hasReply && review.replyText ? review.replyText : "");
  };

  // Reply Modal Submit
  const handleSaveReply = () => {
    if (!replyingReview) return;
    if (!replyInputText.trim()) return;

    setReviews(prev => prev.map(r => {
      if (r.id === replyingReview.id) {
        return {
          ...r,
          hasReply: true,
          replyText: replyInputText.trim(),
          replyDate: "Just now"
        };
      }
      return r;
    }));

    showToast(`Response successfully published for ${replyingReview.name}!`);
    setReplyingReview(null);
  };

  // Export Progress Simulation
  const handleStartExport = () => {
    setIsExporting(true);
    setExportProgress(10);
    setExportStepText("Connecting to Power BI Analytics Warehouse...");
    setExportCompleted(false);

    setTimeout(() => {
      setExportProgress(38);
      setExportStepText("Aggregating 342 verified reviews & sentiment scores...");
    }, 700);

    setTimeout(() => {
      setExportProgress(72);
      setExportStepText(`Formatting ${exportFormat.toUpperCase()} report & doctor audit trails...`);
    }, 1500);

    setTimeout(() => {
      setExportProgress(100);
      setExportStepText("Report compilation complete! Downloading file...");
      setExportCompleted(true);
      setIsExporting(false);

      // Trigger actual CSV / File download
      const headers = "Review ID,Patient Name,Procedure,Rating,Date,Status,Doctor Reply\n";
      const rows = reviews.map(r => 
        `"${r.id}","${r.name}","${r.proc}","${r.stars} Stars","${r.completed}","${r.hasReply ? 'Replied' : 'Pending'}","${(r.replyText || '').replace(/"/g, '""')}"`
      ).join("\n");
      const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Dental_Clinic_Reviews_PowerBI_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported Power BI report generated successfully!`);
    }, 2400);
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
            className="fixed top-20 right-8 z-50 bg-primary text-on-primary px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-primary-container"
          >
            <span className="material-symbols-outlined text-[20px] text-emerald-300">check_circle</span>
            <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Patient Relations & Power BI Analytics</span>
          <h1 className="text-3xl font-bold text-on-surface mt-1 tracking-tight">Doctor Reviews & Advanced Feedback</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[20px] text-outline">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 bg-surface-container-low rounded-xl text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-64 transition-all" 
              placeholder="Search reviews..." 
              type="text"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setIsExportModalOpen(true);
              setExportCompleted(false);
              setExportProgress(0);
              setIsExporting(false);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl text-sm font-medium shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Reports</span>
          </motion.button>
        </div>
      </div>

      {/* Power BI Style Analytics Grid Header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overall Rating Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border-t-4 border-primary">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-outline">Overall Rating</span>
              <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-on-surface">4.9</span>
              <div className="flex text-amber-400">
                {Array.from({length: 5}).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-outline mt-1">Based on 342 verified patient reviews</p>
          </div>
          <div className="space-y-1.5 mt-4 pt-3 border-t border-surface-container-low">
            {[
              { star: "5★", pct: "88%", count: "301" },
              { star: "4★", pct: "9%", count: "31" },
              { star: "3★", pct: "2%", count: "8" }
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-10 text-on-surface">{row.star}</span>
                <div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: row.pct }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="bg-primary h-full rounded-full"
                  ></motion.div>
                </div>
                <span className="w-8 text-right text-outline">{row.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis Breakdown */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border-t-4 border-tertiary">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-outline">Sentiment Analysis</span>
              <span className="material-symbols-outlined text-tertiary text-[20px]">psychology</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-on-surface">94.2%</span>
              <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+2.4% this mo</span>
            </div>
            <p className="text-xs text-outline mt-1">Natural Language Processing on 342 reviews</p>
          </div>
          <div className="space-y-2 mt-4">
            {[
              { label: "Positive", desc: "89% (304)", pct: "89%", color: "bg-emerald-500" },
              { label: "Neutral", desc: "8% (28)", pct: "8%", color: "bg-amber-400" },
              { label: "Critical", desc: "3% (10)", pct: "3%", color: "bg-error" }
            ].map((row, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-on-surface">{row.label}</span>
                  <span className="text-outline">{row.desc}</span>
                </div>
                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: row.pct }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    className={`${row.color} h-full rounded-full`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wait Time Visual KPI Gauge */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border-t-4 border-secondary">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-outline">Wait Time Punctuality</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">schedule</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-on-surface">4.8</span>
              <span className="text-[10px] font-medium text-primary bg-primary-fixed px-1.5 py-0.5 rounded">Target: &gt; 4.5</span>
            </div>
            <p className="text-xs text-outline mt-1">Average patient punctuality score</p>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container-low">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-outline">On-time adherence</span>
              <span className="font-semibold text-on-surface">92.5%</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-3 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "92.5%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-secondary h-2 rounded-full"
              ></motion.div>
            </div>
            <div className="flex justify-between text-[10px] text-outline mt-1">
              <span>0m delay</span>
              <span>&lt; 10m avg</span>
              <span>30m+</span>
            </div>
          </div>
        </div>

        {/* Pain Management Visual KPI Gauge */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col justify-between border-t-4 border-tertiary-container">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-outline">Pain Management</span>
              <span className="material-symbols-outlined text-tertiary-container text-[20px]">medical_services</span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-bold text-on-surface">4.9</span>
              <span className="text-[10px] font-medium text-teal-700 bg-tertiary-fixed px-1.5 py-0.5 rounded">Gentle Care</span>
            </div>
            <p className="text-xs text-outline mt-1">Painless procedure ratings</p>
          </div>
          <div className="mt-4 pt-3 border-t border-surface-container-low">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-outline">Comfort Score</span>
              <span className="font-semibold text-on-surface">98.1%</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-3 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "98.1%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-tertiary-container h-2 rounded-full"
              ></motion.div>
            </div>
            <div className="flex justify-between text-[10px] text-outline mt-1">
              <span>Uncomfortable</span>
              <span>Standard</span>
              <span>Painless</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary analytics banner: Recommendation Rate & Histogram Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[32px]">recommend</span>
            </div>
            <div>
              <span className="text-xs font-semibold text-outline uppercase tracking-wider">Net Recommendation Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-on-surface">98%</span>
                <span className="text-xs text-emerald-600 font-semibold">High Promoter</span>
              </div>
              <p className="text-xs text-outline">Would recommend to friends & family</p>
            </div>
          </div>
        </div>

        {/* Animated Power BI Interactive Histogram */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-center relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-outline">Monthly Trend & Rating Distribution Histogram (Power BI Matrix)</span>
              {hoveredMonth && (
                <span className="text-xs text-primary font-bold px-2 py-0.5 bg-primary-fixed/50 rounded-full animate-fadeIn">
                  {hoveredMonth.month}: {hoveredMonth.count} reviews • {hoveredMonth.avg}★ • {hoveredMonth.nps} NPS
                </span>
              )}
            </div>
            <span className="text-xs text-primary font-semibold">Q3-Q4 View</span>
          </div>

          <div className="grid grid-cols-6 gap-3 items-end h-20 pt-2 relative">
            {HISTOGRAM_MONTHS.map((bar, i) => {
              const isSelected = selectedMonth === bar.month;
              return (
                <div 
                  key={i} 
                  onMouseEnter={() => setHoveredMonth(bar)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  onClick={() => setSelectedMonth(bar.month)}
                  className="bg-surface-container-low rounded-t-lg flex flex-col justify-end items-center h-full pb-1 cursor-pointer transition-all hover:bg-surface-container-high group relative"
                >
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: bar.height }}
                    transition={{ duration: 0.8, delay: i * 0.1, type: "spring", damping: 14 }}
                    className={`w-full rounded-t-lg transition-colors ${isSelected ? 'bg-primary-container shadow-md' : 'bg-primary group-hover:bg-primary-container'}`}
                  ></motion.div>
                  <span className={`text-[11px] mt-1 transition-all ${isSelected ? 'text-primary font-bold' : 'text-outline group-hover:text-on-surface'}`}>
                    {bar.month}
                  </span>

                  {/* Micro Tooltip */}
                  <div className="absolute -top-8 bg-on-surface text-surface text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-md">
                    {bar.count} reviews ({bar.avg}★)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Sort Section */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedFilter === 'all' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span>All Reviews</span>
            <span className={`text-xs px-1.5 py-0.2 rounded-full ${selectedFilter === 'all' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
              {counts.all}
            </span>
          </button>
          
          <button 
            onClick={() => handleFilterChange('5')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedFilter === '5' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <div className="flex items-center text-amber-400">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <span>5 Stars</span>
            <span className={`text-xs px-1.5 py-0.2 rounded-full ${selectedFilter === '5' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
              {counts.five}
            </span>
          </button>

          <button 
            onClick={() => handleFilterChange('4')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedFilter === '4' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <div className="flex items-center text-amber-400">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
            <span>4 Stars</span>
            <span className={`text-xs px-1.5 py-0.2 rounded-full ${selectedFilter === '4' ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-on-surface-variant'}`}>
              {counts.four}
            </span>
          </button>

          <button 
            onClick={() => handleFilterChange('needs_reply')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${selectedFilter === 'needs_reply' ? 'bg-primary text-on-primary shadow-sm font-semibold' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-[16px]">mark_chat_unread</span>
            <span>Needs Reply</span>
            <span className={`text-xs px-1.5 py-0.2 rounded-full ${selectedFilter === 'needs_reply' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'}`}>
              {counts.needsReply}
            </span>
          </button>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-outline">Sort by:</span>
          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'recent' | 'highest' | 'lowest');
                setCurrentPage(1);
              }}
              className="bg-surface-container-low text-on-surface text-sm py-2 px-3 pr-8 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer appearance-none font-medium"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4 min-h-[380px]">
        {paginatedReviews.length === 0 ? (
          <div className="bg-surface-container-lowest p-12 rounded-2xl text-center border border-surface-container-low">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">find_in_page</span>
            <h3 className="text-lg font-bold text-on-surface">No reviews found</h3>
            <p className="text-sm text-outline mt-1">Try adjusting your search criteria or active filters.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedFilter('all'); }} 
              className="mt-4 px-4 py-2 bg-surface-container-low hover:bg-surface-container-high text-primary rounded-xl text-sm font-semibold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${selectedFilter}-${sortBy}-${validCurrentPage}-${searchQuery}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {paginatedReviews.map((review) => (
                <motion.div 
                  layout
                  key={review.id} 
                  className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col gap-4 border border-surface-container-low hover:border-surface-container-high transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full ${review.avatarBg} ${review.avatarText} font-bold flex items-center justify-center shrink-0 shadow-sm`}>
                        <span>{review.initials}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-on-surface">{review.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${review.procColor}`}>
                            {review.proc}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex text-amber-400">
                            {Array.from({length: 5}).map((_, j) => (
                              <span 
                                key={j} 
                                className="material-symbols-outlined text-[16px]" 
                                style={{ fontVariationSettings: j < review.stars ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-outline">• {review.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!review.hasReply && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          Pending Doctor Reply
                        </span>
                      )}
                      <span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-lg text-xs font-medium shrink-0">
                        Verified Patient
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-on-surface leading-relaxed">
                    {review.text}
                  </p>

                  {/* Doctor Response Card Bubble */}
                  {review.hasReply && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-surface-container-low p-4 rounded-xl flex flex-col gap-1 ml-6 md:ml-12 relative border border-surface-container-high/60"
                    >
                      <div className="absolute -left-2.5 top-4 w-3 h-3 bg-surface-container-low rotate-45 border-l border-b border-surface-container-high/60"></div>
                      <div className="flex items-center justify-between text-xs font-bold text-primary">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">medical_services</span>
                          <span>Dr. Sharma responded:</span>
                        </div>
                        {review.replyDate && (
                          <span className="text-outline font-normal text-[11px]">{review.replyDate}</span>
                        )}
                      </div>
                      <p className="text-sm text-on-surface mt-1 leading-relaxed">{review.replyText}</p>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-surface-container-low">
                    <div className="flex items-center gap-1.5 text-xs text-outline">
                      <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
                      <span>Treatment completed on {review.completed}</span>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openReplyModal(review)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary rounded-xl text-xs font-medium transition-all shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">{review.hasReply ? 'edit' : 'reply'}</span>
                      <span>{review.hasReply ? 'Edit Reply' : 'Reply to Patient'}</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Pagination Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 pb-8">
        <span className="text-xs text-outline">
          Showing {processedReviews.length === 0 ? 0 : (validCurrentPage - 1) * itemsPerPage + 1}-
          {Math.min(validCurrentPage * itemsPerPage, processedReviews.length)} of {processedReviews.length} reviews
          {selectedFilter !== 'all' && ` (filtered from ${reviews.length})`}
        </span>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => handlePageChange(validCurrentPage - 1)}
            disabled={validCurrentPage === 1}
            className="px-3.5 py-1.5 bg-surface-container-low text-on-surface rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            <span>Previous</span>
          </button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
            <button 
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                validCurrentPage === pageNum 
                  ? 'bg-primary text-on-primary shadow-sm scale-105' 
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button 
            onClick={() => handlePageChange(validCurrentPage + 1)}
            disabled={validCurrentPage === totalPages || totalPages === 0}
            className="px-3.5 py-1.5 bg-surface-container-low text-on-surface rounded-xl text-sm font-medium hover:bg-surface-container-high transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>Next</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. REPLY TO PATIENT POPUP MODAL (Portaled to document.body) */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {replyingReview && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setReplyingReview(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Modal Body */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-container-low overflow-hidden z-10 flex flex-col max-h-[90vh] my-auto"
              >
                {/* Modal Header */}
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[26px]">rate_review</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">
                        {replyingReview.hasReply ? 'Edit Doctor Response' : 'Reply to Patient Review'}
                      </h2>
                      <p className="text-xs text-outline">
                        Public response published on Google Reviews & Patient Portal
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setReplyingReview(null)}
                    className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto space-y-5">
                  {/* Patient Summary Card */}
                  <div className="p-4 bg-surface-container-low rounded-2xl border border-surface-container-high/60 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${replyingReview.avatarBg} ${replyingReview.avatarText} font-bold flex items-center justify-center text-sm shadow-sm`}>
                          {replyingReview.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-on-surface text-sm">{replyingReview.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${replyingReview.procColor}`}>
                              {replyingReview.proc}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="flex text-amber-400">
                              {Array.from({length: 5}).map((_, j) => (
                                <span 
                                  key={j} 
                                  className="material-symbols-outlined text-[14px]" 
                                  style={{ fontVariationSettings: j < replyingReview.stars ? "'FILL' 1" : "'FILL' 0" }}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <span className="text-[11px] text-outline">• {replyingReview.time}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-outline bg-surface-container-lowest px-2 py-1 rounded-md">
                        Completed: {replyingReview.completed}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant italic pl-2 border-l-2 border-primary/40 leading-relaxed pt-1">
                      "{replyingReview.text}"
                    </p>
                  </div>

                  {/* Quick Response Templates */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                        Quick Clinical Response Templates
                      </span>
                      <span className="text-[11px] text-outline">Click to insert</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {QUICK_TEMPLATES.map((tmpl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setReplyInputText(tmpl.text)}
                          className="text-left p-2.5 bg-surface-container-low hover:bg-surface-container-high rounded-xl text-xs text-on-surface transition-all border border-transparent hover:border-primary/30 flex flex-col gap-0.5 group"
                        >
                          <span className="font-bold text-primary group-hover:underline flex items-center justify-between">
                            {tmpl.title}
                            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
                          </span>
                          <span className="text-[11px] text-outline line-clamp-1">{tmpl.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Doctor Response Textarea */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-semibold text-on-surface flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-primary">edit_note</span>
                        Doctor Response Message
                      </label>
                      <span className="text-outline text-[11px]">{replyInputText.length} characters</span>
                    </div>
                    <textarea 
                      rows={4}
                      value={replyInputText}
                      onChange={(e) => setReplyInputText(e.target.value)}
                      placeholder="Write a clear, compassionate, and professional reply from Dr. Sharma..."
                      className="w-full p-3.5 bg-surface-container-low rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none border border-surface-container-high"
                    />
                  </div>

                  {/* Notification Toggle */}
                  <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl text-xs">
                    <div className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-[18px] text-primary">notifications_active</span>
                      <span>Send push & SMS notification to {replyingReview.name}</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifyPatient} 
                      onChange={(e) => setNotifyPatient(e.target.checked)}
                      className="w-4 h-4 text-primary rounded cursor-pointer accent-primary" 
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-surface-container-low bg-surface flex justify-end gap-3">
                  <button 
                    onClick={() => setReplyingReview(null)}
                    className="px-5 py-2.5 rounded-xl font-medium text-sm text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!replyInputText.trim()}
                    onClick={handleSaveReply}
                    className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>{replyingReview.hasReply ? 'Update Official Response' : 'Publish Response'}</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ========================================================= */}
      {/* 2. EXPORT REPORTS POPUP MODAL & ANIMATION */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* 2. EXPORT REPORTS POPUP MODAL (Portaled to document.body) */}
      {/* ========================================================= */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isExportModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!isExporting) setIsExportModalOpen(false);
                }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Modal Body */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-surface-container-low overflow-hidden z-10 flex flex-col my-auto"
              >
                {/* Header */}
                <div className="p-6 border-b border-surface-container-low flex justify-between items-center bg-surface-container-lowest">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">export_notes</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-on-surface">Export Power BI Reports</h2>
                      <p className="text-xs text-outline">Download clinical sentiment & verified reviews</p>
                    </div>
                  </div>
                  {!isExporting && (
                    <button 
                      onClick={() => setIsExportModalOpen(false)}
                      className="p-2 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                  {isExporting || exportCompleted ? (
                    /* Animated Exporting State */
                    <div className="py-8 flex flex-col items-center text-center space-y-4">
                      {exportCompleted ? (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md"
                        >
                          <span className="material-symbols-outlined text-[36px]">task_alt</span>
                        </motion.div>
                      ) : (
                        <div className="relative w-16 h-16">
                          <div className="w-16 h-16 rounded-full border-4 border-surface-container-high border-t-primary animate-spin"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-[24px]">analytics</span>
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-bold text-on-surface">
                          {exportCompleted ? 'Export Complete!' : 'Generating Analytics Package'}
                        </h3>
                        <p className="text-xs text-outline mt-1 max-w-xs">{exportStepText}</p>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-surface-container-low rounded-full h-3 overflow-hidden p-0.5 border border-surface-container-high">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: `${exportProgress}%` }}
                          transition={{ duration: 0.3 }}
                          className={`h-full rounded-full transition-all ${exportCompleted ? 'bg-emerald-500' : 'bg-primary'}`}
                        ></motion.div>
                      </div>
                      <span className="text-xs font-mono font-semibold text-primary">{exportProgress}%</span>
                    </div>
                  ) : (
                    /* Export Configuration Form */
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-outline">Select Export Format</label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { id: 'pdf', title: 'PDF Executive', desc: 'Clinical summary with graphs', icon: 'picture_as_pdf', color: 'text-error' },
                            { id: 'excel', title: 'Excel Matrix', desc: '.xlsx data sheets & metrics', icon: 'table_view', color: 'text-emerald-600' },
                            { id: 'csv', title: 'CSV Raw Data', desc: 'Direct patient review logs', icon: 'dataset', color: 'text-secondary' },
                            { id: 'powerbi', title: 'Power BI Pack', desc: '.pbix live sync template', icon: 'analytics', color: 'text-amber-500' }
                          ].map((fmt) => (
                            <div 
                              key={fmt.id}
                              onClick={() => setExportFormat(fmt.id as any)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-1 ${
                                exportFormat === fmt.id 
                                ? 'border-primary bg-primary-fixed/20 shadow-sm' 
                                : 'border-surface-container-high hover:border-outline bg-surface-container-low'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className={`material-symbols-outlined text-[20px] ${fmt.color}`}>{fmt.icon}</span>
                                {exportFormat === fmt.id && (
                                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-on-surface mt-1">{fmt.title}</span>
                              <span className="text-[10px] text-outline">{fmt.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-outline">Date Range</label>
                        <select 
                          value={exportDateRange}
                          onChange={(e) => setExportDateRange(e.target.value)}
                          className="w-full p-2.5 bg-surface-container-low rounded-xl text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary border border-surface-container-high font-medium"
                        >
                          <option>Current Quarter (Q3-Q4)</option>
                          <option>Last 30 Days</option>
                          <option>Year to Date (2023)</option>
                          <option>All-Time Archive (342 Reviews)</option>
                        </select>
                      </div>

                      <div className="p-3 bg-surface-container-low rounded-xl space-y-2 text-xs text-on-surface">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                          <span>Includes Natural Language Sentiment analysis scores</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                          <span>Includes official Doctor response timestamps & audit log</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-surface-container-low bg-surface flex justify-end gap-3">
                  {exportCompleted ? (
                    <button 
                      onClick={() => setIsExportModalOpen(false)}
                      className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-container transition-all"
                    >
                      Done
                    </button>
                  ) : (
                    <>
                      <button 
                        disabled={isExporting}
                        onClick={() => setIsExportModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl font-medium text-sm text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isExporting}
                        onClick={handleStartExport}
                        className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-container transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[18px]">file_download</span>
                        <span>Generate & Download</span>
                      </motion.button>
                    </>
                  )}
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
