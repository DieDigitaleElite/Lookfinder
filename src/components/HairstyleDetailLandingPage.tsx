import React, { useEffect, useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Scissors, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  HelpCircle, 
  Star, 
  ChevronDown, 
  Check, 
  X, 
  Wand2, 
  Sparkle,
  Droplet,
  Info,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HAIRSTYLE_SEO_DATA, HairstyleSeoItem } from '../data/hairstyleSeoData';

interface HairstyleDetailLandingPageProps {
  slug: string;
  onStartAnalysis: () => void;
  onNavigateToSlug?: (slug: string) => void;
}

export default function HairstyleDetailLandingPage({ 
  slug, 
  onStartAnalysis,
  onNavigateToSlug
}: HairstyleDetailLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Find the hairstyle item by slug or alias
  const hairstyleKey = Object.keys(HAIRSTYLE_SEO_DATA).find(key => {
    const item = HAIRSTYLE_SEO_DATA[key];
    return item.slug === slug || (item.aliases && item.aliases.includes(slug));
  }) || 'bob-frisuren-testen';

  const item: HairstyleSeoItem = HAIRSTYLE_SEO_DATA[hairstyleKey];

  // Dynamic SEO Setup: document title, meta tags, and structured JSON-LD schema
  useEffect(() => {
    const prevTitle = document.title;
    document.title = item.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', item.metaDescription);
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (canonical) {
      canonical.setAttribute('href', `https://frisuren.ai/${item.slug}`);
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `seo-${item.slug}-jsonld`;
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": `Frisuren.ai - ${item.name} online testen`,
          "operatingSystem": "All (Web Browser, iOS, Android, Windows, Mac)",
          "applicationCategory": "LifestyleApplication",
          "description": item.metaDescription,
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "29400"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": item.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) metaDesc.setAttribute('content', prevDesc);
      if (canonical && prevCanonical) canonical.setAttribute('href', prevCanonical);
      const injectedScript = document.getElementById(`seo-${item.slug}-jsonld`);
      if (injectedScript) injectedScript.remove();
    };
  }, [item]);

  // List of other hairstyles for internal linking
  const otherHairstyles = Object.values(HAIRSTYLE_SEO_DATA).filter(h => h.slug !== item.slug);

  return (
    <div className="space-y-16 md:space-y-28 pb-24 text-brand-primary">
      
      {/* 1. HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center space-y-8 py-8 md:py-12 px-4"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF9EBE]/15 text-[#FF9EBE] rounded-full text-xs font-black uppercase tracking-widest border border-[#FF9EBE]/30 shadow-sm">
            <Wand2 size={14} className="animate-pulse" />
            <span>{item.heroBadge}</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            {item.heroHeadline}
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed">
            {item.heroSubline}
          </p>
        </div>

        {/* Big CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-brand-primary/20 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload size={18} className="text-[#FF9EBE]" />
            <span>Jetzt Foto hochladen & {item.name} testen</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/50">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF9EBE]" /> Erstanalyse gratis</span>
            <span className="opacity-25">•</span>
            <span>Kein Download nötig</span>
            <span className="opacity-25">•</span>
            <span>100% Fotorealistisch</span>
          </div>
        </div>

        {/* Rating Banner */}
        <div className="pt-4 flex items-center justify-center gap-4 text-xs text-brand-primary/60">
          <div className="flex -space-x-2">
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Nutzerin" />
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Nutzer" />
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Nutzerin" />
          </div>
          <div className="flex flex-col items-start">
            <div className="flex items-center text-amber-400">
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <Star size={12} fill="currentColor" />
              <span className="text-brand-primary font-bold text-xs ml-1">4.9/5</span>
            </div>
            <span className="text-[11px] text-brand-primary/50">Über 1000+ Fotos erfolgreich analysiert</span>
          </div>
        </div>
      </motion.section>

      {/* 2. GESICHTSFORMEN SECTION */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Gesichtsform-Analyse</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Zu welchen Gesichtsformen passt {item.name}?</h2>
          <p className="text-brand-primary/60 text-sm md:text-base max-w-2xl mx-auto">
            Jede Frisur verändert die visuelle Symmetrie deines Gesichts. Erfahre hier, wie der {item.name} mit verschiedenen Gesichtsformen harmoniert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {item.faceShapes.map((fs, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-3xl border transition-all ${
                fs.suitable 
                  ? 'bg-white border-black/10 shadow-md hover:border-[#FF9EBE]' 
                  : 'bg-black/[0.02] border-black/5 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-3">
                <h3 className="font-bold font-serif text-lg text-brand-primary">{fs.shape}</h3>
                {fs.suitable ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Check size={12} /> Ideal geeignet
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                    <Info size={12} /> Bedingt geeignet
                  </span>
                )}
              </div>
              <p className="text-xs md:text-sm text-brand-primary/70 leading-relaxed">
                {fs.reason}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SIMULATOR PREVIEW CARD */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white via-pink-50/40 to-purple-50/20 rounded-[3rem] p-8 md:p-12 border border-[#FF9EBE]/20 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9EBE]/20 text-[#FF9EBE] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
              <Scissors size={12} />
              <span>Virtueller KI-Check</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight">
              Probiere {item.name} direkt an deinem Foto aus!
            </h2>

            <p className="text-brand-primary/70 text-sm md:text-base leading-relaxed">
              {item.description}
            </p>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#FF9EBE]">Ideal für diese Haartypen:</div>
              <div className="flex flex-wrap gap-2">
                {item.idealHairTypes.map((ht, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-black/10 rounded-xl text-xs font-semibold text-brand-primary/80 shadow-xs">
                    {ht}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={onStartAnalysis}
                className="px-8 py-4 bg-brand-primary text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105"
              >
                <span>{item.name} an meinem Foto testen</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border border-black/10 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF9EBE]">Vorteile von {item.name}</span>
              <Sparkles size={16} className="text-[#FF9EBE]" />
            </div>

            <ul className="space-y-3">
              {item.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs md:text-sm text-brand-primary/80 font-medium">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} />
                  </div>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 space-y-1">
              <div className="text-[10px] font-black uppercase text-[#FF9EBE] tracking-wider">Nachschneide-Intervall</div>
              <div className="text-xs font-bold text-brand-primary">{item.trimInterval}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PFLEGE & STYLING RATGEBER */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Profi-Styling & Pflege</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Pflege & Styling Tipps für {item.name}</h2>
          <p className="text-brand-primary/60 text-sm max-w-xl mx-auto">
            So holst du das Maximum aus deinem {item.name} heraus – vom morgendlichen Föhnen bis zur richtigen Pflege.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {item.stylingTips.map((st, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-black/5 shadow-md space-y-3">
              <div className="w-8 h-8 rounded-xl bg-[#FF9EBE]/15 text-[#FF9EBE] flex items-center justify-center font-bold text-xs">
                0{idx + 1}
              </div>
              <h3 className="font-bold text-base font-serif">{st.title}</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-black/5 shadow-sm flex items-start gap-4">
          <Droplet className="w-8 h-8 text-[#FF9EBE] shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-brand-primary">Pflege-Empfehlung für {item.name}</h4>
            <p className="text-xs md:text-sm text-brand-primary/70 leading-relaxed">
              {item.careAdvice}
            </p>
          </div>
        </div>
      </section>

      {/* 5. SEO ARTICLE */}
      <article className="max-w-4xl mx-auto px-4 space-y-6 bg-white p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-sm text-brand-primary/80 text-sm md:text-base leading-relaxed">
        <div className="space-y-3 border-b border-black/10 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Style Guide</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-primary">
            {item.articleContent.heading}
          </h2>
        </div>

        {item.articleContent.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </article>

      {/* 6. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[#FF9EBE] text-xs font-bold uppercase tracking-widest">
            <HelpCircle size={16} />
            <span>Fragen & Antworten</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">FAQ zu {item.name}</h2>
        </div>

        <div className="space-y-4">
          {item.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm md:text-base text-brand-primary hover:text-[#FF9EBE] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#FF9EBE] font-serif font-extrabold text-lg">?</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown size={18} className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#FF9EBE]' : 'text-brand-primary/40'}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-brand-primary/70 leading-relaxed border-t border-black/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. INTERNAL LINKING GRID - WEITERE FRISUREN SEITEN */}
      {otherHairstyles.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 space-y-6 pt-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Programmieren SEO Übersicht</span>
            <h3 className="text-xl md:text-2xl font-serif font-bold">Weitere Frisuren online am Foto testen</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {otherHairstyles.map((oh) => (
              <button
                key={oh.slug}
                onClick={() => {
                  if (onNavigateToSlug) {
                    onNavigateToSlug(oh.slug);
                  } else {
                    window.history.pushState({}, '', `/${oh.slug}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="px-4 py-2 bg-white hover:bg-[#FF9EBE]/10 border border-black/10 hover:border-[#FF9EBE] rounded-full text-xs font-bold text-brand-primary transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>{oh.name} testen</span>
                <ChevronRight size={12} className="text-[#FF9EBE]" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 8. BOTTOM CONVERSION CTA CARD */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-10 md:p-16 bg-[#FF9EBE] rounded-[3rem] text-white text-center space-y-8 relative overflow-hidden shadow-2xl shadow-[#FF9EBE]/30">
          <div className="relative space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold italic text-white leading-tight">
              Jetzt {item.name} an deinem Foto testen! ✂️
            </h2>
            <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium">
              Lade dein Foto hoch und erhalte in wenigen Sekundenschnelle deine kostenlose KI-Simulation von {item.name} inklusive Gesichtsformanalyse, Pflegetipps & Farbberatung.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-white text-[#FF9EBE] font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Foto hochladen & {item.name} testen</span>
              <ArrowRight size={16} />
            </button>
            
            <p className="mt-6 text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] flex flex-wrap items-center justify-center gap-3">
              <span>Keine Registrierung erforderlich</span>
              <span>•</span>
              <span>100% Fotorealistisch</span>
              <span>•</span>
              <span>DSGVO-konform</span>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
