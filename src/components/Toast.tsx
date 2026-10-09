import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string | null;
  onClose?: () => void;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export default function Toast({ message, onClose, type = 'success' }: ToastProps) {
  if (typeof document === 'undefined') return null;

  const iconName = type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'check_circle';
  const iconColor = type === 'error' ? 'text-rose-400' : type === 'warning' ? 'text-amber-400' : 'text-teal-300';
  const iconBg = type === 'error' ? 'bg-rose-500/20 border-rose-500/30' : type === 'warning' ? 'bg-amber-500/20 border-amber-500/30' : 'bg-teal-500/20 border-teal-500/30';

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[99999] pointer-events-none flex flex-col items-end max-w-md w-full px-4 sm:px-0">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="pointer-events-auto w-full bg-slate-900/95 text-white px-4 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 border border-slate-700/60 ring-1 ring-black/15"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0 border shadow-xs`}>
                <span className="material-symbols-outlined text-[19px]">{iconName}</span>
              </div>
              <span className="text-xs font-semibold tracking-wide text-slate-100 truncate">
                {message}
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                title="Dismiss"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
