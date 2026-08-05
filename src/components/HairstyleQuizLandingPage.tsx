import React, { useEffect, useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Scissors, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Target, 
  ChevronRight, 
  ArrowRight, 
  HelpCircle, 
  Heart,
  Check,
  Star,
  Palette,
  Droplet,
  Users,
  ChevronDown,
  Scan,
  HelpCircle as QuestionIcon,
  Smile,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HairstyleQuizLandingPageProps {
  onStartAnalysis: () => void;
}

export default function HairstyleQuizLandingPage({ onStartAnalysis }: HairstyleQuizLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic SEO Setup: document title, meta tags, and structured JSON-LD schema
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Test: Welche Frisur passt zu mir? – Kostenloser KI-Frisuren-Test | Frisuren.ai";

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Welche Frisur passt zu mir? Mache jetzt den kostenlosen KI-Gesichtsform-Test mit deinem Foto. Erhalte in 3 Sek. 9 perfekte Frisurenvorschläge, Pflegetipps & Farbberatung!');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (canonical) {
      canonical.setAttribute('href', 'https://frisuren.ai/test-welche-frisur-passt-zu-mir');
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-quiz-jsonld';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Frisuren.ai - Test: Welche Frisur passt zu mir?",
          "operatingSystem": "All (Web Browser, iOS, Android)",
          "applicationCategory": "LifestyleApplication",
          "description": "Der präziseste Online-Test 'Welche Frisur passt zu mir?'. KI-basierte Gesichtsformanalyse, automatische Typberatung, Pflegetipps und virtuelles Styling.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "21400"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
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
      const injectedScript = document.getElementById('seo-quiz-jsonld');
      if (injectedScript) injectedScript.remove();
    };
  }, []);

  const faceShapeGuides = [
    {
      shape: "Ovales Gesicht",
      tagline: "Die ideale Balance",
      description: "Ein ovales Gesicht hat ausgeglichene Proportionen. Zu dir passen fast alle Längen – von raspelkurz bis hin zu langen Stufen.",
      recommendedCuts: ["Butterfly Cut", "Bob mit Seitenscheitel", "Pixie Cut"],
      colorTip: "Warme Balayage- oder Schokotöne heben die Symmetrie hervorragend hervor."
    },
    {
      shape: "Rundes Gesicht",
      tagline: "Sanfte Konturen strecken",
      description: "Wangen und Gesichtslänge sind ähnlich breit. Ziel des Tests ist es, das Gesicht optisch zu verlängern.",
      recommendedCuts: ["Long Bob (Lob)", "Frisuren mit Oberkopf-Volumen", "Asymmetrischer Schnitt"],
      colorTip: "Dunklere Nuancen an den Seiten verfeinern die Gesichtskontur."
    },
    {
      shape: "Eckiges Gesicht",
      tagline: "Markante Kieferlinie weichzeichnen",
      description: "Stirn, Wangen und Kiefer sind ähnlich breit. Stufige Schnitte nehmen dem Gesicht die Strenge.",
      recommendedCuts: ["Soft Layers", "Fransen-Pony (Curtain Bangs)", "Wavy Shag"],
      colorTip: "Sanfte Reflexe um das Gesicht (Face Framing) lassen harte Kanten weicher wirken."
    },
    {
      shape: "Herzförmiges Gesicht",
      tagline: "Breite Stirn & schmales Kinn",
      description: "Die Stirn ist breiter, das Kinn läuft spitz zu. Fülle auf Kinn-Höhe sorgt für die perfekte Balance.",
      recommendedCuts: ["Kinnlanger French Bob", "Seitlicher Pony", "Schulterlange Wellen"],
      colorTip: "Hellere Spitzen lenken den Blick harmonisch auf die Kinnpartie."
    }
  ];

  const featuresList = [
    {
      icon: <Scan className="w-6 h-6 text-[#FF9EBE]" />,
      title: "1. KI-Test mit kostenlosem Bild",
      description: "Einfach Foto hochladen – die KI scannt in Sekundenschnelle Wangenknochen, Stirn- & Kinnlinie zur exakten Gesichtsform-Bestimmung."
    },
    {
      icon: <Scissors className="w-6 h-6 text-[#FF9EBE]" />,
      title: "2. 9 passende Frisuren-Empfehlungen",
      description: "Du erhältst ein maßgeschneidertes Portfolio aus 9 Frisuren, die perfekt zu deiner Gesichtsstruktur und deinem Typ passen."
    },
    {
      icon: <Droplet className="w-6 h-6 text-[#FF9EBE]" />,
      title: "3. Haar-Analyse & Pflegetipps",
      description: "Erfahre, welche Pflegeprodukte deine Haarstruktur am besten stärken und erhalte konkrete Do's & Don'ts für dein tägliches Styling."
    },
    {
      icon: <Palette className="w-6 h-6 text-[#FF9EBE]" />,
      title: "4. Typgerechte Farbberatung",
      description: "Der Test ermittelt 3 individuelle Haarfarben-Empfehlungen, die deinem Teint und deinen Augen maximale Strahlkraft verleihen."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FF9EBE]" />,
      title: "5. Virtuelles Styling Studio",
      description: "Teste alternative Haarfarben oder verändere Haarlängen fotorealistisch direkt auf deinem hochgeladenen Bild."
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF9EBE]" />,
      title: "6. WhatsApp-Freunde-Umfrage",
      description: "Du kannst dich nicht entscheiden? Erstelle mit 1 Klick eine kostenlose Umfrage und lass deine Freunde für deinen besten Look abstimmen."
    }
  ];

  return (
    <div className="space-y-16 md:space-y-32 pb-24 text-brand-primary">
      
      {/* HERO SECTION */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center space-y-8 py-8 md:py-12 px-4"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF9EBE]/15 text-[#FF9EBE] rounded-full text-xs font-black uppercase tracking-widest border border-[#FF9EBE]/30 shadow-sm">
            <Compass size={14} className="animate-spin" style={{ animationDuration: '12s' }} />
            <span>Kostenloser Online-Test 2026 – In 3 Sekunden zum Ergebnis</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            Test: <span className="italic text-[#FF9EBE]">Welche Frisur passt zu mir?</span>
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed">
            Mache jetzt den präzisesten KI-gestützten Frisuren-Test! Lade ein kostenloses Bild hoch – unsere KI analysiert deine Gesichtsform, schlägt dir 9 perfekt passende Frisuren vor und liefert dir maßgeschneiderte Pflegetipps und Farbberatung.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-brand-primary/20 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload size={18} className="text-[#FF9EBE]" />
            <span>Jetzt Foto hochladen & Test starten</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/50">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF9EBE]" /> Erstanalyse mit Bild gratis</span>
            <span className="opacity-25">•</span>
            <span>Keine Registrierung erforderlich</span>
            <span className="opacity-25">•</span>
            <span>100% fotorealistisch</span>
          </div>
        </div>

        {/* User Rating */}
        <div className="pt-6 flex items-center justify-center gap-4 text-xs text-brand-primary/60">
          <div className="flex -space-x-2">
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80" alt="Nutzerin" />
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80" alt="Nutzer" />
            <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80" alt="Nutzerin" />
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
            <span className="text-[11px] text-brand-primary/50">Über 85.000+ erfolgreiche Frisuren-Tests</span>
          </div>
        </div>
      </motion.section>

      {/* QUICK FACE SHAPE TEST MATRIX */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Gesichtsform-Übersicht</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Welche Frisur passt zu welcher Gesichtsform?</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Der Schlüssel zum perfekten Haarschnitt liegt in der Geometrie deines Gesichts. Unsere KI erkennt deine Gesichtsform automatisch im Test.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faceShapeGuides.map((guide, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl space-y-5 hover:border-[#FF9EBE]/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-[#FF9EBE]/15 text-[#FF9EBE] rounded-full text-xs font-bold uppercase tracking-wider">
                  {guide.shape}
                </span>
                <span className="text-xs font-serif italic text-brand-primary/50">{guide.tagline}</span>
              </div>

              <p className="text-xs md:text-sm text-brand-primary/70 leading-relaxed">
                {guide.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-black/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary/40">Empfohlene Schnitte:</span>
                <div className="flex flex-wrap gap-2">
                  {guide.recommendedCuts.map((cut, cIdx) => (
                    <span key={cIdx} className="px-3 py-1 bg-black/5 text-brand-primary rounded-xl text-xs font-semibold">
                      ✓ {cut}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-pink-50/50 rounded-xl border border-pink-100 text-xs text-brand-primary/80">
                <strong className="text-[#FF9EBE]">Farbtipp:</strong> {guide.colorTip}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMPLETE FEATURE SET */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Testergebnis im Detail</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Das beinhaltet dein persönliches Frisuren-Testergebnis</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Frisuren.ai ist mehr als ein einfacher Foto-Filter: Du erhältst eine umfassende KI-Typberatung inklusive Pflegetipps und virtueller Anprobe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl space-y-4 hover:shadow-2xl hover:border-[#FF9EBE]/40 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FF9EBE]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold font-serif">{item.title}</h3>
              <p className="text-xs md:text-sm text-brand-primary/70 leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW THE TEST WORKS - 3 EASY STEPS */}
      <section className="max-w-5xl mx-auto px-4 py-12 bg-gradient-to-br from-white via-pink-50/30 to-amber-50/20 rounded-[3rem] border border-[#FF9EBE]/20 shadow-xl">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Einfacher Ablauf</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">So machst du den Frisuren-Test in 3 einfachen Schritten</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-lg font-serif">Foto hochladen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Lade ein gutes Selfie hoch (von vorne, ohne verdecktes Gesicht). Es ist keine Registrierung nötig.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-lg font-serif">KI-Analyse abwarten</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                In 3 Sekunden bestimmt die KI deine Gesichtsform, berechnet 9 Frisurenvorschläge und erstellt deine Pflegetipps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#FF9EBE] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-lg font-serif">Ergebnisse entdecken</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Sieh sofort dein kostenloses Vorschau-Ergebnis, teste Haarfarben im Studio oder befrage deine Freunde per Umfrage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO ARTICLE: WELCHE FRISUR PASST ZU MIR? */}
      <article className="max-w-4xl mx-auto px-4 space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-sm text-brand-primary/80 text-sm md:text-base leading-relaxed">
        <div className="space-y-4 border-b border-black/10 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Ratgeber & Typberatung</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-primary">
            Test: Welche Frisur passt wirklich zu mir? Der große KI-Guide 2026
          </h2>
        </div>

        <p>
          Die Frage <strong>„Welche Frisur passt zu mir?“</strong> beschäftigt Frauen und Männer gleichermaßen, wenn ein Umstyling oder der nächste Friseurbesuch bevorsteht. Bisher musste man auf Zeitschriften-Fotos hoffen oder sich auf die bloße Vermutung des Friseurs verlassen. Mit moderner Künstlicher Intelligenz (KI) lässt sich diese Frage heute wissenschaftlich und fotorealistisch beantworten.
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          1. Die Gesichtsform als entscheidender Faktor
        </h3>
        <p>
          Jede Frisur verändert die optischen Proportionen des Gesichts. Ein zu langer Pony kann ein schmales Gesicht drückend wirken lassen, während ein fehlendes Oberkopf-Volumen ein rundes Gesicht noch breiter erscheinen lässt. Unser KI-Test misst millimetergenau das Verhältnis zwischen Stirnhöhe, Wangenabstand und Kinnwinkel.
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          2. Haarstruktur & Haardichte einbeziehen
        </h3>
        <p>
          Ein Haarschnitt sieht an dickem, gewelltem Haar völlig anders aus als an feinem, glattem Haar. Deshalb analysiert Frisuren.ai im Test nicht nur deine Gesichtsform, sondern liefert dir auch individuelle <strong>Pflegetipps</strong> und Produktempfehlungen für deine spezifische Haarstruktur.
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          3. Der Vorteil des digitalen Vorab-Tests
        </h3>
        <p>
          Ein radikaler Haarschnitt lässt sich nicht rückgängig machen. Ein Fehlkauf beim Friseur erfordert oft monatelanges Warten. Der kostenlose KI-Frisuren-Test gibt dir die Sicherheit, exakt zu wissen, wie dir ein Cut steht – noch bevor die erste Strähne fällt!
        </p>

        <div className="p-6 bg-[#FF9EBE]/10 rounded-2xl border border-[#FF9EBE]/30 my-4 space-y-2">
          <h4 className="font-bold text-brand-primary flex items-center gap-2">
            <Sparkles size={16} className="text-[#FF9EBE]" />
            Bereit für deinen persönlichen Test?
          </h4>
          <p className="text-xs text-brand-primary/70">
            Lade jetzt dein Bild hoch und erfahre in 3 Sekunden, welche Frisuren dir am besten stehen!
          </p>
        </div>
      </article>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[#FF9EBE] text-xs font-bold uppercase tracking-widest">
            <HelpCircle size={16} />
            <span>Häufig gestellte Fragen zum Frisuren-Test</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">FAQ: Welche Frisur passt zu mir?</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
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

      {/* BOTTOM CONVERSION CTA */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-10 md:p-16 bg-[#FF9EBE] rounded-[3rem] text-white text-center space-y-8 relative overflow-hidden shadow-2xl shadow-[#FF9EBE]/30">
          <div className="relative space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold italic text-[#1a1a1a] leading-tight">
              Test starten: Welche Frisur passt zu mir? ✂️
            </h2>
            <p className="text-brand-primary/90 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium">
              Finde es jetzt heraus! Lade kostenlos ein Foto hoch und erhalte in wenigen Sekunden dein Ergebnis inklusive 9 Frisurenvorschlägen, Pflegetipps & Farbberatung.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-brand-primary text-white font-black rounded-2xl hover:bg-black hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Jetzt kostenlosen Test mit Bild starten</span>
              <ArrowRight size={16} className="text-[#FF9EBE]" />
            </button>
            
            <p className="mt-6 text-[10px] text-brand-primary/70 font-bold uppercase tracking-[0.2em] flex flex-wrap items-center justify-center gap-3">
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

const faqs = [
  {
    q: "Wie funktioniert der Test 'Welche Frisur passt zu mir?'",
    a: "Du lädst einfach ein Selfie von dir hoch. Unsere Künstliche Intelligenz (KI) analysiert in 3 Sekunden deine Gesichtsform (oval, rund, eckig, herzförmig) sowie deine Gesichtsproportionen und generiert daraufhin 9 exakt abgestimmte Frisuren-Vorschläge."
  },
  {
    q: "Ist der Frisuren-Test wirklich kostenlos?",
    a: "Ja! Du kannst ein Foto hochladen und die Erstanalyse inklusive Gesichtsformbestimmung, Pflegetipps, Farbtipps und deinem ersten Frisuren-Vorschaubild völlig kostenlos durchführen."
  },
  {
    q: "Werden mir auch Pflegetipps und Haarfarben empfohlen?",
    a: "Ja, der Test beinhaltet eine vollständige Haar-Analyse. Du erhältst individuelle Pflegetipps für deine Haarstruktur, Styling Do's & Don'ts sowie 3 konkrete Farbtipps für deinen Hautton."
  },
  {
    q: "Kann ich den Test ohne Registrierung oder App-Download machen?",
    a: "Absolut! Der Frisuren-Test läuft direkt im Browser auf deinem Handy, Tablet oder Computer. Du musst keine App aus dem App Store herunterladen und dich für den Teststart nicht registrieren."
  },
  {
    q: "Wie realistisch sind die Testergebnisse?",
    a: "Unsere modernste KI-Technologie (Stand 2026) behält dein Gesicht zu 100% originalgetreu bei und passt lediglich die Haarschnitte fotorealistisch an deine Kopfform an. So sieht das Ergebnis aus wie ein echtes Foto von dir nach dem Friseur."
  },
  {
    q: "Kann ich Freunde fragen, welche Frisur sie am besten finden?",
    a: "Ja! Zu jedem Testergebnis kannst du mit 1 Klick einen kostenlosen Umfrage-Link erstellen und per WhatsApp an deine Freunde schicken, damit sie für deinen neuen Look abstimmen."
  }
];
