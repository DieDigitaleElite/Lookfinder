import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Camera, 
  ChevronRight, 
  LayoutGrid, 
  Users, 
  RotateCcw, 
  CheckCircle2, 
  Scan, 
  Columns, 
  Lightbulb, 
  Sun, 
  Moon, 
  Scissors, 
  Palette,
  Info,
  Maximize2,
  Trash2,
  Share2,
  Plus,
  ArrowRightLeft,
  ShieldCheck,
  TrendingUp,
  Award,
  X,
  Target,
  Zap,
  Check,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HAIRSTYLE_LIBRARY, 
  HAIRSTYLE_CATEGORIES, 
  HAIR_COLORS, 
  COLOR_WORLDS,
  LIGHTING_SIMULATIONS 
} from '../constants';

interface StylingStudioProps {
  image: string | null;
  onTryOn: (style: any, color: any, lighting: any) => Promise<void>;
  isGenerating: boolean;
  userHistory: any[];
  faceAnalysis?: any;
  onAnalyzeFace: () => Promise<void>;
  userSketch: string | null;
  isGeneratingSketch: boolean;
  onGenerateFashionSketch: (styleName: string) => Promise<string | null>;
}

export default function StylingStudio({ 
  image, 
  onTryOn, 
  isGenerating, 
  userHistory,
  faceAnalysis,
  onAnalyzeFace,
  userSketch,
  isGeneratingSketch,
  onGenerateFashionSketch
}: StylingStudioProps) {
  const [activeModule, setActiveModule] = useState<'lab' | 'intelligence' | 'compare' | 'decision'>('lab');
  const [selectedCategory, setSelectedCategory] = useState('short');
  const [selectedWorld, setSelectedWorld] = useState('blond');
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedLightingId, setSelectedLightingId] = useState('daylight');
  
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [currentSketch, setCurrentSketch] = useState<string | null>(null);
  const [isSketching, setIsSketching] = useState(false);

  // Prevent body scroll when studio is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // sync sketch on style change
  useEffect(() => {
    if (selectedStyleId && onGenerateFashionSketch) {
      const style = HAIRSTYLE_LIBRARY.find(s => s.id === selectedStyleId);
      if (style) {
        setIsSketching(true);
        onGenerateFashionSketch(style.name).then(sketch => {
          if (sketch) setCurrentSketch(sketch);
          setIsSketching(false);
        });
      }
    }
  }, [selectedStyleId]);

  // Module 1: Style Lab logic
  const filteredStyles = useMemo(() => 
    HAIRSTYLE_LIBRARY.filter(s => s.category === selectedCategory),
  [selectedCategory]);

  const filteredColors = useMemo(() => 
    HAIR_COLORS.filter(c => c.world === selectedWorld),
  [selectedWorld]);

  const handleTryOn = () => {
    const style = HAIRSTYLE_LIBRARY.find(s => s.id === selectedStyleId);
    const color = HAIR_COLORS.find(c => c.id === selectedColorId);
    const lighting = LIGHTING_SIMULATIONS.find(l => l.id === selectedLightingId);
    
    if (style && color && lighting) {
      onTryOn(style, color, lighting);
    }
  };

  // Module 3: Compare toggle
  const toggleCompare = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(-4)
    );
  };

  const compareItems = useMemo(() => 
    userHistory.filter(h => compareIds.includes(h.id)),
  [userHistory, compareIds]);

  return (
    <div className="flex flex-col h-full w-full bg-white relative overflow-hidden">
      {/* Module Navigation */}
      <div className="flex border-b border-black/5 px-4 md:px-8 pt-2 overflow-x-auto no-scrollbar bg-white shrink-0 z-20">
        {[
          { id: 'lab', name: 'Live Style Lab', icon: Palette },
          { id: 'intelligence', name: 'Face Intelligence', icon: Scan },
          { id: 'compare', name: 'Compare Mode', icon: Columns },
          { id: 'decision', name: 'Style Decision', icon: Lightbulb },
        ].map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id as any)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative shrink-0 ${
              activeModule === mod.id ? 'text-[#FF9EBE]' : 'text-brand-primary/40 hover:text-brand-primary'
            }`}
          >
            <mod.icon size={16} />
            {mod.name}
            {activeModule === mod.id && (
              <motion.div layoutId="studio-active-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF9EBE]" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth bg-white">
          {/* MODULE 1: LIVE STYLE LAB */}
          {activeModule === 'lab' && (
            <div
              key="lab"
              className="p-4 md:p-10 space-y-12"
            >
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] xl:gap-16 gap-12">
                
                {/* 1. Preview Rendering (Order 1 on mobile, 2 on desktop) */}
                <div className="xl:order-2 xl:sticky xl:top-8 h-fit space-y-6 order-1">
                  <div className="relative aspect-[3/4] rounded-[2.5rem] bg-black/5 overflow-hidden flex items-center justify-center border-4 border-white shadow-2xl xl:shadow-brand-primary/10">
                     {currentSketch || userSketch || image ? (
                       <div className="w-full h-full relative group bg-white">
                          <AnimatePresence mode="wait">
                            <motion.img 
                              key={currentSketch || userSketch || image || 'empty'}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              src={currentSketch || userSketch || image!} 
                              className={`w-full h-full object-cover ${(isSketching || isGeneratingSketch) ? 'animate-pulse blur-sm' : ''}`} 
                              referrerPolicy="no-referrer" 
                            />
                          </AnimatePresence>

                          {isSketching && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-30">
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 border-4 border-[#FF9EBE] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Zeichne personalisierten Look...</p>
                              </div>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/5 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none z-20">
                             <div className="bg-white/90 backdrop-blur-md p-6 rounded-[2.5rem] text-center space-y-2 border border-white shadow-xl max-w-xs">
                                <p className="font-serif font-black text-brand-primary italic text-xl">Dein Fashion-Sketch</p>
                                <p className="text-brand-primary/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Dies ist eine künstlerische Vorschau. Klicke unten auf "Rendering starten" für das fotorealistische Ergebnis.</p>
                             </div>
                          </div>
                          
                          {/* Simulation Overlays */}
                          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none z-30">
                             <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-brand-primary space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Vorschau</p>
                                <p className="text-xs font-bold flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#FF9EBE] animate-pulse" />
                                  Künstlerische Skizze
                                </p>
                             </div>
                             <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-brand-primary text-right space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                                <p className="text-xs font-bold italic truncate max-w-[100px]">Live Lab Active</p>
                             </div>
                          </div>

                          {/* Paper Texture Overlay */}
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20 mix-blend-multiply pointer-events-none z-10" />
                       </div>
                     ) : (
                       <div className="text-center space-y-6 px-12">
                          <div className="w-24 h-24 bg-white rounded-[2rem] mx-auto flex items-center justify-center shadow-xl">
                             <Camera size={40} className="text-brand-primary/10" />
                          </div>
                          <h4 className="text-xl font-serif font-bold italic">Lade ein Foto hoch</h4>
                          <p className="text-brand-primary/40 text-sm leading-relaxed">Um das Live Style Lab zu nutzen, benötigen wir ein Selfie von dir.</p>
                       </div>
                     )}
                  </div>
                  
                  {/* Quick Info Card */}
                  <div className="hidden xl:block p-6 bg-brand-primary/[0.03] rounded-3xl border border-brand-primary/5 space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FF9EBE]/10 flex items-center justify-center text-[#FF9EBE]">
                           <Info size={18} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Studio Tipp</p>
                     </div>
                     <p className="text-xs text-brand-primary/60 leading-relaxed italic">
                        "Kombiniere verschiedene Lichtverhältnisse mit deinen Favoriten, um zu sehen wie die Haarfarbe im echten Leben wirkt."
                     </p>
                  </div>
                </div>

                {/* 2. Controls (Order 2 on mobile, 1 on desktop) */}
                <div className="space-y-12 order-2 xl:order-1 h-fit">
                  {/* Category Selection */}
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">1. Wähle deinen Schnitt</h3>
                      <div className="p-2 bg-brand-primary/[0.03] rounded-lg text-[10px] text-brand-primary/40 font-bold flex items-center gap-2">
                        <Scissors size={12} />
                        Styling Guide
                      </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                      {HAIRSTYLE_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`px-8 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all whitespace-nowrap shadow-sm ${
                            selectedCategory === cat.id 
                              ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20 scale-105' 
                              : 'bg-white text-brand-primary/40 border-black/5 hover:border-brand-primary/20'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredStyles.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setSelectedStyleId(s.id);
                            // We don't trigger a new AI sketch on every click to save power
                            // but we could if we wanted to
                          }}
                          className={`group flex flex-col p-3 rounded-[2.5rem] border-2 transition-all relative overflow-hidden bg-white ${
                            selectedStyleId === s.id ? 'border-[#FF9EBE] ring-8 ring-[#FF9EBE]/5 shadow-2xl' : 'border-black/[0.03] hover:border-[#FF9EBE]/20'
                          }`}
                        >
                          <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden mb-4 bg-[#F8F8F8] border border-black/[0.02]">
                             {/* Personalization Layer: The user's sketch face */}
                             {userSketch ? (
                               <div className="absolute inset-0 z-0 opacity-40">
                                 <img src={userSketch} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                               </div>
                             ) : (
                               <div className="absolute inset-0 z-0 bg-brand-primary/[0.02]" />
                             )}

                             <img 
                               src={`https://images.unsplash.com/photo-${
                                 s.category === 'short' ? '1595475243692-3a37549ebab0' :
                                 s.category === 'medium' ? '1580618672591-eb180b1a973f' :
                                 s.category === 'long' ? '1519702581692-0b73c4d7ec68' :
                                 s.category === 'trends' ? '1620331311520-246422ff83f9' :
                                 s.category === 'men' ? '1621605815971-fbc98d665033' :
                                 '1552337360788-8b13df793f1f'
                               }?auto=format&fit=crop&q=40&w=400&h=500`} 
                               className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 relative z-10 ${
                                 selectedStyleId === s.id 
                                   ? 'opacity-80' 
                                   : 'opacity-40 grayscale contrast-[400%] brightness-[1.2]'
                               }`} 
                               style={{
                                 filter: selectedStyleId === s.id 
                                   ? 'none' 
                                   : 'grayscale(1) contrast(500%) brightness(1.3)',
                                 mixBlendMode: userSketch ? 'multiply' : 'normal'
                               }}
                               referrerPolicy="no-referrer"
                             />
                             {/* Illustration Texture Overlay */}
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 mix-blend-multiply pointer-events-none z-20" />
                             
                             {selectedStyleId === s.id && (
                                <motion.div 
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-4 right-4 w-8 h-8 bg-[#FF9EBE] text-white rounded-full flex items-center justify-center shadow-xl z-30"
                                >
                                   <Check size={18} strokeWidth={4} />
                                </motion.div>
                             )}
                          </div>
                          <div className="px-2 text-center pb-2">
                             <p className={`text-[11px] font-black uppercase tracking-widest leading-tight transition-colors ${selectedStyleId === s.id ? 'text-brand-primary' : 'text-brand-primary/40'}`}>
                                {s.name}
                             </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Color Selection */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">2. Wähle die Farbwelt</h3>
                    <div className="flex gap-2">
                      {COLOR_WORLDS.map(world => (
                        <button
                          key={world.id}
                          onClick={() => setSelectedWorld(world.id)}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            selectedWorld === world.id 
                              ? 'bg-brand-primary text-white border-brand-primary' 
                              : 'bg-white text-brand-primary/40 border-black/5'
                          }`}
                        >
                          {world.name}
                        </button>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {filteredColors.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColorId(c.id)}
                          className={`group flex items-center gap-3 p-2 pr-4 rounded-xl border-2 transition-all ${
                            selectedColorId === c.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5' : 'border-black/5 hover:border-[#FF9EBE]/20'
                          }`}
                        >
                          <div 
                            className="w-8 h-8 rounded-lg shadow-inner shrink-0" 
                            style={{ backgroundColor: c.hex }}
                          />
                          <p className={`text-[10px] font-bold transition-colors ${selectedColorId === c.id ? 'text-[#FF9EBE]' : 'text-brand-primary/60'}`}>
                            {c.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Lighting Simulation */}
                  <section className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary">3. Simulation & Licht</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {LIGHTING_SIMULATIONS.map(l => (
                        <button
                          key={l.id}
                          onClick={() => setSelectedLightingId(l.id)}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                            selectedLightingId === l.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5' : 'border-black/5 hover:border-[#FF9EBE]/20'
                          }`}
                        >
                          {l.id === 'daylight' && <Sun size={20} className={selectedLightingId === l.id ? 'text-[#FF9EBE]' : 'text-brand-primary/20'} />}
                          {l.id === 'evening' && <Moon size={20} className={selectedLightingId === l.id ? 'text-[#FF9EBE]' : 'text-brand-primary/20'} />}
                          {l.id === 'studio' && <Sparkles size={20} className={selectedLightingId === l.id ? 'text-[#FF9EBE]' : 'text-brand-primary/20'} />}
                          {l.id === 'salon' && <Award size={20} className={selectedLightingId === l.id ? 'text-[#FF9EBE]' : 'text-brand-primary/20'} />}
                          {l.id === 'messy' && <RotateCcw size={20} className={selectedLightingId === l.id ? 'text-[#FF9EBE]' : 'text-brand-primary/20'} />}
                          <span className={`text-[10px] font-bold ${selectedLightingId === l.id ? 'text-[#FF9EBE]' : 'text-brand-primary/40'}`}>
                            {l.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <button
                    onClick={handleTryOn}
                    disabled={isGenerating || !selectedStyleId || !selectedColorId}
                    className="w-full py-6 bg-brand-primary text-white rounded-3xl font-black text-lg shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 relative overflow-hidden group"
                  >
                    {isGenerating ? (
                      <>
                        <RotateCcw className="animate-spin" size={24} />
                        KI generiert deinen Look...
                      </>
                    ) : (
                      <>
                        <Sparkles size={24} className="group-hover:animate-pulse" />
                        Look Rendering starten
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODULE 2: FACE INTELLIGENCE */}
          {activeModule === 'intelligence' && (
            <div
              key="intelligence"
              className="p-8 lg:p-12 space-y-12"
            >
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#FF9EBE]/10 text-[#FF9EBE] rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[#FF9EBE]/20">
                    <ShieldCheck size={14} />
                    Biometrische KI-Analyse
                  </div>
                  <h2 className="text-4xl font-serif font-black italic text-brand-primary">Face Intelligence</h2>
                  <p className="text-brand-primary/40 max-w-xl mx-auto text-sm">
                    Unsere KI analysiert hunderte biometrische Merkmale, um dir den absolut perfekten Haarschnitt zu empfehlen.
                  </p>
                </div>

                {!faceAnalysis ? (
                  <div className="bg-brand-primary/[0.03] border border-brand-primary/5 rounded-[3rem] p-12 text-center space-y-8">
                    <div className="relative w-48 h-48 mx-auto">
                      <div className="absolute inset-0 bg-brand-primary rounded-full animate-ping opacity-5" />
                      <div className="relative w-full h-full bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white">
                        {image ? (
                           <img src={image} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                        ) : (
                           <Users size={64} className="text-brand-primary/10" />
                        )}
                        <motion.div 
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-0.5 bg-[#FF9EBE] shadow-[0_0_15px_#FF9EBE]"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-serif font-bold">Bereit für den Scan?</h3>
                      <p className="text-brand-primary/40 text-sm max-w-sm mx-auto leading-relaxed">
                        Wir prüfen Gesichtsform, Haarstruktur und Symmetrie für deine personalisierten Empfehlungen.
                      </p>
                    </div>
                    <button
                      onClick={onAnalyzeFace}
                      disabled={isGenerating || !image}
                      className="px-10 py-5 bg-brand-primary text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      KI-Analyse starten
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="p-8 bg-brand-primary text-white rounded-[3rem] space-y-6 shadow-2xl shadow-brand-primary/20">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Erkannte Form</p>
                            <h4 className="text-3xl font-serif font-black italic">{faceAnalysis.shape}</h4>
                         </div>
                         <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '85%' }}
                              className="h-full bg-[#FF9EBE]"
                            />
                         </div>
                         <p className="text-sm leading-relaxed opacity-80 italic">
                            "{faceAnalysis.description}"
                         </p>
                      </div>

                      <div className="p-8 bg-white border border-black/5 rounded-[3rem] space-y-6">
                         <h5 className="text-xs font-black uppercase tracking-[0.2em] text-brand-primary flex items-center gap-2">
                           <Target size={14} className="text-[#FF9EBE]" />
                           Profi Emfpehlungen
                         </h5>
                         <div className="grid grid-cols-2 gap-4">
                            {faceAnalysis.features.map((f: string, i: number) => (
                              <div key={i} className="p-4 bg-black/[0.02] rounded-2xl flex items-start gap-3">
                                 <Plus size={14} className="text-green-500 mt-0.5 shrink-0" />
                                 <span className="text-[10px] font-bold text-brand-primary leading-tight">{f}</span>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-8 bg-green-50 rounded-[3rem] border border-green-100 space-y-6">
                         <h5 className="text-xs font-black uppercase tracking-[0.2em] text-green-800">Deine Besten Looks (Dos)</h5>
                         <ul className="space-y-4">
                            {faceAnalysis.dos.map((doItem: string, i: number) => (
                              <li key={i} className="flex items-start gap-3">
                                 <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={12} strokeWidth={4} />
                                 </div>
                                 <span className="text-xs font-bold text-green-900 leading-relaxed">{doItem}</span>
                              </li>
                            ))}
                         </ul>
                      </div>

                      <div className="p-8 bg-red-50 rounded-[3rem] border border-red-100 space-y-6">
                         <h5 className="text-xs font-black uppercase tracking-[0.2em] text-red-800">Vermeide diese (Don'ts)</h5>
                         <ul className="space-y-4">
                            {faceAnalysis.donts.map((dontItem: string, i: number) => (
                              <li key={i} className="flex items-start gap-3">
                                 <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                                    <X size={12} strokeWidth={4} />
                                 </div>
                                 <span className="text-xs font-bold text-red-900 leading-relaxed">{dontItem}</span>
                              </li>
                            ))}
                         </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODULE 3: COMPARE MODE */}
          {activeModule === 'compare' && (
            <div
              key="compare"
              className="p-8 lg:p-12 space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-serif font-black italic text-brand-primary">Side-by-Side Vergleich</h2>
                <p className="text-brand-primary/40 text-sm max-w-xl mx-auto">
                  Wähle bis zu 4 deiner generierten Styles aus deiner Historie, um sie direkt nebeneinander zu vergleichen.
                </p>
              </div>

              {userHistory.length === 0 ? (
                <div className="bg-brand-primary/[0.03] border border-brand-primary/5 rounded-[3rem] p-24 text-center space-y-6">
                   <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center shadow-xl">
                      <History size={32} className="text-brand-primary/10" />
                   </div>
                   <h3 className="text-xl font-serif font-bold">Noch keine Styles vorhanden</h3>
                   <p className="text-brand-primary/40 text-sm max-w-xs mx-auto leading-relaxed">
                     Generiere zuerst ein paar Styles im Lab, um sie hier vergleichen zu können.
                   </p>
                </div>
              ) : (
                <div className="space-y-12">
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {userHistory.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => toggleCompare(item.id)}
                          className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-4 transition-all ${
                            compareIds.includes(item.id) ? 'border-[#FF9EBE] scale-105 shadow-xl shadow-[#FF9EBE]/20' : 'border-white hover:border-[#FF9EBE]/20'
                          }`}
                        >
                          <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          {compareIds.includes(item.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-[#FF9EBE] text-white rounded-full flex items-center justify-center">
                               <Check size={14} strokeWidth={4} />
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                             <p className="text-[8px] font-black uppercase text-white truncate">{item.hairstyleId}</p>
                          </div>
                        </button>
                      ))}
                   </div>

                   {compareIds.length > 0 && (
                     <div className={`grid gap-6 ${
                        compareIds.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                        compareIds.length === 2 ? 'grid-cols-2 max-w-4xl mx-auto' :
                        compareIds.length === 3 ? 'grid-cols-3' :
                        'grid-cols-2 md:grid-cols-4'
                     }`}>
                        {compareItems.map((item, idx) => (
                           <div key={item.id} className="space-y-4">
                              <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                 <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                 <div className="absolute top-4 left-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white font-serif italic font-black">
                                    {idx + 1}
                                 </div>
                              </div>
                              <div className="px-4 text-center">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-brand-primary">{item.hairstyleId}</p>
                                 <p className="text-[8px] font-bold text-brand-primary/40 uppercase tracking-widest mt-1">Status: {item.rating}/10</p>
                              </div>
                           </div>
                        ))}
                     </div>
                   )}
                </div>
              )}
            </div>
          )}

          {/* MODULE 4: STYLE DECISION ENGINE */}
          {activeModule === 'decision' && (
            <div
              key="decision"
              className="p-8 lg:p-12 space-y-12"
            >
              <div className="max-w-4xl mx-auto space-y-12">
                 <div className="text-center space-y-4">
                    <h2 className="text-4xl font-serif font-black italic text-brand-primary">Style Decision Engine</h2>
                    <p className="text-brand-primary/40 text-sm max-w-xl mx-auto leading-relaxed">
                      Die ultimative KI-Entscheidungshilfe. Wir vergleichen Trends, deine Biometrie und deine Favoriten für den perfekten Look.
                    </p>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: TrendingUp, title: "Trend-Score", value: "94%", detail: "In deiner Region aktuell hoch im Trend.", color: "bg-blue-50 text-blue-600" },
                      { icon: ShieldCheck, title: "Symmetrie-Match", value: "100%", detail: "Optimal für deine ovale Gesichtsform.", color: "bg-green-50 text-green-600" },
                      { icon: Award, title: "Premium Wahl", value: "Expert", detail: "Empfohlen von unseren Top-Stylisten.", color: "bg-purple-50 text-purple-600" }
                    ].map((card, i) => (
                      <div key={i} className="p-8 bg-white border border-black/5 rounded-[3rem] space-y-6 hover:shadow-xl transition-all">
                        <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center`}>
                           <card.icon size={24} />
                        </div>
                        <div className="space-y-1">
                           <p className="text-xs font-black uppercase tracking-widest text-brand-primary/40">{card.title}</p>
                           <p className="text-3xl font-serif font-black italic">{card.value}</p>
                        </div>
                        <p className="text-xs text-brand-primary/60 leading-relaxed italic">{card.detail}</p>
                      </div>
                    ))}
                 </div>

                 <div className="p-12 bg-brand-primary text-white rounded-[4rem] flex flex-col md:flex-row items-center gap-12 shadow-2xl shadow-brand-primary/20 relative overflow-hidden">
                    {/* Abstract background blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FF9EBE]/10 rounded-full blur-2xl -ml-24 -mb-24" />

                    <div className="w-48 h-48 bg-white/10 backdrop-blur-xl rounded-[3rem] flex items-center justify-center shrink-0 border border-white/20">
                       <Zap size={64} className="text-[#FF9EBE] animate-pulse" />
                    </div>
                    <div className="space-y-6 text-center md:text-left">
                       <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Unser Top-Pick heute</p>
                          <h3 className="text-4xl font-serif font-black italic">Der "Curtain-Cut" Bob</h3>
                       </div>
                       <p className="text-sm opacity-80 leading-relaxed max-w-md italic">
                          "Basierend auf deiner Analyse heute: Dieser Schnitt kombiniert deine Vorlieben für Medium-Length mit einer Struktur, die deine Wangenknochen perfekt betont."
                       </p>
                       <div className="flex flex-wrap justify-center md:justify-start gap-3">
                          <button 
                            onClick={() => { setSelectedStyleId('lib-5'); setActiveModule('lab'); }}
                            className="px-8 py-4 bg-[#FF9EBE] text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#FF9EBE]/20"
                          >
                            Style anprobieren
                          </button>
                          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all">
                            Trend-Info
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
      </div>

      {/* Footer Status Bar */}
      <footer className="px-8 py-4 border-t border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedStyleId ? 'bg-green-500' : 'bg-brand-primary/10 animate-pulse'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Style: {selectedStyleId || 'ausstehend'}</span>
             </div>
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedColorId ? 'bg-green-500' : 'bg-brand-primary/10 animate-pulse'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Farbe: {selectedColorId || 'ausstehend'}</span>
             </div>
          </div>
          {isGenerating && (
             <div className="flex items-center gap-3">
                <Loader2 className="animate-spin text-[#FF9EBE]" size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE] animate-pulse">Rendering läuft...</span>
             </div>
          )}
      </footer>
    </div>
  );
}
