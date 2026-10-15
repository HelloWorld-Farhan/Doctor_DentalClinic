import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QuickNote } from '../pages/Dashboard';

interface QuickNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  notes: QuickNote[];
  onSaveNewNote: (text: string, tag: QuickNote['tag']) => void;
  onUpdateNote: (id: string, text: string, tag: QuickNote['tag']) => void;
  onToggleComplete: (id: string) => void;
  onDeleteNote: (id: string) => void;
  initialSelectedNoteId?: string | null;
  getTagBadgeStyle: (tag: QuickNote['tag']) => string;
  showToast: (msg: string) => void;
}

export const QuickNotesModal: React.FC<QuickNotesModalProps> = ({
  isOpen,
  onClose,
  notes,
  onSaveNewNote,
  onUpdateNote,
  onToggleComplete,
  onDeleteNote,
  initialSelectedNoteId,
  getTagBadgeStyle,
  showToast,
}) => {
  // Modal Local State
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(initialSelectedNoteId || null);
  const [isComposing, setIsComposing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Compose State
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTag, setNewNoteTag] = useState<QuickNote['tag']>('Clinical');

  // Edit State
  const [editText, setEditText] = useState('');
  const [editTag, setEditTag] = useState<QuickNote['tag']>('Clinical');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<'All' | QuickNote['tag']>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Active' | 'Completed'>('All');

  // Synchronize initial selection whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialSelectedNoteId) {
        setSelectedNoteId(initialSelectedNoteId);
      } else if (notes.length > 0) {
        setSelectedNoteId(notes[0].id);
      }
      setIsComposing(false);
      setIsEditing(false);
      setSearchQuery('');
      setFilterTag('All');
      setFilterStatus('All');
    }
  }, [isOpen, initialSelectedNoteId, notes]);

  // Derived selected note
  const currentNote = useMemo(() => {
    if (!notes.length) return null;
    if (selectedNoteId) {
      const found = notes.find((n) => n.id === selectedNoteId);
      if (found) return found;
    }
    return notes[0] || null;
  }, [notes, selectedNoteId]);

  // Synchronize edit fields when selected note changes
  useEffect(() => {
    if (currentNote) {
      setEditText(currentNote.text);
      setEditTag(currentNote.tag);
    }
  }, [currentNote]);

  // Filtered notes list
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q || n.text.toLowerCase().includes(q) || n.tag.toLowerCase().includes(q);
      const matchTag = filterTag === 'All' || n.tag === filterTag;
      const matchStatus =
        filterStatus === 'All' ||
        (filterStatus === 'Active' && !n.completed) ||
        (filterStatus === 'Completed' && n.completed);
      return matchSearch && matchTag && matchStatus;
    });
  }, [notes, searchQuery, filterTag, filterStatus]);

  // Actions
  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) {
      showToast('Please type your note text first.');
      return;
    }
    onSaveNewNote(newNoteText.trim(), newNoteTag);
    setNewNoteText('');
    setIsComposing(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNote || !editText.trim()) {
      showToast('Note content cannot be empty.');
      return;
    }
    onUpdateNote(currentNote.id, editText.trim(), editTag);
    setIsEditing(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Note copied to clipboard!');
  };

  const handleDelete = (id: string) => {
    onDeleteNote(id);
    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remaining[0]?.id || null);
    }
    setIsEditing(false);
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

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative bg-surface-container-lowest w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl border border-surface-container-high overflow-hidden flex flex-col z-10 my-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-surface-container-low flex justify-between items-center bg-gradient-to-r from-surface-container-low/60 via-surface-container-lowest to-surface-container-low/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[22px]">edit_note</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-on-surface">
                      Clinical Quick Notes Hub
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {notes.filter((n) => !n.completed).length} Active • {notes.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Chairside clinical reminders, lab follow-ups &amp; prescription scratchpad
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsComposing(true);
                    setIsEditing(false);
                    setNewNoteText('');
                    setNewNoteTag('Clinical');
                  }}
                  className="px-3.5 py-1.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span className="hidden sm:inline">New Note</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-outline hover:text-on-surface hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Close modal"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Modal Two-Column Master-Detail Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-[460px] max-h-[calc(92vh-80px)] overflow-hidden">
              {/* LEFT PANE: Notes List & Filter controls */}
              <div className="md:col-span-5 border-r border-surface-container-high/70 flex flex-col bg-surface-container-lowest/70 overflow-hidden">
                {/* Search & Tag Bar */}
                <div className="p-3.5 border-b border-surface-container-low/80 space-y-2.5 shrink-0 bg-surface-container-lowest">
                  {/* Search Input */}
                  <div className="relative">
                    <span className="material-symbols-outlined text-outline absolute left-3 top-1/2 -translate-y-1/2 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search note text or tag..."
                      className="w-full pl-9 pr-8 py-2 bg-surface-container-low/80 rounded-xl text-xs text-on-surface border border-surface-container-high focus:border-primary focus:outline-none transition-all placeholder:text-outline"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
                    {(['All', 'Clinical', 'Rx', 'Lab', 'Urgent', 'Follow-up'] as const).map(
                      (tag) => {
                        const count =
                          tag === 'All'
                            ? notes.length
                            : notes.filter((n) => n.tag === tag).length;
                        const isSelected = filterTag === tag;
                        return (
                          <button
                            key={tag}
                            onClick={() => setFilterTag(tag)}
                            className={`px-2 py-0.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? 'bg-primary text-on-primary shadow-xs'
                                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            <span>{tag}</span>
                            <span
                              className={`text-[9px] px-1 rounded-full ${
                                isSelected
                                  ? 'bg-white/25 text-white'
                                  : 'bg-surface-container-high text-outline'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Status Toggle & Count */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-1 bg-surface-container-high p-0.5 rounded-lg text-[11px] font-semibold">
                      {(['All', 'Active', 'Completed'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                            filterStatus === status
                              ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-outline font-medium">
                      {filteredNotes.length} notes found
                    </span>
                  </div>
                </div>

                {/* Scrollable Note Items */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {filteredNotes.length === 0 ? (
                    <div className="py-12 text-center text-xs text-outline flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-outline/40">
                        search_off
                      </span>
                      <span>No notes match current criteria</span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setFilterTag('All');
                          setFilterStatus('All');
                        }}
                        className="text-primary font-bold hover:underline text-[11px] mt-1"
                      >
                        Reset search &amp; filters
                      </button>
                    </div>
                  ) : (
                    filteredNotes.map((note) => {
                      const isSelected = !isComposing && currentNote?.id === note.id;
                      return (
                        <div
                          key={note.id}
                          onClick={() => {
                            setSelectedNoteId(note.id);
                            setIsComposing(false);
                            setIsEditing(false);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col gap-1.5 ${
                            isSelected
                              ? 'bg-primary/5 border-primary shadow-xs ring-1 ring-primary/40'
                              : note.completed
                              ? 'bg-surface-container-low/30 border-surface-container-high/60 opacity-60 hover:opacity-100 hover:border-surface-container-highest'
                              : 'bg-surface-container-lowest border-surface-container-high hover:border-primary/40 shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTagBadgeStyle(
                                  note.tag
                                )}`}
                              >
                                {note.tag}
                              </span>
                              {note.completed && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                  <span className="material-symbols-outlined text-[11px]">
                                    check_circle
                                  </span>
                                  Done
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-on-surface-variant font-medium">
                              {note.time}
                            </span>
                          </div>

                          <p
                            className={`text-xs text-on-surface line-clamp-2 leading-snug break-words ${
                              note.completed ? 'line-through text-outline' : ''
                            }`}
                          >
                            {note.text}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* RIGHT PANE: Selected Note Inspector / In-Place Editor / Composer */}
              <div className="md:col-span-7 flex flex-col bg-surface-container-lowest overflow-y-auto">
                {/* MODE 1: Compose New Note in Modal */}
                {isComposing ? (
                  <form
                    onSubmit={handleSaveNew}
                    className="p-6 flex flex-col h-full justify-between gap-4"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[20px]">
                            add_circle
                          </span>
                          <h3 className="text-sm font-bold text-on-surface">
                            Compose New Clinical Note
                          </h3>
                        </div>
                        <span className="text-[11px] text-outline">Chairside Scratchpad</span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                          Select Clinical Category:
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {(
                            ['Clinical', 'Rx', 'Lab', 'Urgent', 'Follow-up'] as QuickNote['tag'][]
                          ).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setNewNoteTag(t)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                newNoteTag === t
                                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                                  : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container-high'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                          Note Content:
                        </label>
                        <textarea
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="Type complete patient reminder, biopsy instruction, medication adjustment, or operatory supply request..."
                          className="w-full p-4 bg-surface-container-low/70 rounded-2xl text-on-surface border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-xs leading-relaxed transition-all font-medium placeholder:text-outline min-h-[200px]"
                          rows={8}
                          autoFocus
                        />
                        <div className="flex justify-between items-center text-[11px] text-outline mt-1.5">
                          <span>Character count: {newNoteText.length}</span>
                          <span>Auto-saves to browser session</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-surface-container-low">
                      <button
                        type="button"
                        onClick={() => setIsComposing(false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        <span>Save Note</span>
                      </button>
                    </div>
                  </form>
                ) : currentNote ? (
                  /* MODE 2: Note Detailed Inspector & In-Place Editor */
                  <div className="p-6 flex flex-col h-full justify-between gap-4">
                    <div className="space-y-4">
                      {/* Note Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-surface-container-low">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getTagBadgeStyle(
                              currentNote.tag
                            )}`}
                          >
                            {currentNote.tag}
                          </span>
                          <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">
                              schedule
                            </span>
                            {currentNote.time}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              currentNote.completed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {currentNote.completed ? 'Completed' : 'Active'}
                          </span>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCopy(currentNote.text)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
                            title="Copy note text"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              content_copy
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleComplete(currentNote.id)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              currentNote.completed
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-on-surface-variant hover:text-emerald-700 hover:bg-surface-container-high'
                            }`}
                            title={currentNote.completed ? 'Mark active' : 'Mark completed'}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {currentNote.completed
                                ? 'check_circle'
                                : 'radio_button_unchecked'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
                            title="Edit note text"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(currentNote.id)}
                            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer"
                            title="Delete note"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Detail Content or Inline Edit */}
                      {isEditing ? (
                        <form onSubmit={handleSaveEdit} className="space-y-3.5">
                          <div>
                            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                              Change Category:
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {(
                                ['Clinical', 'Rx', 'Lab', 'Urgent', 'Follow-up'] as QuickNote['tag'][]
                              ).map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setEditTag(t)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                    editTag === t
                                      ? 'bg-primary text-on-primary border-primary shadow-xs'
                                      : 'bg-surface-container-low text-on-surface-variant border-surface-container-high hover:bg-surface-container-high'
                                  }`}
                                >
                                  {t}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                              Edit Note Content:
                            </label>
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-3.5 bg-surface-container-low/70 rounded-xl text-on-surface border border-surface-container-high focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none text-xs leading-relaxed transition-all font-medium min-h-[190px]"
                              rows={7}
                            />
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                check
                              </span>
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-4">
                          {/* Full Note Text in high-readability container */}
                          <div className="p-5 rounded-2xl bg-surface-container-low/50 border border-surface-container-high/80 relative">
                            <div className="absolute top-3 right-3 text-outline/30">
                              <span className="material-symbols-outlined text-3xl">
                                format_quote
                              </span>
                            </div>
                            <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap select-text font-medium relative z-10">
                              {currentNote.text}
                            </p>
                          </div>

                          {/* Clinical Context & Metadata Card */}
                          <div className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high/80 grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                                Vault Record ID
                              </span>
                              <span className="font-mono font-semibold text-on-surface text-xs block mt-0.5">
                                #NOTE-{currentNote.id.slice(-6)}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-outline block">
                                Current Status
                              </span>
                              <span className="font-semibold text-on-surface text-xs block mt-0.5">
                                {currentNote.completed
                                  ? 'Resolved & Archived'
                                  : 'Active Clinical Scratchpad'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Utility Bar */}
                    {!isEditing && (
                      <div className="pt-3 border-t border-surface-container-low flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">lock</span>
                          <span>Local practitioner workspace • HIPAA secure</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopy(currentNote.text)}
                            className="px-3.5 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              content_copy
                            </span>
                            <span>Copy Note</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleComplete(currentNote.id)}
                            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                              currentNote.completed
                                ? 'bg-primary text-on-primary hover:bg-primary-container'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[15px]">
                              {currentNote.completed ? 'undo' : 'check'}
                            </span>
                            <span>
                              {currentNote.completed ? 'Mark Active' : 'Mark Completed'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* MODE 3: Empty State */
                  <div className="p-8 flex flex-col items-center justify-center text-center h-full gap-3 text-outline">
                    <span className="material-symbols-outlined text-4xl text-outline/40">
                      note_alt
                    </span>
                    <p className="text-xs font-medium">
                      Select a note from the left to view full details or compose a new one.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsComposing(true);
                        setNewNoteText('');
                        setNewNoteTag('Clinical');
                      }}
                      className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Create Note</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
