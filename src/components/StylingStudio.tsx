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
  History
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
  onImageUpload: (image: string, mimeType: string) => void;
  avatarSketch?: string | null;
  isPremium?: boolean;
  preGeneratedSketches?: Record<string, string>;
  isGeneratingBackground?: boolean;
}

export default function StylingStudio({ 
  image, 
  onTryOn, 
  isGenerating, 
  onImageUpload,
  avatarSketch,
  isPremium = false,
  preGeneratedSketches = {},
  isGeneratingBackground = false
}: StylingStudioProps) {
  const [selectedCategory, setSelectedCategory] = useState(HAIRSTYLE_CATEGORIES[0].id);
  const [selectedWorld, setSelectedWorld] = useState(COLOR_WORLDS[0].id);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStyles = useMemo(() => 
    HAIRSTYLE_LIBRARY.filter(s => s.category === selectedCategory),
  [selectedCategory]);

  const currentStyle = useMemo(() => 
    HAIRSTYLE_LIBRARY.find(s => s.id === selectedStyleId),
  [selectedStyleId]);

  const filteredColors = useMemo(() => 
    HAIR_COLORS.filter(c => c.world === selectedWorld),
  [selectedWorld]);

  const currentColor = useMemo(() => 
    HAIR_COLORS.find(c => c.id === selectedColorId),
  [selectedColorId]);

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

  const handleStartSim = () => {
    if (!isPremium) {
      setShowPaywall(true);
      return;
    }
    if (currentStyle && currentColor) {
      // Defaulting to daylight for simplicity as user requested "simpler"
      onTryOn(currentStyle, currentColor, LIGHTING_SIMULATIONS[0]);
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
              Wähle dein Foto, deinen Schnitt und deine Farbe. Wir berechnen dein neues Ich in HD-Qualität.
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
                  <img src={image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
                          src={sketchUrl}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full relative">
                          {avatarSketch ? (
                            <img 
                              src={avatarSketch}
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
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black">3</div>
              <h3 className="text-lg font-black uppercase tracking-widest">Die Nuance</h3>
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
            <div className="flex flex-wrap gap-3">
              {filteredColors.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColorId(c.id)}
                  className={`flex items-center gap-3 p-2 pr-4 rounded-xl border-2 transition-all ${
                    selectedColorId === c.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5' : 'border-black/5 bg-white'
                  }`}
                >
                  <div 
                    className="w-10 h-10 rounded-lg shadow-inner relative overflow-hidden group/color" 
                    style={{ backgroundColor: c.hex }}
                  >
                    {/* Subtle shine/texture overlay */}
                    <div className="absolute inset-0 bg-linear-to-tr from-black/20 via-transparent to-white/30" />
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_100%)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${selectedColorId === c.id ? 'text-brand-primary' : 'text-brand-primary/40'}`}>
                      {c.name}
                    </span>
                    <span className="text-[8px] opacity-30 truncate max-w-[100px] leading-tight group-hover/color:opacity-60 transition-opacity">
                      {c.description.split(' ')[0]}...
                    </span>
                  </div>
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
          </div>
          
          <button
            onClick={handleStartSim}
            disabled={isGenerating || !image || !selectedStyleId || !selectedColorId}
            className="w-full md:w-auto px-12 py-5 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-brand-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Analysiere...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Simulieren</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conversion Trigger Paywall */}
      <AnimatePresence>
        {showPaywall && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaywall(false)}
              className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF9EBE]/10 rounded-full blur-3xl -mr-20 -mt-20" />
              
              <button 
                onClick={() => setShowPaywall(false)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-[#FF9EBE]/10 rounded-3xl flex items-center justify-center mx-auto text-[#FF9EBE]">
                  <Palette size={40} />
                </div>
                <h3 className="text-3xl font-serif font-bold italic">Upgrade erforderlich</h3>
                <p className="text-brand-primary/60 text-sm leading-relaxed">
                  Das Styling Studio mit unbegrenzten HD-Simulationen, allen Farbtönen und Licht-Szenarien ist unseren Premium-Mitgliedern vorbehalten.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Unlimitierte Styles</p>
                    <p className="text-[10px] text-emerald-700">Probiere alle 50+ Frisuren beliebig oft aus.</p>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FF9EBE] text-white flex items-center justify-center shrink-0">
                    <History size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-900">HD-Qualität</p>
                    <p className="text-[10px] text-blue-700">Erhalte fotorealistische Ergebnisse in Profi-Auflösung.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button 
                  onClick={() => {
                    setShowPaywall(false);
                    // Emit custom event that App.tsx will listen to
                    window.dispatchEvent(new CustomEvent('show-pricing-modal'));
                  }}
                  className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-transform"
                >
                  Premium Mitglied werden
                </button>
                <p className="text-[10px] text-center text-brand-primary/30 font-bold uppercase tracking-widest">
                  Jederzeit kündbar • Ab 9,99€ / Monat
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
