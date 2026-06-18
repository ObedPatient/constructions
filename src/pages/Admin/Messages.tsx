import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Mail, MailOpen, Phone, Calendar, X } from 'lucide-react';
import type { RootState, AppDispatch } from '../../redux/store';
import { markMessageRead, removeMessage } from '../../redux/slices/contactSlice';
import { notify } from '../../utils/toast';

export default function AdminMessages() {
  const dispatch = useDispatch<AppDispatch>();
  const { messages } = useSelector((s: RootState) => s.contact);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMsg = messages.find((m) => m.id === selected);

  const handleOpen = (id: string) => {
    setSelected(id);
    dispatch(markMessageRead(id));
  };

  const deleteSelectedMessage = async () => {
    if (!selectedMsg) return;
    try {
      await dispatch(removeMessage(selectedMsg.id)).unwrap();
      notify.success('Message deleted successfully');
      setSelected(null);
    } catch (err) {
      notify.error(String(err));
    }
  };

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">{messages.length} total · <span className="text-accent">{unread} unread</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-220px)]">
        {/* Message list */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages…"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border-0 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-accent" />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-gray-50 dark:divide-gray-700">
            {filtered.map((msg) => (
              <button key={msg.id} onClick={() => handleOpen(msg.id)}
                className={`w-full text-left px-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${selected === msg.id ? 'bg-accent/5 dark:bg-accent/10 border-r-2 border-accent' : ''} ${!msg.isRead ? 'bg-accent/5' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!msg.isRead ? 'bg-accent' : 'bg-transparent'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm truncate ${!msg.isRead ? 'font-semibold text-gray-800 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{msg.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{msg.message}</p>
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">No messages found</div>
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedMsg ? (
              <motion.div key={selectedMsg.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white">{selectedMsg.subject}</h2>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(selectedMsg.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={deleteSelectedMessage}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1 overflow-y-auto">
                  {/* Sender info */}
                  <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="w-12 h-12 bg-primary dark:bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {selectedMsg.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{selectedMsg.name}</p>
                      <div className="flex flex-wrap gap-4 mt-1">
                        <a href={`mailto:${selectedMsg.email}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent transition-colors">
                          <Mail size={12} /> {selectedMsg.email}
                        </a>
                        <a href={`tel:${selectedMsg.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent transition-colors">
                          <Phone size={12} /> {selectedMsg.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
                </div>
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                  <a href={`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`}
                    className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 text-sm font-medium transition-colors w-fit">
                    <Mail size={14} /> Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                <MailOpen size={40} className="opacity-30" />
                <p className="text-sm">Select a message to read</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
