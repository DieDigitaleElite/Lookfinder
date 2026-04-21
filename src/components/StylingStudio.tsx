import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Camera, 
  Scissors, 
  Palette,
  Check,
  RotateCcw,
  Loader2,
  X
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
  onImageUpload: (image: string, mimeType: string) => void;
  // Optional legacy props for compatibility
  faceAnalysis?: any;
  onAnalyzeFace?: () => Promise<void>;
  userSketch?: string | null;
  isGeneratingSketch?: boolean;
  onGenerateFashionSketch?: (styleName: string) => Promise<string | null>;
}

export default function StylingStudio({ 
  image, 
  onTryOn, 
  isGenerating, 
  onImageUpload
}: StylingStudioProps) {
  const [selectedCategory, setSelectedCategory] = useState(HAIRSTYLE_CATEGORIES[0].id);
  const [selectedWorld, setSelectedWorld] = useState(COLOR_WORLDS[0].id);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredStyles = useMemo(() => 
    HAIRSTYLE_LIBRARY.filter(s => s.category === selectedCategory),
  [selectedCategory]);

  const filteredColors = useMemo(() => 
    HAIR_COLORS.filter(c => c.world === selectedWorld),
  [selectedWorld]);

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

  const currentStyle = useMemo(() => 
    HAIRSTYLE_LIBRARY.find(s => s.id === selectedStyleId),
  [selectedStyleId]);

  const currentColor = useMemo(() => 
    HAIR_COLORS.find(c => c.id === selectedColorId),
  [selectedColorId]);

  const handleStartSim = () => {
    if (currentStyle && currentColor) {
      // Defaulting to daylight for simplicity as user requested "simpler"
      onTryOn(currentStyle, currentColor, LIGHTING_SIMULATIONS[0]);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative overflow-hidden font-sans text-brand-primary">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-32">
        <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 space-y-16">
          
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
              {filteredStyles.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStyleId(s.id)}
                  className={`group relative p-3 rounded-[1.5rem] border-2 transition-all overflow-hidden ${
                    selectedStyleId === s.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5 ring-4 ring-[#FF9EBE]/5' : 'border-black/5 bg-white'
                  }`}
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-black/5">
                    <img 
                      src={`https://images.unsplash.com/photo-${
                        s.category === 'short' ? '1595475243692-3a37549ebab0' :
                        s.category === 'medium' ? '1580618672591-eb180b1a973f' :
                        s.category === 'long' ? '1519702581692-0b73c4d7ec68' :
                        s.category === 'trends' ? '1620331311520-246422ff83f9' :
                        s.category === 'men' ? '1621605815971-fbc98d665033' :
                        '1552337360788-8b13df793f1f'
                      }?auto=format&fit=crop&q=40&w=300&h=400`} 
                      className={`w-full h-full object-cover transition-opacity ${selectedStyleId === s.id ? 'opacity-100' : 'opacity-40 grayscale contrast-125'}`}
                      referrerPolicy="no-referrer"
                    />
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
              ))}
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
                    selectedColorId === c.id ? 'border-[#FF9EBE] bg-[#FF9EBE]/5' : 'border-black/5'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg shadow-inner" style={{ backgroundColor: c.hex }} />
                  <span className={`text-[10px] font-bold ${selectedColorId === c.id ? 'text-brand-primary' : 'text-brand-primary/40'}`}>
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Action Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-black/5 z-50">
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
    </div>
  );
}
