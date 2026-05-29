import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Loader2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType, doc, setDoc, serverTimestamp } from '../firebase';

interface SupportModalProps {
  onClose: () => void;
  user: any; // Firebase User object
  userData: any; // User database document
  initialCategory?: 'general' | 'payment' | 'bug' | 'feedback';
}

const FAQs = [
  {
    question: "Warum dauern meine Hairstyle-Generierungen so lange?",
    answer: "Eine KI-Bilderstellung dauert in der Regel zwischen 20 und 40 Sekunden, da komplexe Berechnungen auf unseren Grafikprozessoren durchgeführt werden. Falls eine Verbindung kurz hakt oder ein Bild hängt, lädt unsere App automatisch im Hintergrund neu. Sollte nach 2 Minuten kein Ergebnis sichtbar sein, nutze einfach dieses Formular und unser Tech-Support schaut direkt rein!"
  },
  {
    question: "Wie kann ich mein monatliches Pro-Abo wieder kündigen?",
    answer: "Du kannst dein Abonnement jederzeit risikofrei in deinem Profil (Kontoeinstellungen) mit nur einem Klick kündigen – ohne versteckte Fristen oder komplizierte Prozesse. Nach der Kündigung behältst du bis zum Ende des Abrechnungsmonats vollen Zugriff auf all deine erstellen Frisuren und Premium-Features."
  },
  {
    question: "Funktioniert Frisuren.ai auch mit Brillen und Kopfbedeckungen?",
    answer: "Ja, absolut! Unsere speziell trainierte KI erkennt Brillen und rechnet die Wunschfrisur nahtlos um das Gestell herum. Für das beste und präziseste Ergebnis empfehlen wir jedoch, ein qualitativ hochwertiges Foto von vorne hochzuladen (ausreichend beleuchtet, keine Schatten, Augen gut sichtbar)."
  }
];

