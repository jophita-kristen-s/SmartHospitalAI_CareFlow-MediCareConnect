import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariants } from '../styles/theme';

export default function Modal({ open, onClose, title, children, maxWidth = '440px' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
        >
          <motion.div
            key="modal-panel"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={e => e.stopPropagation()}
            className="card-premium w-full p-6"
            style={{ maxWidth }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>
                {title}
              </h3>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer' }}
              >
                <X size={15} color="rgba(255,255,255,0.45)" />
              </motion.button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
