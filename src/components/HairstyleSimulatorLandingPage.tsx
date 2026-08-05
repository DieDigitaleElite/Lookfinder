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
  Cpu,
  Monitor,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HairstyleSimulatorLandingPageProps {
  onStartAnalysis: () => void;
}

export default function HairstyleSimulatorLandingPage({ onStartAnalysis }: HairstyleSimulatorLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic SEO Setup: document title, meta tags, and structured JSON-LD schema
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Frisuren Simulator online – Virtueller KI Frisuren-Simulator auf Foto | Frisuren.ai";

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Frisuren Simulator online: Lade dein Foto hoch & simuliere neue Haarschnitte & Haarfarben fotorealistisch per KI. Gratis Erstanalyse, KI-Gesichtsformbestimmung, Pflegetipps & Farbberatung!');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (canonical) {
      canonical.setAttribute('href', 'https://frisuren.ai/frisuren-simulator');
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-simulator-jsonld';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Frisuren.ai - KI Frisuren Simulator",
          "operatingSystem": "All (Web Browser, iOS, Android, Windows, Mac)",
          "applicationCategory": "LifestyleApplication",
          "description": "Der modernste Online Frisuren Simulator. KI-basierte Fotosimulation von Haarschnitten und Haarfarben, inklusive Gesichtsformanalyse, Pflegetipps & Farbberatung direkt im Browser.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "31200"
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
      const injectedScript = document.getElementById('seo-simulator-jsonld');
      if (injectedScript) injectedScript.remove();
    };
  }, []);

  const featuresList = [
    {
      icon: <Cpu className="w-6 h-6 text-[#FF9EBE]" />,
      title: "KI-gestützter Frisuren Simulator",
      description: "Unsere hochentwickelte KI simuliert neue Haarschnitte und Haarfarben physikalisch korrekt angepasst an dein Gesicht und deine Kopfform."
    },
    {
      icon: <Scan className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Erstanalyse mit kostenlosem Bild",
      description: "Lade ein Foto hoch: Der Frisuren Simulator bestimmt automatisch deine Gesichtsform (oval, rund, eckig, herzförmig) und Stirn- sowie Kinnproportionen."
    },
    {
      icon: <Scissors className="w-6 h-6 text-[#FF9EBE]" />,
      title: "9 simulierte Frisuren-Vorschläge",
      description: "Erhalte ein individuell zusammengestelltes Portfolio aus 9 typgerechten Schnitt-Simulationen – vom Pixie Cut bis zu langen Wavy Hair Trends."
    },
    {
      icon: <Droplet className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Individuelle Pflegetipps & Haar-Analyse",
      description: "Erhalte maßgeschneiderte Tipps für deine spezifische Haarstruktur (fein, dick, gewellt) sowie Do's & Don'ts für optimalen Halt und Glanz."
    },
    {
      icon: <Palette className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Typgerechte Farbberatung",
      description: "Der Simulator schlägt dir 3 harmonierende Haarfarben vor, die perfekt zu deinem Hautunterton und deiner Augenfarbe passen."
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF9EBE]" />,
      title: "WhatsApp-Freunde-Poll",
      description: "Lass deine Freunde über deine simulated Styles abstimmen: Erstelle mit 1 Klick eine kostenlose WhatsApp-Umfrage."
    }
  ];

  const comparisonData = [
    { feature: "Simulations-Technologie", frisurenAi: "Neueste Cloud-KI (3D-Tiefen-Mapping)", altSimulator: "Veraltete 2D-Perücken-Überlagerung" },
    { feature: "Gesichtsform-Analyse", frisurenAi: "Automatisch per KI (Oval, Rund, Eckig, Herz)", altSimulator: "Keine Gesichtsform-Berücksichtigung" },
    { feature: "Erstanalyse & Test", frisurenAi: "100% Kostenlos mit eigenem Foto", altSimulator: "Häufig In-App-Abo oder Wasserzeichen" },
    { feature: "Pflegetipps & Farbberatung", frisurenAi: "Inklusive & individuell auf dich abgestimmt", altSimulator: "Gar nicht vorhanden" },
    { feature: "Anwendbarkeit ohne App", frisurenAi: "Direkt im Web-Browser auf jedem Gerät", altSimulator: "Oft zwingender App-Download" },
    { feature: "Ergebnis-Qualität", frisurenAi: "100% Fotorealistisch & typgerecht", altSimulator: "Unnatürlich, unpassende Haarlinien" }
  ];

  return (
    <div className="space-y-16 md:space-y-32 pb-24 text-brand-primary">
      
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
            <span>Virtueller KI Frisuren Simulator 2026 – Ohne App-Installation</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            Frisuren Simulator: <span className="italic text-[#FF9EBE] block sm:inline">Virtuell neue Frisuren auf deinem Foto simulieren</span>
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed">
            Mit unserem hochmodernen <strong>Frisuren Simulator</strong> probierst du neue Haarschnitte, Haarfarben und Stylings fotorealistisch direkt auf deinem eigenen Foto aus. Inklusive kostenloser KI-Erstanalyse, Gesichtsformbestimmung, Pflegetipps und typgerechter Farbberatung.
          </p>
        </div>

        {/* Big CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-brand-primary/20 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload size={18} className="text-[#FF9EBE]" />
            <span>Jetzt Foto hochladen & Frisuren Simulator starten</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/50">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF9EBE]" /> Erstanalyse mit Bild gratis</span>
            <span className="opacity-25">•</span>
            <span>Kein Download nötig</span>
            <span className="opacity-25">•</span>
            <span>100% Fotorealistisch</span>
          </div>
        </div>

        {/* Rating Banner */}
        <div className="pt-6 flex items-center justify-center gap-4 text-xs text-brand-primary/60">
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
            <span className="text-[11px] text-brand-primary/50">Über 150.000+ simulierte Frisuren im KI-Simulator</span>
          </div>
        </div>
      </motion.section>

      {/* 2. FEATURES GRID SECTION */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Funktionsumfang</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Was der KI Frisuren Simulator für dich tun kann</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Frisuren.ai ist weit mehr als nur ein visueller Filter – es ist deine komplette digitale Friseur-Beratung auf KI-Basis.
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

      {/* 3. VISUAL SHOWCASE CARD */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white via-pink-50/30 to-amber-50/20 rounded-[3rem] p-8 md:p-14 border border-[#FF9EBE]/20 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9EBE]/20 text-[#FF9EBE] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                <Cpu size={12} />
                <span>Präzise 3D-Gesichtsanpassung</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Simuliere deinen neuen Look ohne Risiko vor dem Friseurbesuch!
              </h2>

              <p className="text-brand-primary/70 text-sm md:text-base leading-relaxed">
                Der <strong>Frisuren Simulator</strong> von Frisuren.ai analysiert deine individuellen Gesichtsproportionen. Anstatt dir pauschale Standard-Bilder zu zeigen, werden die Frisuren exakt an deinen Haaransatz, deine Stirn und deinen Kiefer angepasst.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Gesichtsform-Erkennung (Oval, Rund, Eckig, Herz)</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-[#FF9EBE]/20 text-[#FF9EBE] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Typgerechte Pflegetipps & Farbberatung inklusive</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>WhatsApp-Freunde-Umfrage mit 1 Klick erstellen</span>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onStartAnalysis}
                  className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Frisuren Simulator jetzt starten</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Simulated App Screen Showcase */}
            <div className="relative flex justify-center">
              <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-6 shadow-2xl border border-black/10 space-y-5 relative z-10">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">KI Frisuren Simulator</span>
                </div>

                <div className="bg-[#FF9EBE]/10 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold text-brand-primary">
                  <Sparkles className="text-[#FF9EBE] shrink-0" size={18} />
                  <span>Simulation aktiv: Eckiges Gesicht – 9 Cuts berechnet</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-[#FF9EBE]/20 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      Layered Bob ✨
                    </div>
                  </div>
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-purple-500/10 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      Soft Waves 💇‍♀️
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#FF9EBE] tracking-wider">Simulator Pflegetipp</span>
                  <p className="text-[11px] text-brand-primary/80 leading-snug">
                    Sanfte Stufen umrahmen die Kieferpartie und verleihen deinem Look feminine Weichheit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARISON MATRIX */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Der Technologie-Vergleich</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Frisuren.ai Simulator vs. Veraltete Tools</h2>
          <p className="text-brand-primary/60 text-sm max-w-xl mx-auto">
            Erfahre, warum unser KI-gestützter Frisuren Simulator deutlich bessere und realistischere Ergebnisse liefert.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-black/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white text-xs uppercase tracking-widest font-bold">
                  <th className="p-4 md:p-6">Feature</th>
                  <th className="p-4 md:p-6 bg-[#FF9EBE] text-white flex items-center gap-1.5">
                    <Sparkles size={14} /> Frisuren.ai KI Simulator
                  </th>
                  <th className="p-4 md:p-6 opacity-75">Klassische 2D-Simulatoren</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs md:text-sm font-medium">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-black/[0.01]'}>
                    <td className="p-4 md:p-6 font-bold">{row.feature}</td>
                    <td className="p-4 md:p-6 text-emerald-600 font-bold bg-[#FF9EBE]/5 flex items-center gap-2">
                      <Check size={16} className="text-emerald-500 shrink-0" />
                      <span>{row.frisurenAi}</span>
                    </td>
                    <td className="p-4 md:p-6 text-brand-primary/50">
                      <span>{row.altSimulator}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS - 3 STEPS */}
      <section className="max-w-5xl mx-auto px-4 py-12 bg-[#FF9EBE]/5 rounded-[3rem] border border-[#FF9EBE]/15">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Schritt-für-Schritt</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">So funktioniert der KI Frisuren Simulator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-lg font-serif">Foto hochladen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Lade ein gutes Selfie von dir direkt im Browser hoch. Keine Registrierung und kein App-Download erforderlich.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-lg font-serif">KI-Simulation starten</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                In 3 Sekunden simuliert die KI 9 typgerechte Haarschnitte auf deinem Gesicht, analysiert deine Gesichtsform und berechnet Pflegetipps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#FF9EBE] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-lg font-serif">Simulieren & Teilen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Passe im Studio Farben an oder starte mit 1 Klick eine WhatsApp-Umfrage, damit deine Freunde über deinen besten Look abstimmen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEO ARTICLE */}
      <article className="max-w-4xl mx-auto px-4 space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-sm text-brand-primary/80 text-sm md:text-base leading-relaxed">
        <div className="space-y-4 border-b border-black/10 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Ratgeber & Technologie</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-primary">
            Frisuren Simulator: Wie KI-Simulationen den Friseurbesuch revolutionieren
          </h2>
        </div>

        <p>
          Die Entscheidung für eine neue Frisur ist oft mit Unsicherheit verbunden. Wer träumt nicht davon, schon vor dem ersten Scherenschnitt zu sehen, wie die neue Frisur am eigenen Gesicht aussehen wird? Ein moderner <strong>Frisuren Simulator</strong> macht genau das möglich.
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Vom veralteten Foto-Sticker zum fotorealistischen KI Frisuren Simulator
        </h3>
        <p>
          Frühere Online-Simulatoren legten lediglich starre 2D-Grafiken oder Perücken über das Foto des Nutzers. Das Ergebnis sah meist unnatürlich und künstlich aus. Der KI Frisuren Simulator von Frisuren.ai setzt dagegen auf neuronale Netze und generative Bild-KIs:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
          <li><strong>Physikalisch korrekter Haarfall:</strong> Die simulierte Frisur berücksichtigt deinen echten Kopfumfang und deine Gesichtszüge.</li>
          <li><strong>Echter Erhalt deiner Gesichtsmerkmale:</strong> Augen, Haut und Lächeln bleiben unverändert.</li>
          <li><strong>Umfassende Typberatung:</strong> Inklusive automatischer Gesichtsformbestimmung, individuellen <strong>Pflegetipps</strong> und typgerechter <strong>Farbberatung</strong>.</li>
        </ul>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Erstanalyse mit kostenlosem Bild – Direkt im Browser
        </h3>
        <p>
          Du musst keine App herunterladen oder Speicherplatz opfern. Öffne einfach Frisuren.ai im Browser deines Smartphones oder PCs, lade dein Foto hoch und starte deine kostenlose KI-Frisuren-Simulation.
        </p>

        <div className="p-6 bg-[#FF9EBE]/10 rounded-2xl border border-[#FF9EBE]/30 my-4 space-y-2">
          <h4 className="font-bold text-brand-primary flex items-center gap-2">
            <Sparkles size={16} className="text-[#FF9EBE]" />
            Starte deinen Frisuren Simulator Test!
          </h4>
          <p className="text-xs text-brand-primary/70">
            Klicke auf den Button, lade ein Bild hoch und erlebe den besten KI Frisuren Simulator direkt im Web-Browser!
          </p>
        </div>
      </article>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[#FF9EBE] text-xs font-bold uppercase tracking-widest">
            <HelpCircle size={16} />
            <span>Häufig gestellte Fragen (FAQ)</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">FAQ: Frisuren Simulator</h2>
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

      {/* 8. BOTTOM CONVERSION CTA CARD */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-10 md:p-16 bg-[#FF9EBE] rounded-[3rem] text-white text-center space-y-8 relative overflow-hidden shadow-2xl shadow-[#FF9EBE]/30">
          <div className="relative space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold italic text-white leading-tight">
              Jetzt Frisuren Simulator starten & Looks auf deinem Foto testen! ✂️
            </h2>
            <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium">
              Lade dein Foto hoch und erhalte in wenigen Sekundenschnelle deine kostenlose KI-Simulation inklusive Gesichtsformanalyse, Pflegetipps & Farbberatung.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-white text-[#FF9EBE] font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Foto hochladen & Simulator starten</span>
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

const faqs = [
  {
    q: "Wie funktioniert der KI Frisuren Simulator?",
    a: "Du lädst ein Porträtfoto von dir hoch. Der Frisuren Simulator scannt dein Bild in 3 Sekunden mit fortschrittlicher KI, erkennt deine Gesichtsform und erzeugt 9 fotorealistische Frisuren-Simulationen auf deinem Gesicht."
  },
  {
    q: "Ist der Frisuren Simulator kostenlos?",
    a: "Ja, die Erstanalyse mit deinem hochgeladenen Foto ist zu 100% kostenlos. Du erhältst eine automatische Gesichtsformbestimmung, 9 simulierte Frisurenvorschläge, Pflegetipps für deine Haarstruktur und 3 Farbtipps gratis."
  },
  {
    q: "Muss ich eine App für den Frisuren Simulator installieren?",
    a: "Nein, unser Frisuren Simulator läuft komplett in deinem Web-Browser auf jedem Smartphone (iOS & Android) oder Computer. Es ist kein App-Download nötig."
  },
  {
    q: "Wie gut schätzt der Frisuren Simulator meine Gesichtsform ein?",
    a: "Die KI erkennt Konturen millimetergenau und unterscheidet präzise zwischen ovalen, runden, eckigen und herzförmigen Gesichtsformen, um dir nur wirklich passende Schnitte vorzuschlagen."
  },
  {
    q: "Gibt es auch Pflegetipps und Farbberatungen im Simulator?",
    a: "Ja! Du erhältst individuelle Pflegetipps für deine Haarstruktur sowie 3 konkrete Haarfarb-Tipps, die deinen Hautunterton perfekt zur Geltung bringen."
  },
  {
    q: "Kann ich simulierte Frisuren mit meinen Freunden teilen?",
    a: "Ja! Du kannst mit 1 Klick eine kostenlose Umfrage erstellen und den Link per WhatsApp an deine Freunde schicken, damit sie für deinen neuen Lieblingslook abstimmen."
  }
];
