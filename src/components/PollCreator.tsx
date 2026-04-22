import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Image as ImageIcon, 
  LayoutGrid, 
  MessageSquare, 
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Scissors
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PollCreatorProps {
  userHistory: any[];
  onClose: () => void;
  onCreatePoll: (selectedItems: any[], question: string) => Promise<void>;
  isCreating: boolean;
  initialSelectedIds?: string[];
}

export default function PollCreator({ userHistory, onClose, onCreatePoll, isCreating, initialSelectedIds = [] }: PollCreatorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [question, setQuestion] = useState('Welcher dieser Styles steht mir am besten? 🤔');
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const selectedItems = userHistory.filter(item => selectedIds.includes(item.id));

  const handleCreate = async () => {
    if (selectedItems.length < 2) return;
    await onCreatePoll(selectedItems, question);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white flex flex-col font-sans text-brand-primary">
      {/* Header */}
      <header className="px-8 py-6 border-b border-black/5 flex items-center justify-between shrink-0 bg-white shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FF9EBE] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#FF9EBE]/20">
            <MessageSquare size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-widest">Umfrage erstellen</h1>
            <p className="text-[10px] font-medium text-brand-primary/40 uppercase tracking-widest">Teile deine Looks mit Freunden</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-brand-primary/40 hover:bg-black/10 transition-all"
        >
          <X size={24} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto bg-black/[0.02]">
        <div className="max-w-4xl mx-auto p-8 space-y-12 pb-32">
          
          <AnimatePresence mode="wait">
            {step === 'select' ? (
              <motion.div 
                key="step-select"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between gap-4">
                   <div className="space-y-1">
                      <h2 className="text-2xl font-serif font-black italic">Wähle deine Favoriten</h2>
                      <p className="text-brand-primary/40 text-sm">Wähle bis zu 4 Looks aus deiner Galerie aus.</p>
                   </div>
                   <div className="px-4 py-2 bg-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {selectedIds.length} / 4 ausgewählt
                   </div>
                </div>

                {userHistory.length === 0 ? (
                   <div className="py-20 text-center space-y-4 bg-white rounded-[3rem] border border-black/5 border-dashed">
                      <div className="w-16 h-16 bg-black/5 rounded-2xl mx-auto flex items-center justify-center text-brand-primary/20">
                         <ImageIcon size={32} />
                      </div>
                      <p className="text-sm font-bold text-brand-primary/40 uppercase tracking-widest">Deine Galerie ist leer</p>
                   </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {userHistory.map((item) => {
                      const isSelected = selectedIds.includes(item.id);
                      return (
                        <motion.button
                          key={item.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleSelect(item.id)}
                          className={`group relative aspect-[3/4] rounded-3xl overflow-hidden border-4 transition-all ${
                            isSelected ? 'border-[#FF9EBE] shadow-2xl scale-[1.02]' : 'border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                          }`}
                        >
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className={`absolute inset-0 transition-opacity p-4 flex flex-col justify-end ${isSelected ? 'bg-black/20' : 'bg-transparent'}`}>
                             <div className="space-y-1 text-left">
                                <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">{item.name}</p>
                             </div>
                          </div>
                          {isSelected && (
                            <div className="absolute top-4 right-4 w-8 h-8 bg-[#FF9EBE] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in-50">
                               <Check size={18} strokeWidth={4} />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="step-confirm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                 <div className="space-y-6">
                    <div className="space-y-1 text-center">
                       <h2 className="text-2xl font-serif font-black italic text-brand-primary">Deine Frage an die Freunde</h2>
                       <p className="text-brand-primary/40 text-sm">Frag deine Freunde nach ihrer ehrlichen Meinung!</p>
                    </div>
                    
                    <div className="relative max-w-xl mx-auto space-y-4">
                       <input 
                          type="text" 
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Deine Frage..."
                          className="w-full px-8 py-6 bg-white border border-black/5 rounded-[2rem] text-lg font-bold text-center shadow-xl focus:ring-4 focus:ring-[#FF9EBE]/10 outline-none transition-all placeholder:text-brand-primary/20"
                       />
                       <div className="flex flex-wrap justify-center gap-2">
                          {[
                             "Welcher Style steht mir am besten? 🤔",
                             "Kurz oder Lang? ✂️",
                             "Was sagt ihr zu dieser Haarfarbe? 🎨",
                             "Perfekt für das erste Date? ❤️",
                             "Soll ich mich trauen? 🔥"
                          ].map((q) => (
                             <button
                                key={q}
                                onClick={() => setQuestion(q)}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                                   question === q 
                                      ? 'bg-[#FF9EBE] border-[#FF9EBE] text-white shadow-md shadow-[#FF9EBE]/20' 
                                      : 'bg-white border-black/5 text-brand-primary/40 hover:border-[#FF9EBE]/30 hover:text-[#FF9EBE]'
                                }`}
                             >
                                {q}
                             </button>
                          ))}
                       </div>
                       <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#FF9EBE] shadow-lg border border-[#FF9EBE]/20">
                          <MessageSquare size={20} />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-center opacity-40">Vorschau deiner Auswahl</h3>
                    <div className="flex flex-wrap justify-center gap-6">
                       {selectedItems.map((item, i) => (
                         <div key={item.id} className="relative w-32 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-black/5">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute top-2 right-2 w-5 h-5 bg-black rounded-full text-white text-[10px] flex items-center justify-center font-black">
                               {String.fromCharCode(65 + i)}
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Footer Actions */}
      <footer className="fixed bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-xl border-t border-black/5 flex justify-center z-20">
         <div className="max-w-4xl w-full flex items-center justify-between gap-8">
            <button 
              onClick={() => step === 'select' ? onClose() : setStep('select')}
              className="px-8 py-4 text-brand-primary/40 font-black text-xs uppercase tracking-widest hover:text-brand-primary transition-colors flex items-center gap-2"
            >
               {step === 'select' ? (
                 <>Abbrechen</>
               ) : (
                 <>Zurück zum Auswählen</>
               )}
            </button>

            {step === 'select' ? (
              <button 
                onClick={() => setStep('confirm')}
                disabled={selectedIds.length < 2}
                className="px-12 py-5 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 flex items-center gap-3"
              >
                 Weiter
                 <ImageIcon size={18} />
              </button>
            ) : (
              <button 
                onClick={handleCreate}
                disabled={isCreating}
                className="px-12 py-5 bg-[#FF9EBE] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#FF9EBE]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Erstelle Umfrage...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Umfrage jetzt erstellen</span>
                  </>
                )}
              </button>
            )}
         </div>
      </footer>
    </div>
  );
}
