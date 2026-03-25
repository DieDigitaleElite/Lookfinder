import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, Check } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[150]"
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-black/5 p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent shrink-0">
                <Shield size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-brand-primary">Datenschutz & Cookies</h3>
                <p className="text-sm text-brand-primary/60 leading-relaxed">
                  Wir nutzen Cookies, um Ihr Erlebnis zu verbessern und unsere Dienste sicher zu betreiben. Für die KI-Analyse verarbeiten wir Ihr Foto gemäß unserer <span className="text-brand-accent underline cursor-pointer">Datenschutzerklärung</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 py-3 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Alle akzeptieren
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 py-3 bg-black/5 text-brand-primary rounded-xl font-bold text-sm hover:bg-black/10 transition-all"
              >
                Nur Notwendige
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
