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
  Smartphone,
  Check,
  X,
  Star,
  MessageSquare,
  Palette,
  Droplet,
  Users,
  Award,
  ChevronDown,
  Scan
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FreeAppLandingPageProps {
  onStartAnalysis: () => void;
}

export default function FreeAppLandingPage({ onStartAnalysis }: FreeAppLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // SEO setup: dynamically inject metadata & JSON-LD structured data for Google
  useEffect(() => {
    // Save original title & meta tags
    const prevTitle = document.title;
    document.title = "Kostenlose Frisuren App – Frisuren App kostenlos testen | Frisuren.ai";

    // Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Die #1 kostenlose Frisuren App im Web: Teste neue Haarschnitte & Haarfarben fotorealistisch auf deinem Foto. Inkl. KI-Gesichtsformanalyse, Pflegetipps & Umfragen. Ohne Download!');
    }

    // Set Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (canonical) {
      canonical.setAttribute('href', 'https://frisuren.ai/kostenlose-frisuren-app');
    }

    // Insert JSON-LD FAQ Schema & SoftwareApplication Schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-free-app-jsonld';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Frisuren.ai - Kostenlose Frisuren App",
          "operatingSystem": "All (Web Browser, iOS, Android)",
          "applicationCategory": "LifestyleApplication",
          "description": "Die beste kostenlose Frisuren App für dein Smartphone und PC. KI-basierte Erstanalyse mit kostenlosem Foto, Gesichtsformerfassung, Pflegetipps und virtuellem Haarfarben-Tester.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "18940"
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
      const injectedScript = document.getElementById('seo-free-app-jsonld');
      if (injectedScript) injectedScript.remove();
    };
  }, []);

  const featuresList = [
    {
      icon: <Scan className="w-6 h-6 text-[#FF9EBE]" />,
      title: "KI-Erstanalyse mit kostenlosem Bild",
      description: "Lade ein Selfie hoch – unsere KI analysiert in 3 Sekunden deine Gesichtsform (oval, rund, eckig, herzförmig) sowie deine Stirn- und Kinnpartie."
    },
    {
      icon: <Scissors className="w-6 h-6 text-[#FF9EBE]" />,
      title: "9 maßgeschneiderte Frisuren-Vorschläge",
      description: "Erhalte direkt kostenlose, individuell auf deinen Typ abgestimmte Haarschnitt-Empfehlungen vom modernen Bob bis zum Trend-Cut."
    },
    {
      icon: <Droplet className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Individuelle Pflegetipps & Haar-Analyse",
      description: "Profitiere von personalisierten Expertentipps für deine spezifische Haarstruktur (fein, dick, lockig) und erhalte do's & don'ts für dein tägliches Styling."
    },
    {
      icon: <Palette className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Typgerechte Farbberatung",
      description: "Entdecke 3 maßgeschneiderte Haarfarb-Tipps, die deinen Hautunterton perfekt zur Geltung bringen – von warmen Balayage-Tönen bis zu kühlem Blond."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Virtuelles Styling Studio",
      description: "Verändere Haarfarben im Handumdrehen, probiere neue Haarlängen aus oder lass dir von unserem KI-Stylisten individuelle Sonderwünsche erfüllen."
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Frisuren-Polls (Freunde abstimmen lassen)",
      description: "Unsicher, welcher Look am besten aussieht? Erstelle mit 1 Klick eine kostenlose Umfrage und teile sie per WhatsApp mit deinen Freunden."
    }
  ];

  const comparisonData = [
    { feature: "Preis & Erstanalyse", frisurenAi: "100% Kostenlos mit 1 Foto", appStore: "Meist In-App-Käufe oder teures Abo" },
    { feature: "Download & Installation", frisurenAi: "Kein Download (Direkt im Web-Browser)", appStore: "App Store / Play Store Download erforderlich" },
    { feature: "KI-Qualität & Fotorealismus", frisurenAi: "Modernste KI-Generierung (2026 Standard)", appStore: "Veraltete 2D-Filter & Perücken-Overlay" },
    { feature: "Gesichtsform-Analyse", frisurenAi: "Automatische Erkennung & Tipps", appStore: "Selten oder nur manuelle Schablone" },
    { feature: "Pflegetipps & Farbberatung", frisurenAi: "Inklusive & individuell", appStore: "Gar nicht enthalten" },
    { feature: "Datenschutz & DSGVO", frisurenAi: "100% DSGVO-konform, automatische Löschung", appStore: "Offenbar Datenverfolgung & Drittanbieter" },
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
            <Sparkles size={14} className="animate-pulse" />
            <span>#1 Kostenlose Frisuren App 2026 – Ohne Download</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            Kostenlose Frisuren App: <span className="italic text-[#FF9EBE] block sm:inline">Frisuren kostenlos</span> auf dem eigenen Foto testen.
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed">
            Suchst du nach einer <strong>kostenlosen Frisuren App</strong>, mit der du neue Haarschnitte, Haarfarben und Stylings ohne Risiko ausprobieren kannst? Frisuren.ai bietet dir eine präzise KI-Erstanalyse mit kostenlosem Bild, typgerechte Pflegetipps und ein virtuelles Studio – direkt in deinem Browser.
          </p>
        </div>

        {/* Big CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-brand-primary/20 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload size={18} className="text-[#FF9EBE]" />
            <span>Kostenloses Foto hochladen & Analyse starten</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/50">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF9EBE]" /> 100% DSGVO-konform</span>
            <span className="opacity-25">•</span>
            <span>Keine Registrierung erforderlich</span>
            <span className="opacity-25">•</span>
            <span>Erstanalyse mit Bild gratis</span>
          </div>
        </div>

        {/* Social Proof Banner */}
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
            <span className="text-[11px] text-brand-primary/50">Über 50.000+ Frisuren-Analysen durchgeführt</span>
          </div>
        </div>
      </motion.section>

      {/* 2. FEATURES GRID SECTION */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Komplettes Feature-Set</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Alles, was eine perfekte Frisuren App braucht</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Frisuren.ai kombiniert professionelle Typberatung, KI-Gesichtserkennung und fotorealistisches Haarstyling in einer einzigen kostenlosen Anwendung.
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
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl shadow-black/[0.02] flex flex-col justify-between space-y-6 hover:border-[#FF9EBE]/40 hover:shadow-2xl transition-all group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF9EBE]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold font-serif">{item.title}</h3>
                <p className="text-xs md:text-sm text-brand-primary/70 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 flex items-center text-[11px] font-bold text-[#FF9EBE] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Feature entdecken</span>
                <ChevronRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. VISUAL PREVIEW / SHOWCASE CARD */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white via-pink-50/30 to-amber-50/20 rounded-[3rem] p-8 md:p-14 border border-[#FF9EBE]/20 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9EBE]/20 text-[#FF9EBE] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                <Zap size={12} />
                <span>Erstanalyse mit kostenlosem Bild</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Kein Raten mehr: Sieh genau, wie dir ein neuer Schnitt steht!
              </h2>

              <p className="text-brand-primary/70 text-sm md:text-base leading-relaxed">
                Egal ob du über einen frechen Short Bob, einen modernen Pixie Cut, lange Wellen oder einen eleganten Stufenschnitt nachdenkst: Unsere <strong>kostenlose Frisuren App</strong> generiert die Styles direkt auf deinem Gesicht.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Gesichtsform-Analyse (Oval, Eckig, Rund, Herz)</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-[#FF9EBE]/20 text-[#FF9EBE] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Individuelle Pflegetipps & Farbtipps inklusive</span>
                </div>
                <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>1 Click WhatsApp-Poll für Feedback von Freunden</span>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onStartAnalysis}
                  className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Jetzt Frisuren App kostenlos testen</span>
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
                  <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Frisuren.ai Studio</span>
                </div>

                <div className="bg-[#FF9EBE]/10 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold text-brand-primary">
                  <Sparkles className="text-[#FF9EBE] shrink-0" size={18} />
                  <span>Ergebnis: Ovales Gesicht – 9 perfekte Styles berechnet</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-[#FF9EBE]/20 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      Butterfly Cut ✨
                    </div>
                  </div>
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-purple-500/10 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      French Bob 💇‍♀️
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">Pflegetipp des KI-Stylisten</span>
                  <p className="text-[11px] text-emerald-900 leading-snug">
                    Verwende ein leichtes Feuchtigkeitsspray am Oberkopf für langanhaltendes Volumen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARISON MATRIX: Frisuren.ai vs App Store Apps */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Vergleich auf einen Blick</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Warum Frisuren.ai statt gewöhnlicher App Store Apps?</h2>
          <p className="text-brand-primary/60 text-sm max-w-xl mx-auto">
            Die meisten Apps verlangen Abos oder verfälschen das Bild durch billige 2D-Filter. Frisuren.ai setzt neue Maßstäbe.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-black/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white text-xs uppercase tracking-widest font-bold">
                  <th className="p-4 md:p-6">Kriterium</th>
                  <th className="p-4 md:p-6 bg-[#FF9EBE] text-white flex items-center gap-1.5">
                    <Sparkles size={14} /> Frisuren.ai (Web App)
                  </th>
                  <th className="p-4 md:p-6 opacity-75">Herkömmliche App Store Apps</th>
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
                      <span>{row.appStore}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS - 3 STEP GUIDE */}
      <section className="max-w-5xl mx-auto px-4 py-12 bg-[#FF9EBE]/5 rounded-[3rem] border border-[#FF9EBE]/15">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Einfach & Schnelle Anwendung</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">So nutzt du die Frisuren App kostenlos in 3 Schritten</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md relative">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-lg font-serif">Foto hochladen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Nimm ein Selfie auf oder wähle ein bestehendes Foto aus. Keine Registrierung oder App-Installation notwendig.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md relative">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-lg font-serif">KI-Analyse erhalten</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Die KI ermittelt deine Gesichtsform, schlägt 9 perfekt passende Frisuren vor und liefert konkrete Pflegetipps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md relative">
              <div className="w-10 h-10 rounded-full bg-[#FF9EBE] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-lg font-serif">Stylen & Teilen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Testet Haarfarben im Studio, speichere deine Lieblingslooks ab oder starte eine Abstimmung per Umfrage-Link.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEO DEEP-DIVE CONTENT ARTICLE */}
      <article className="max-w-4xl mx-auto px-4 space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-sm text-brand-primary/80 text-sm md:text-base leading-relaxed">
        <div className="space-y-4 border-b border-black/10 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Ratgeber & KI-Styling</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-primary">
            Warum eine kostenlose Frisuren App vor Fehlkäufen beim Friseur schützt
          </h2>
        </div>

        <p>
          Wer kennst es nicht? Man verlässt den Friseursalon mit einer Frisur, die auf dem Vorlagebild umwerfend aussah – an einem selbst jedoch überhaupt nicht zur Gesichtsform passt. Ein solcher Friseur-Fehlkauf lässt sich oft erst nach mehreren Monaten wieder herauswachsen. Hier setzt unsere <strong>kostenlose Frisuren App</strong> an:
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Gesichtsform-Analyse: Das Geheimnis des perfekten Haarschnitts
        </h3>
        <p>
          Jeder Mensch hat eine einzigartige Gesichtsstruktur. Ob oval, rund, quadratisch, rechteckig oder herzförmig: Jeder Schnitt betont andere Partien deines Gesichts.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
          <li><strong>Ovale Gesichtsform:</strong> Gilt als besonders ausbalanciert – fast jeder Schnitt (Pixie, Bob, Stufen) passt hervorragend.</li>
          <li><strong>Runde Gesichtsform:</strong> Profitiert von Frisuren mit Oberkopf-Volumen und langen Seitensträhnen, die das Gesicht optisch strecken.</li>
          <li><strong>Eckige Gesichtsform:</strong> Weiche Wellen, Fransen und sanfte Cuts mildern markante Kieferpartien ab.</li>
          <li><strong>Herzförmige Gesichtsform:</strong> Kinnlange Bobs und Pony-Frisuren bringen Stirn- und Kinnbereich in eine harmonische Balance.</li>
        </ul>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Virtuelle Haarfarben-Beratung ohne Färberisiko
        </h3>
        <p>
          Neben dem Haarschnitt ist auch die Wahl der richtigen Haarfarbe entscheidend. Das Ändern der Haarfarbe beim Friseur ist oft kostenintensiv und kann das Haar strapazieren. Mit dem integrierten Styling Studio unserer <strong>Frisuren App kostenlos</strong> kannst du kühles Blond, Schokobraun, Kupferrot oder Balayage schadenfrei digital testen.
        </p>

        <div className="p-6 bg-[#FF9EBE]/10 rounded-2xl border border-[#FF9EBE]/30 my-4 space-y-2">
          <h4 className="font-bold text-brand-primary flex items-center gap-2">
            <Sparkles size={16} className="text-[#FF9EBE]" />
            Kostenlos ausprobieren: Welcher Look passt zu dir?
          </h4>
          <p className="text-xs text-brand-primary/70">
            Nutze die Chance und lade jetzt unverbindlich ein Foto hoch. Die Erstanalyse ist 100% kostenlos und liefert dir sofort dein erstes Ergebnis.
          </p>
        </div>
      </article>

      {/* 7. FAQ ACCORDION WITH SCHEMA MARKS */}
      <section className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-[#FF9EBE] text-xs font-bold uppercase tracking-widest">
            <HelpCircle size={16} />
            <span>Häufig gestellte Fragen (FAQ)</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Alles zur kostenlosen Frisuren App</h2>
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold italic text-white leading-tight">
              Jetzt Frisuren App kostenlos testen! ✂️
            </h2>
            <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base md:text-lg">
              Finde in Sekundenschnelle heraus, welcher Haarschnitt und welche Haarfarbe dir am besten stehen. Völlig unverbindlich und ohne App-Store-Download.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-white text-[#FF9EBE] font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Erstanalyse mit kostenlosem Bild starten</span>
              <ArrowRight size={16} />
            </button>
            
            <p className="mt-6 text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] flex flex-wrap items-center justify-center gap-3">
              <span>Keine Registrierung</span>
              <span>•</span>
              <span>100% Kostenloser Start</span>
              <span>•</span>
              <span>DSGVO-konform</span>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

// FAQs array for Schema & Component
const faqs = [
  {
    q: "Ist diese Frisuren App wirklich 100% kostenlos?",
    a: "Ja, du kannst dein Foto kostenlos hochladen und eine vollständige KI-Gesichtsformanalyse mit 9 individuellen Frisurenvorschlägen, Pflegetipps und typgerechten Farbtipps erhalten. Es ist keine Kreditkarte und kein Abonnement erforderlich."
  },
  {
    q: "Brauche ich einen App Store oder Play Store Download?",
    a: "Nein! Frisuren.ai ist eine moderne Progressive Web App. Du kannst sie sofort auf deinem iPhone, Android-Smartphone, Tablet oder PC im Browser nutzen – ganz ohne Speicherplatz auf deinem Handy zu belegen."
  },
  {
    q: "Wie funktioniert die Erstanalyse mit kostenlosem Bild?",
    a: "Unsere hochentwickelte KI analysiert die Geometrie deines Gesichtes (Wangenknochen, Kinnpartie, Stirnhöhe) und berechnet daraufhin mathematisch, welche Haarlängen und Schnitte dir am besten stehen."
  },
  {
    q: "Kann ich auch Haarfarben und eigene Wünsche testen?",
    a: "Ja! Im integrierten Styling Studio kannst du über 10 verschiedene Haarfarben (z.B. Blond, Braun, Rot, Balayage) testen, die Haarlänge variieren oder individuelle Stylings per Texteingabe mit unserem KI-Stylisten erstellen."
  },
  {
    q: "Welche Pflegetipps und Farbberatungen sind enthalten?",
    a: "Zu jedem Analyseergebnis erhältst du maßgeschneiderte Pflegetipps für deine Haarstruktur, konkrete Styling Do's & Don'ts für deine Gesichtsform sowie 3 konkrete Farbtipps, die ideal zu deinem Teint passen."
  },
  {
    q: "Wie kann ich Freunde nach ihrer Meinung fragen?",
    a: "Mit unserer Frisuren-Poll-Funktion kannst du aus deinen Ergebnissen mit 1 Klick eine kostenlose Umfrage erstellen und den Link per WhatsApp oder Social Media an deine Freunde senden, damit sie für ihren Favoriten abstimmen."
  },
  {
    q: "Sind meine hochgeladenen Fotos sicher?",
    a: "Ja, Datenschutz steht bei uns an erster Stelle. Alle Bilder werden hochverschlüsselt übertragen, DSGVO-konform verarbeitet und nicht an Dritte weitergegeben."
  }
];
