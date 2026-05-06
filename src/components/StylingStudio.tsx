import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Camera, 
  Scissors, 
  Palette,
  Check,
  RotateCcw,
  Loader2,
  X,
  History,
  Zap,
  ArrowRightLeft,
  ShieldCheck,
  Star,
  Clock,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HAIRSTYLE_LIBRARY, 
  HAIRSTYLE_CATEGORIES, 
  HAIR_COLORS, 
  HAIR_TECHNOLOGIES,
  COLOR_WORLDS,
  LIGHTING_SIMULATIONS 
} from '../constants';

interface StylingStudioProps {
  image: string | null;
  onTryOn: (style: any, color: any, tech: any, lighting: any) => Promise<void>;
  isGenerating: boolean;
  onImageUpload: (image: string, mimeType: string) => void;
  avatarSketch?: string | null;
  isPremium?: boolean;
  preGeneratedSketches?: Record<string, string>;
  isPremiumFetching?: boolean;
  isGeneratingBackground?: boolean;
  onCheckout?: (plan: 'single' | 'monthly' | 'yearly') => void;
  onOpenLegalModal?: (modal: 'impressum' | 'datenschutz' | 'agb' | 'widerruf') => void;
}

export default function StylingStudio({ 
  image, 
  onTryOn, 
  isGenerating, 
  onImageUpload,
  avatarSketch,
  isPremium = false,
  preGeneratedSketches = {},
  isGeneratingBackground = false,
  onCheckout,
  onOpenLegalModal
}: StylingStudioProps) {
  const [selectedCategory, setSelectedCategory] = useState(HAIRSTYLE_CATEGORIES[0].id);
  const [selectedWorld, setSelectedWorld] = useState(COLOR_WORLDS[0].id);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string>(HAIR_TECHNOLOGIES[0].id);
  const [showPaywall, setShowPaywall] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToWiderruf, setAgreedToWiderruf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStyles = useMemo(() => 
    HAIRSTYLE_LIBRARY.filter(s => s.category === selectedCategory),
  [selectedCategory]);

  const currentStyle = useMemo(() => 
    HAIRSTYLE_LIBRARY.find(s => s.id === selectedStyleId),
  [selectedStyleId]);

  const filteredColors = useMemo(() => 
    HAIR_COLORS.filter(c => (c.world === selectedWorld || c.world === 'all') && c.id !== 'col-original'),
  [selectedWorld]);

  const currentColor = useMemo(() => 
    HAIR_COLORS.find(c => c.id === selectedColorId),
  [selectedColorId]);

  const currentTech = useMemo(() => 
    HAIR_TECHNOLOGIES.find(t => t.id === selectedTechId),
  [selectedTechId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onImageUpload(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeSketch = useMemo(() => {
    if (selectedStyleId && preGeneratedSketches?.[selectedStyleId]) {
      return preGeneratedSketches[selectedStyleId];
    }
    return avatarSketch;
  }, [selectedStyleId, preGeneratedSketches, avatarSketch]);

  const [isSimulatingPrePaywall, setIsSimulatingPrePaywall] = useState(false);

  const handleStartSim = async () => {
    if (!image || !selectedStyleId || !selectedColorId) return;

    if (!isPremium) {
      setIsSimulatingPrePaywall(true);
      // Wait to create anticipation
      await new Promise(r => setTimeout(r, 1500));
      setIsSimulatingPrePaywall(false);
      setShowPaywall(true);
      return;
    }
    
    if (currentStyle && currentColor) {
      onTryOn(currentStyle, currentColor, currentTech || HAIR_TECHNOLOGIES[0], LIGHTING_SIMULATIONS[0]);
    }
  };

  return (
    <div className="h-full w-full bg-white overflow-y-auto overflow-x-hidden scroll-smooth font-sans text-brand-primary flex flex-col relative custom-scrollbar overscroll-contain">
      <div className="flex-1 min-h-0">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-16 pb-32">
          
          {/* Header */}
          <header className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-black italic">Styling Studio</h2>
            <p className="text-brand-primary/40 text-sm md:text-base max-w-xl">
              Wähle dein Foto, deinen Schnitt und deine Farbe. Wir erschaffen dein neues Ich in atemberaubender HD-Qualität.
            </p>
          </header>

          {/* STEP 1: PORTRAIT */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black">1</div>
              <h3 className="text-lg font-black uppercase tracking-widest">Dein Foto</h3>
            </div>

            <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-[2rem] overflow-hidden bg-black/5 border-2 border-dashed border-black/10 flex items-center justify-center group transition-all hover:border-brand-primary/20">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {image ? (
                <div className="w-full h-full relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <img src={image || undefined} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={48} />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center gap-4 transition-transform hover:scale-105"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-brand-primary/20">
                    <Camera size={40} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Foto hochladen</p>
                </button>
              )}
            </div>
          </section>

          {/* STEP 2: STYLE */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black">2</div>
              <h3 className="text-lg font-black uppercase tracking-widest">Der Schnitt</h3>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
              {HAIRSTYLE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                    selectedCategory === cat.id ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/10'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Style Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredStyles.map(s => {
                const sketchUrl = preGeneratedSketches[s.id];
                const hasSketch = !!sketchUrl;

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStyleId(s.id)}
                    className={`group relative p-3 rounded-[1.5rem] border-2 transition-all overflow-hidden ${
                      selectedStyleId === s.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5 ring-4 ring-[#FF9EBE]/5' : 'border-black/5 bg-white'
                    }`}
                  >
                    <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-black/5 relative">
                      {hasSketch ? (
                        <motion.img 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={sketchUrl || undefined}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full relative">
                          {avatarSketch ? (
                            <img 
                              src={avatarSketch || undefined}
                              className="w-full h-full object-cover opacity-30 grayscale"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Scissors className="text-brand-primary/5" size={48} />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                             {isGeneratingBackground ? (
                               <>
                                 <Loader2 className="animate-spin text-brand-primary/40" size={24} />
                                 <p className="text-[8px] font-black uppercase tracking-widest text-brand-primary/20">Wird gezeichnet...</p>
                               </>
                             ) : (
                               !hasSketch && avatarSketch && (
                                 <div className="w-2 h-2 rounded-full bg-brand-primary/10 animate-pulse" />
                               )
                             )}
                          </div>
                        </div>
                      )}
                      
                      {/* Top corner info */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/10 rounded-full text-[8px] font-bold text-black/40 uppercase tracking-widest backdrop-blur-sm">
                         {s.name}
                      </div>
                    </div>
                    <p className={`text-[10px] font-black uppercase tracking-wider text-center ${selectedStyleId === s.id ? 'text-brand-primary' : 'text-brand-primary/40'}`}>
                      {s.name}
                    </p>
                    {selectedStyleId === s.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-[#FF9EBE] text-white rounded-full flex items-center justify-center shadow-lg">
                        <Check size={14} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 3: COLOR */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black">3</div>
                <h3 className="text-lg font-black uppercase tracking-widest">Die Nuance</h3>
              </div>
              
              <button
                onClick={() => setSelectedColorId(selectedColorId === 'col-original' ? null : 'col-original')}
                className={`px-6 py-3 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 active:scale-95 ${
                  selectedColorId === 'col-original' 
                    ? 'border-[#FF9EBE] bg-[#FF9EBE]/5 text-brand-primary shadow-lg shadow-[#FF9EBE]/10' 
                    : 'border-black/5 bg-white text-brand-primary/40 hover:border-black/10'
                }`}
              >
                <RotateCcw size={14} className={selectedColorId === 'col-original' ? 'text-[#FF9EBE]' : ''} />
                <span>Ursprüngliche Farbe beibehalten</span>
              </button>
            </div>

            {/* Color Worlds */}
            <div className="flex gap-2 p-1 bg-black/5 rounded-2xl">
              {COLOR_WORLDS.map(world => (
                <button
                  key={world.id}
                  onClick={() => setSelectedWorld(world.id)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedWorld === world.id ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black/60'
                  }`}
                >
                  {world.name}
                </button>
              ))}
            </div>

            {/* Color Grid */}
            <div className="space-y-6">
              {(() => {
                const groups: Record<string, typeof filteredColors> = {};
                filteredColors.forEach(c => {
                  const t = c.tone || 'General';
                  if (!groups[t]) groups[t] = [];
                  groups[t].push(c);
                });
                
                return Object.entries(groups).map(([tone, colors]) => (
                  <div key={tone} className="space-y-3">
                    {tone !== 'General' && tone !== 'undefined' && tone !== 'null' && (
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary/30 px-1">{tone}</h4>
                    )}
                    <div className="flex flex-wrap gap-3">
                      {colors.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColorId(c.id)}
                          className={`flex items-center gap-3 p-2 pr-4 rounded-xl border-2 transition-all ${
                            selectedColorId === c.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5' : 'border-black/5 bg-white'
                          }`}
                        >
                          <div 
                            className="w-10 h-10 rounded-lg shadow-inner relative overflow-hidden group/color" 
                            style={{ background: c.hex.includes('gradient') ? c.hex : (c.id === 'col-original' ? 'transparent' : c.hex) }}
                          >
                            {/* Subtle shine/texture overlay */}
                            <div className="absolute inset-0 bg-linear-to-tr from-black/20 via-transparent to-white/30" />
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]" />
                          </div>
                          <div className="flex flex-col items-start text-left">
                            <span className={`text-[10px] font-black uppercase tracking-wider ${selectedColorId === c.id ? 'text-brand-primary' : 'text-brand-primary/40'}`}>
                              {c.name}
                            </span>
                            <span className="text-[8px] opacity-30 max-w-[140px] leading-tight group-hover/color:opacity-60 transition-opacity">
                              {c.description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </section>

          {/* STEP 4: TECHNOLOGY (Optionaler Unterpunkt) */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black">4</div>
              <h3 className="text-lg font-black uppercase tracking-widest">Farb-Technik <span className="text-[10px] opacity-40 lowercase tracking-normal">(Optional)</span></h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {HAIR_TECHNOLOGIES.map(tech => (
                <button
                  key={tech.id}
                  onClick={() => setSelectedTechId(tech.id)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-2xl border-2 transition-all min-w-[160px] flex-1 ${
                    selectedTechId === tech.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5' : 'border-black/5 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${selectedTechId === tech.id ? 'text-brand-primary' : 'text-brand-primary/40'}`}>
                      {tech.name}
                    </span>
                    {selectedTechId === tech.id && <Check size={14} className="text-[#FF9EBE]" strokeWidth={4} />}
                  </div>
                  <p className="text-[8px] opacity-30 leading-relaxed text-left">
                    {tech.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Action Footer */}
      <div className="sticky bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-black/5 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
          <div className="hidden md:flex flex-1 gap-8">
             <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Ausgewählter Schnitt</p>
                <p className="text-xs font-bold">{currentStyle?.name || '---'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Wunschfarbe</p>
                <p className="text-xs font-bold">{currentColor?.name || '---'}</p>
             </div>
             <div className="space-y-1">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Farb-Technik</p>
                <p className="text-xs font-bold">{currentTech?.name || 'Klassisch'}</p>
             </div>
          </div>
          
          <button
            onClick={handleStartSim}
            disabled={isGenerating || isSimulatingPrePaywall || !image || !selectedStyleId || !selectedColorId}
            className="w-full md:w-auto px-12 py-5 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3 active:scale-95"
          >
            {isGenerating || isSimulatingPrePaywall ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>{isSimulatingPrePaywall ? 'Dein Gesicht wird analysiert...' : 'Dein neuer Look wird zum Leben erweckt... ✨'}</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Jetzt in Echt sehen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conversion Trigger Paywall */}
      <AnimatePresence>
        {showPaywall && (
          <div className="fixed inset-0 z-[200] overflow-y-auto flex items-start justify-center p-4 py-8 md:py-12 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaywall(false)}
              className="fixed inset-0 cursor-default"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden my-auto"
            >
              {/* Teaser Background / Header */}
              <div className="bg-brand-primary p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9EBE]/20 blur-[100px] -mr-32 -mt-32" />
                <div className="relative z-10 space-y-4">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
                      <Zap size={14} className="text-[#FF9EBE]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">Mapping abgeschlossen</span>
                   </div>
                   <h3 className="text-3xl md:text-4xl font-serif font-bold italic text-white leading-tight">
                     Dein neues Ich ist nur noch <br />
                     <span className="text-[#FF9EBE]">einen Moment entfernt.</span>
                   </h3>
                   <p className="text-white/60 text-sm max-w-md mx-auto leading-relaxed">
                     Die KI hat deine Züge perfekt erfasst. Wir sind bereit, deine Vision vom <span className="text-white font-bold">{currentStyle?.name}</span> in atemberaubender Studio-Qualität zum Leben zu erwecken.
                   </p>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-8">
                {/* Visual Difference */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="aspect-video rounded-2xl bg-black/5 flex items-center justify-center overflow-hidden border border-black/5 opacity-50 relative">
                       <img src={activeSketch || undefined} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                       <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/20 rounded-md text-[8px] font-bold text-white uppercase tracking-widest">Skizze</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="aspect-video rounded-2xl bg-[#FF9EBE]/10 flex items-center justify-center overflow-hidden border border-[#FF9EBE]/20 relative">
                       <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/hair/800/600')] bg-cover opacity-20 blur-md grayscale" />
                       <div className="relative flex flex-col items-center gap-1">
                          <Sparkles size={20} className="text-[#FF9EBE]" />
                          <span className="text-[8px] font-black uppercase tracking-widest text-[#FF9EBE]">HD Studio Quali</span>
                       </div>
                       <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#FF9EBE] rounded-md text-[8px] font-bold text-white uppercase tracking-widest">Premium</div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">!</div>
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Legal Checkboxes */}
                <div className={`space-y-4 p-5 rounded-[2rem] border transition-all ${(!agreedToTerms || !agreedToWiderruf) && error ? 'bg-red-50 border-red-200' : 'bg-black/5 border-transparent'}`}>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms} 
                      onChange={(e) => {
                        setAgreedToTerms(e.target.checked);
                        if (e.target.checked && agreedToWiderruf) setError(null);
                      }}
                      className="mt-1 w-5 h-5 rounded-lg border-black/10 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-[10px] md:text-xs text-brand-primary/60 leading-relaxed font-medium">
                      Ich akzeptiere die <button onClick={() => onOpenLegalModal?.('agb')} className="text-brand-primary font-bold underline">AGB</button> und habe die <button onClick={() => onOpenLegalModal?.('datenschutz')} className="text-brand-primary font-bold underline">Datenschutzerklärung</button> gelesen.
                    </span>
                  </label>
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={agreedToWiderruf} 
                      onChange={(e) => {
                        setAgreedToWiderruf(e.target.checked);
                        if (e.target.checked && agreedToTerms) setError(null);
                      }}
                      className="mt-1 w-5 h-5 rounded-lg border-black/10 text-brand-primary focus:ring-brand-primary"
                    />
                    <span className="text-[10px] md:text-xs text-brand-primary/60 leading-relaxed font-medium">
                      Ich stimme ausdrücklich zu, dass Frisuren.ai vor Ablauf der Widerrufsfrist mit der Ausführung des Vertrags beginnt. Mir ist bekannt, dass ich dadurch mein <button onClick={() => onOpenLegalModal?.('widerruf')} className="text-brand-primary font-bold underline">Widerrufsrecht</button> verliere.
                    </span>
                  </label>
                </div>

                {/* Plans Selection */}
                <div className="grid grid-cols-1 gap-4">
                  {/* Yearly Option - Styling Flatrate */}
                  <button 
                    onClick={() => {
                      if (!agreedToTerms || !agreedToWiderruf) {
                        setError("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
                        return;
                      }
                      onCheckout?.('yearly');
                    }}
                    className="bg-white p-6 rounded-[2rem] border-4 border-[#FF9EBE] shadow-xl relative overflow-hidden flex flex-col text-left group hover:scale-[1.02] transition-transform"
                  >
                    <div className="absolute top-0 right-0 bg-[#FF9EBE] text-white text-[9px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest animate-pulse">
                      Empfohlen ★
                    </div>
                    <div className="space-y-4 w-full">
                      <div>
                         <h3 className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE] mb-1">Styling-Flatrate</h3>
                         <div className="flex items-baseline gap-2">
                           <span className="text-3xl font-black text-brand-primary">39,99 €</span>
                           <span className="text-sm text-brand-primary/40 font-bold">/ Jahr</span>
                         </div>
                         <p className="text-[10px] font-bold text-[#FF9EBE] uppercase tracking-wider mt-1">Nur 3,33 € / Monat (Spare 66%)</p>
                      </div>

                      <div className="space-y-2 py-3 border-y border-black/5">
                        <p className="text-[10px] text-brand-primary/60 flex items-center gap-2">
                          <Calendar size={12} className="text-[#FF9EBE]" />
                          <span>Vertrag läuft 12 Monate, dann automatisch jährlich verlängerbar</span>
                        </p>
                        <p className="text-[10px] text-brand-primary/60 flex items-center gap-2">
                          <RotateCcw size={12} className="text-[#FF9EBE]" />
                          <span>Jederzeit zum Jahresende kündbar</span>
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Monthly Option */}
                    <button 
                      onClick={() => {
                        if (!agreedToTerms || !agreedToWiderruf) {
                          setError("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
                          return;
                        }
                        onCheckout?.('monthly');
                      }}
                      className="bg-white p-6 rounded-[2rem] border-2 border-black/5 shadow-sm text-left flex flex-col hover:border-[#FF9EBE]/20 transition-all hover:scale-[1.02]"
                    >
                      <div className="relative w-full">
                        <div className="absolute top-0 right-0 bg-brand-primary text-white text-[8px] font-black px-2 py-1 rounded-bl-lg uppercase tracking-widest">BELIEBT ⭐</div>
                        <div className="space-y-4">
                          <div>
                             <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 mb-1">Monatsabo</h3>
                             <div className="flex items-baseline gap-2">
                               <span className="text-2xl font-black text-brand-primary">9,99 €</span>
                               <span className="text-sm text-brand-primary/40 font-bold">/ Monat</span>
                             </div>
                             <p className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-wider mt-1">Maximale Flexibilität</p>
                          </div>
                          <div className="pt-3 border-t border-black/5">
                            <p className="text-[10px] text-brand-primary/60 flex items-center gap-2">
                              <RotateCcw size={12} className="text-brand-primary/20" />
                              <span>Flexibel monatlich kündbar</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Single Unlock Option */}
                    <button 
                      onClick={() => {
                        if (!agreedToTerms || !agreedToWiderruf) {
                          setError("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
                          return;
                        }
                        onCheckout?.('single');
                      }}
                      className="bg-white/50 p-6 rounded-[2rem] border-2 border-black/5 text-left flex flex-col justify-between hover:border-black/10 transition-all hover:scale-[1.02]"
                    >
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40 block mb-2">Einmalig</span>
                        <p className="text-xs font-bold text-brand-primary leading-snug">Schalte dieses eine Bild sofort in HD frei.</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-black/5">
                        <span className="text-lg font-black text-brand-primary">Nur 2,99€</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                    <button 
                     onClick={() => {
                       if (!agreedToTerms || !agreedToWiderruf) {
                         setError("Bitte akzeptiere die AGB und die Widerrufsbelehrung.");
                         return;
                       }
                       onCheckout?.('yearly');
                     }}
                     className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-primary/40 flex items-center justify-center gap-3 hover:scale-[1.01] transition-transform relative overflow-hidden group"
                    >
                     <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                     <span>Meinen neuen Look jetzt erleben</span>
                     <ArrowRightLeft size={18} />
                   </button>
                   
                   <p className="text-[10px] text-center text-brand-primary/40 font-bold">
                      Bereits über 5.000+ Looks heute erstellt. ★★★★★
                   </p>
                   
                   <div className="flex items-center justify-center gap-6 opacity-30">
                      <div className="flex items-center gap-1">
                         <ShieldCheck size={12} />
                         <span className="text-[8px] font-bold uppercase">Sicher & SSL</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <Star size={12} />
                         <span className="text-[8px] font-bold uppercase">Unlimitiert</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <Clock size={12} />
                         <span className="text-[8px] font-bold uppercase">Sofort-Ergebnis</span>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setShowPaywall(false)}
                  className="w-full text-[10px] font-black uppercase tracking-widest text-brand-primary/20 hover:text-brand-primary/40 transition-colors"
                >
                  Vielleicht später – Zurück zur Skizze
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