export default function SupportModal({ onClose, user, userData, initialCategory = 'general' }: SupportModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'general' | 'payment' | 'bug' | 'feedback'>(initialCategory);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [agreedToGdpr, setAgreedToGdpr] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Accordion state for FAQs (collapses of all by default)
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  // Prefill user details if available
  useEffect(() => {
    if (userData) {
      setName(userData.displayName || user?.displayName || '');
      setEmail(userData.email || user?.email || '');
    } else if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user, userData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage("Bitte gib deinen Namen ein.");
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }
    if (!subject.trim()) {
      setErrorMessage("Bitte gib einen Betreff an.");
      return;
    }
    if (!message.trim()) {
      setErrorMessage("Bitte beschreibe dein Anliegen.");
      return;
    }
    if (!agreedToGdpr) {
      setErrorMessage("Bitte akzeptiere die Datenschutzvereinbarung.");
      return;
    }

    setIsSubmitting(true);

    // Generate compliant ticketId e.g. SR-48194
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `SR-${randomNum}`;

    const path = `support_tickets/${ticketId}`;
    try {
      const ticketData = {
        ticketId,
        userId: user?.uid || 'guest',
        name: name.trim(),
        email: email.trim(),
        category,
        subject: subject.trim(),
        message: message.trim(),
        status360: 'open',
        createdAt: serverTimestamp(),
        userAgent: navigator.userAgent || 'unknown'
      };

      // Set document in collection support_tickets
      await setDoc(doc(db, 'support_tickets', ticketId), ticketData);
      
      setSuccessTicketId(ticketId);
    } catch (err) {
      console.error("Support submission failed", err);
      // Handles standard Firestore permission/quota metrics
      const errInfo = handleFirestoreError(err, OperationType.CREATE, path);
      setErrorMessage(`Senden fehlgeschlagen: ${errInfo.error || "Unbekannter Fehler"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyTicketId = () => {
    if (!successTicketId) return;
    navigator.clipboard.writeText(successTicketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto flex items-start justify-center p-4 bg-black/80 backdrop-blur-md">
      {/* Backdrop tap closure */}
      <div className="fixed inset-0 cursor-default" onClick={onClose} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-xl bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden p-6 md:p-10 text-brand-primary my-auto z-10 space-y-6 max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-black/5 rounded-full flex items-center justify-center text-brand-primary/40 hover:bg-black/10 hover:text-brand-primary transition-all duration-300"
          id="close_support_button"
        >
          <X size={20} />
        </button>

        {/* Success View */}
        <AnimatePresence mode="wait">
          {successTicketId ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-6 flex-1 flex flex-col justify-center items-center"
              id="support_success_view"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                <CheckCircle2 size={44} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-black">Nachricht gesendet!</h2>
                <p className="text-brand-primary/60 text-sm max-w-md mx-auto leading-relaxed">
                  Vielen Dank für deine Kontaktaufnahme. Deine Anfrage wurde erfolgreich übermittelt. Wir antworten dir in der Regel innerhalb von 2-4 Stunden auf deine angegebene E-Mail-Adresse.
                </p>
              </div>

              {/* Ticket ID Board */}
              <div className="p-4 bg-brand-primary/5 border border-brand-primary/5 rounded-2xl w-full max-w-xs space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Deine Ticket-Nummer</p>
                <div className="flex items-center justify-between bg-white border border-brand-primary/10 rounded-xl px-4 py-2">
                  <span className="font-mono font-black text-base text-brand-primary tracking-wider">{successTicketId}</span>
                  <button 
                    onClick={copyTicketId}
                    className="p-1 px-2.5 bg-black/5 hover:bg-black/10 rounded-md transition-all flex items-center gap-1.5 text-[10px] font-bold text-brand-primary/60"
                  >
                    {copied ? "Kopiert! ✓" : <><Copy size={12} /> Kopieren</>}
                  </button>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full max-w-xs py-4 bg-black text-white hover:bg-[#FF9EBE] hover:text-black hover:scale-[1.02] active:scale-98 rounded-xl font-bold text-sm tracking-widest uppercase transition-all shadow-md"
              >
                Fertig
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6 flex-1">
              {/* Header Header */}
              <div className="text-left space-y-2 pr-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9EBE]/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#FF9EBE] w-fit">
                  <MessageSquare size={12} />
                  Hilfe & Support
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-black leading-tight">Wie können wir dir helfen?</h2>
                <p className="text-brand-primary/60 text-xs md:text-sm">
                  Schau kurz in unsere Top-FAQs rein, damit bekommst du meistens direkt eine Antwort! Falls nicht, füll einfach das Formular aus.
                </p>
              </div>

              {/* Top FAQs (Deflection Pattern) */}
              <div className="space-y-2 border-b border-black/5 pb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 mb-3 flex items-center gap-1.5">
                  <HelpCircle size={12} className="text-[#FF9EBE]" />
                  Direkte Antworten / FAQs
                </p>
                {FAQs.map((faq, index) => {
                  const isExpanded = expandedFaqIndex === index;
                  return (
                    <div 
                      key={index} 
                      className="border border-black/5 bg-black/[0.01] hover:bg-black/[0.02] rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                        className="w-full py-3.5 px-4 flex items-center justify-between text-left text-xs font-bold text-brand-primary/80 group"
                        type="button"
                      >
                        <span className="group-hover:text-brand-primary transition-colors">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-brand-primary/40 shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-[#FF9EBE] shrink-0" />
                        )}
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4 pt-1 text-xs text-brand-primary/60 leading-relaxed border-t border-black/5 bg-white">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Formular form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 font-bold text-xs">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 flex items-center gap-1">
                      Dein Name <span className="text-[#FF9EBE]">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="z.B. Anna Müller"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/[0.02] focus:bg-white border border-black/5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#FF9EBE]/20 focus:border-[#FF9EBE] transition-all"
                    />
                  </div>

                  {/* Mail address field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 flex items-center gap-1">
                      E-Mail-Adresse <span className="text-[#FF9EBE]">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="z.B. anna@example.de"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/[0.02] focus:bg-white border border-black/5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#FF9EBE]/20 focus:border-[#FF9EBE] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Field */}
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                      Kategorie <span className="text-[#FF9EBE]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      disabled={isSubmitting}
                      className="w-full px-3 py-3 bg-black/[0.02] focus:bg-white border border-black/5 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF9EBE]/20 focus:border-[#FF9EBE] transition-all appearance-none cursor-pointer"
                    >
                      <option value="general">Allgemeines</option>
                      <option value="payment">Zahlung / Abo</option>
                      <option value="bug">Fehler / Tech</option>
                      <option value="feedback">Wünsche & Lob</option>
                    </select>
                  </div>

                  {/* Betreff Field */}
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                      Betreff <span className="text-[#FF9EBE]">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={
                        category === 'payment' ? 'Zahlungsfehler / Upgrade-Code' :
                        category === 'bug' ? 'Bilderstellung lädt nicht' :
                        'Wie funktioniert...'
                      }
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-black/[0.02] focus:bg-white border border-black/5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#FF9EBE]/20 focus:border-[#FF9EBE] transition-all"
                    />
                  </div>
                </div>

                {/* Message text area */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">
                    Deine Mitteilung <span className="text-[#FF9EBE]">*</span>
                  </label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Beschreibe dein Anliegen so genau wie möglich. Falls du Probleme mit der Generierung hast, nenne uns gerne die Frisur oder was schiefgelaufen ist."
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-black/[0.02] focus:bg-white border border-black/5 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-[#FF9EBE]/20 focus:border-[#FF9EBE] transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* GDPR Consent Option */}
                <label className="flex items-start gap-2.5 cursor-pointer group pb-2">
                  <input 
                    type="checkbox" 
                    checked={agreedToGdpr} 
                    onChange={(e) => setAgreedToGdpr(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-[#FF9EBE] border-gray-300 focus:ring-[#FF9EBE]" 
                    id="support_gdpr_checkbox"
                  />
                  <div className="text-[10px] leading-normal text-brand-primary/50 group-hover:text-brand-primary/80 transition-colors">
                    Ich stimme zu, dass Frisuren.ai meine Angaben zur Beantwortung dieser Anfrage speichert. Die Einwilligung kann jederzeit widerrufen werden.
                  </div>
                </label>

                {/* Submit button */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between pt-1">
                  <span className="text-[9px] font-black uppercase tracking-wider text-brand-primary/30 flex items-center gap-1">
                    <Shield size={10} className="text-emerald-500" />
                    Datensparsam & SSL verschlüsselt
                  </span>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto py-3.5 px-8 bg-[#FF9EBE] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FF9EBE]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#FF9EBE]/10"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <span>Absenden</span>
                        <Send size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
