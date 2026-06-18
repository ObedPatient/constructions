import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, Mail, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

export default function FloatingContact() {
  const [open, setOpen] = useState(false);
  const { phone, email } = useSelector((state: RootState) => state.company.profile);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-2"
          >
            <a
              href={`https://wa.me/${phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 shadow-lg transition-colors text-sm font-medium"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 bg-primary hover:bg-secondary text-white px-4 py-2.5 shadow-lg transition-colors text-sm font-medium"
            >
              <Phone size={16} /> Call Us
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-4 py-2.5 shadow-lg transition-colors text-sm font-medium"
            >
              <Mail size={16} /> Email Us
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-accent hover:bg-accent/90 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
        aria-label="Contact options"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X size={22} /> : <MessageCircle size={22} />}
        </motion.div>
      </button>
    </div>
  );
}
