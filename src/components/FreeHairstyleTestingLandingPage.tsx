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
  Camera,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FreeHairstyleTestingLandingPageProps {
  onStartAnalysis: () => void;
}

export default function FreeHairstyleTestingLandingPage({ onStartAnalysis }: FreeHairstyleTestingLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic SEO Setup: document title, meta tags, and structured JSON-LD schema
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Kostenlos Frisuren testen – Frisuren testen kostenlos auf eigenem Foto | Frisuren.ai";

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Kostenlos Frisuren testen & Frisuren testen kostenlos auf deinem eigenen Foto. KI-Gesichtsformanalyse, 9 individuelle Haarschnitte, Pflegetipps & Farbberatung gratis. Ohne App-Download!');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (canonical) {
      canonical.setAttribute('href', 'https://frisuren.ai/kostenlos-frisuren-testen');
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-freetest-jsonld';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Frisuren.ai - Kostenlos Frisuren testen",
          "operatingSystem": "All (Web Browser, iOS, Android, Windows, Mac)",
          "applicationCategory": "LifestyleApplication",
          "description": "Die beste Anwendung um kostenlos Frisuren zu testen. KI-Erstanalyse mit eigenem Foto, automatische Gesichtsformanalyse, Pflegetipps & Farbberatung ohne Download.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "26800"
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
      const injectedScript = document.getElementById('seo-freetest-jsonld');
      if (injectedScript) injectedScript.remove();
    };
  }, []);

  const featuresList = [
    {
      icon: <Scan className="w-6 h-6 text-[#FF9EBE]" />,
      title: "KI-Erstanalyse mit kostenlosem Bild",
      description: "Lade einfach dein Foto hoch. Unsere KI scannt in Sekundenschnelle deine Gesichtskonturen (oval, rund, eckig, herzförmig) und deine Haareigenschaften."
    },
    {
      icon: <Scissors className="w-6 h-6 text-[#FF9EBE]" />,
      title: "9 maßgeschneiderte Frisuren-Vorschläge",
      description: "Du erhältst direkt 9 typgerechte Haarschnitt-Empfehlungen vom modernen Bob über stufige Curls bis hin zu eleganten Long-Hairstyles."
    },
    {
      icon: <Droplet className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Individuelle Pflegetipps & Haar-Analyse",
      description: "Erhalte konkrete Pflegeempfehlungen für dein Haar (fein, dick, gewellt) sowie Styling Do's & Don'ts passend zu deiner Gesichtsform."
    },
    {
      icon: <Palette className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Typgerechte Farbberatung",
      description: "Entdecke 3 Haarfarb-Tipps, die deinen Teint und deine Augen ideal zur Geltung bringen – von warmen Balayage-Tönen bis kühlem Blond."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Virtuelles Styling Studio",
      description: "Passe Haarfarben im Studio an, experimentiere mit Haarlängen oder fordere deinen persönlichen KI-Stylisten heraus."
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF9EBE]" />,
      title: "WhatsApp-Freunde-Umfrage",
      description: "Unsicher, welcher Look am besten zu dir passt? Erstelle mit 1 Klick eine kostenlose Umfrage und lass deine Freunde abstimmen."
    }
  ];

  const comparisonData = [
    { feature: "Kosten & Test-Modus", frisurenAi: "100% Kostenlos mit 1 Foto", salon: "Risiko von Fehlkäufen & teuren Korrekturen" },
    { feature: "Gesichtsform-Erkennung", frisurenAi: "Automatische KI-Analyse", salon: "Meist nur subjektive Einschätzung" },
    { feature: "Visualisierung", frisurenAi: "Fotorealistisch direkt auf deinem Gesicht", salon: "Nur Vorlagebilder fremder Models" },
    { feature: "Pflegetipps & Farbberatung", frisurenAi: "Inklusive & individuell auf dich abgestimmt", salon: "Oft allgemeine Beratung vor Ort" },
    { feature: "App-Download erforderlich?", frisurenAi: "Nein, 100% im Web-Browser", salon: "N/A" },
    { feature: "Feedback von Freunden", frisurenAi: "Kostenlose WhatsApp-Umfrage mit 1 Klick", salon: "Nur nach abgeschlossenem Schnitt möglich" }
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
            <span>Kostenlos Frisuren testen 2026 – Ohne App-Download</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            Kostenlos Frisuren testen: <span className="italic text-[#FF9EBE] block sm:inline">Frisuren testen kostenlos</span> auf deinem Foto
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed">
            Möchtest du <strong>kostenlos Frisuren testen</strong> und sehen, welcher Haarschnitt und welche Haarfarbe dir wirklich stehen? Mit Frisuren.ai kannst du jetzt <strong>Frisuren testen kostenlos</strong> – direkt auf deinem eigenen Bild, mit KI-Gesichtsformanalyse, Pflegetipps und Farbberatung!
          </p>
        </div>

        {/* Big CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-brand-primary/20 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload size={18} className="text-[#FF9EBE]" />
            <span>Kostenloses Foto hochladen & Frisuren testen</span>
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
            <span className="text-[11px] text-brand-primary/50">Über 1000+ Fotos erfolgreich analysiert</span>
          </div>
        </div>
      </motion.section>

      {/* 2. FEATURES GRID SECTION */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Dein Komplett-Paket</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Alles enthalten, wenn du kostenlos Frisuren testest</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Frisuren.ai kombiniert modernste KI-Visualisierung mit fundierter Typberatung für das perfekte Umstyling.
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

      {/* 3. SHOWCASE / INTERACTIVE CARD */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white via-pink-50/30 to-amber-50/20 rounded-[3rem] p-8 md:p-14 border border-[#FF9EBE]/20 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF9EBE]/20 text-[#FF9EBE] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                <Zap size={12} />
                <span>Erstanalyse mit kostenlosem Bild</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Vor dem Friseurbesuch: Frisuren testen kostenlos ohne Risiko!
              </h2>

              <p className="text-brand-primary/70 text-sm md:text-base leading-relaxed">
                Statt beim Friseur zu hoffen, dass der neue Schnitt gut wird, kannst du auf Frisuren.ai <strong>kostenlos Frisuren testen</strong>. Sieh sofort auf deinem eigenen Gesicht, ob dir ein frecher French Bob, Stufenschnitt oder Balayage steht.
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
                  <span>Individuelle Pflegetipps & Farbberatung</span>
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
                  <span>Jetzt kostenlos Frisuren testen</span>
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
                  <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Frisuren.ai Tester</span>
                </div>

                <div className="bg-[#FF9EBE]/10 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold text-brand-primary">
                  <Sparkles className="text-[#FF9EBE] shrink-0" size={18} />
                  <span>Ergebnis: Herzförmiges Gesicht – 9 Styles verfügbar</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-[#FF9EBE]/20 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      Curtain Bangs ✨
                    </div>
                  </div>
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-purple-500/10 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      Shaggy Cut 💇‍♀️
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#FF9EBE] tracking-wider">Farb- & Pflegetipp</span>
                  <p className="text-[11px] text-brand-primary/80 leading-snug">
                    Warme Karamell-Reflexe lassen deinen Hautunterton besonders frisch strahlen.
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
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Vergleich auf einen Blick</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Warum vorab kostenlos Frisuren testen?</h2>
          <p className="text-brand-primary/60 text-sm max-w-xl mx-auto">
            Sieh dir den direkten Vergleich zwischen der Online-Vorschau auf Frisuren.ai und der klassischen Salon-Beratung an.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-black/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white text-xs uppercase tracking-widest font-bold">
                  <th className="p-4 md:p-6">Feature / Kriterium</th>
                  <th className="p-4 md:p-6 bg-[#FF9EBE] text-white flex items-center gap-1.5">
                    <Sparkles size={14} /> Frisuren.ai
                  </th>
                  <th className="p-4 md:p-6 opacity-75">Klassischer Friseur-Besuch</th>
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
                      <span>{row.salon}</span>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">In 3 Schritten starten</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">So kannst du Frisuren testen kostenlos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-lg font-serif">Foto hochladen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Wähle ein Selfie auf deinem Smartphone oder PC aus. Es ist kein App-Download und keine Registrierung nötig.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-lg font-serif">KI-Analyse abwarten</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                In 3 Sekunden bestimmt die KI deine Gesichtsform, schlägt 9 passende Haarschnitte vor und liefert konkrete Pflegetipps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#FF9EBE] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-lg font-serif">Stylen & Teilen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Teste verschiedene Haarfarben im Studio oder erstelle einen kostenlosen Umfrage-Link für deine Freunde auf WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEO ARTICLE */}
      <article className="max-w-4xl mx-auto px-4 space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-sm text-brand-primary/80 text-sm md:text-base leading-relaxed">
        <div className="space-y-4 border-b border-black/10 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Ratgeber & Umstyling</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-primary">
            Kostenlos Frisuren testen: Wie du Fehlkäufe beim Friseur vermeidest & deinen Traumlook findest
          </h2>
        </div>

        <p>
          Ein Friseurbesuch ist Vertrauenssache. Doch wer kennt nicht das mulmige Gefühl im Friseurstuhl, wenn die Schere ansetzt und man sich fragt: <em>„Wird mir dieser Haarschnitt wirklich stehen?“</em> Wenn du vorab <strong>kostenlos Frisuren testen</strong> kannst, nimmst du diese Ungewissheit komplett aus der Gleichung.
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Warum Frisuren testen kostenlos mit eigenen Fotos so effektiv ist
        </h3>
        <p>
          Musterbücher beim Friseur zeigen meist professionelle Models mit perfekt ausgeleuchteten Gesichtern. Was an einer Model-Gesichtsform hervorragend aussieht, wirkt am eigenen Gesicht oft ganz anders. Wenn du <strong>Frisuren testen kostenlos</strong> auf deinem eigenen Foto nutzt:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
          <li>Bleibt deine eigene Augen- und Gesichtsstruktur zu 100% erhalten.</li>
          <li>Berechnet die KI exakt, welche Haarlängen und Volumenpunkte deine Gesichtskontur ausbalancieren.</li>
          <li>Erhältst du wertvolle <strong>Pflegetipps</strong> für dein Haar und typgerechte <strong>Farbempfehlungen</strong>.</li>
        </ul>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Gesichtsform-Analyse & Farbberatung inklusive
        </h3>
        <p>
          Ob ovales, rundes, eckiges oder herzförmiges Gesicht: Zu jeder Gesichtsform gehören bestimmte Schnitte, die Vorzüge betonen. Frisuren.ai liefert dir im kostenlosen Erstanalyse-Ergebnis nicht nur das Vorschau-Bild, sondern erklärt dir genau, <em>warum</em> diese Frisur zu dir passt.
        </p>

        <div className="p-6 bg-[#FF9EBE]/10 rounded-2xl border border-[#FF9EBE]/30 my-4 space-y-2">
          <h4 className="font-bold text-brand-primary flex items-center gap-2">
            <Sparkles size={16} className="text-[#FF9EBE]" />
            Starte deinen Frisurentest jetzt!
          </h4>
          <p className="text-xs text-brand-primary/70">
            Lade unverbindlich ein Bild hoch und probiere in wenigen Sekunden deine ersten neuen Styles kostenlos aus.
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
          <h2 className="text-3xl md:text-4xl font-serif font-bold">FAQ: Kostenlos Frisuren testen</h2>
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
              Jetzt kostenlos Frisuren testen! ✂️
            </h2>
            <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium">
              Finde heraus, welche Frisur perfekt zu deinem Gesicht passt. Lade jetzt ein Foto hoch und erhalte deine kostenlose Erstanalyse inklusive Pflegetipps & Farbberatung.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-white text-[#FF9EBE] font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Foto hochladen & Frisuren testen kostenlos</span>
              <ArrowRight size={16} />
            </button>
            
            <p className="mt-6 text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] flex flex-wrap items-center justify-center gap-3">
              <span>Keine Registrierung erforderlich</span>
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

const faqs = [
  {
    q: "Wie kann ich auf Frisuren.ai kostenlos Frisuren testen?",
    a: "Lade einfach ein Foto (Selfie) von dir hoch. Unsere KI führt in wenigen Sekunden eine Gesichtsformanalyse durch und liefert dir 9 maßgeschneiderte Frisurenvorschläge, Pflegetipps und Farbtipps völlig gratis."
  },
  {
    q: "Ist der Test wirklich 100% kostenlos?",
    a: "Ja! Die Erstanalyse mit deinem Foto inklusive Gesichtsformbestimmung, Pflegetipps, Farbtipps und deinem ersten Vorschau-Bild ist absolut kostenlos. Es gibt keine Abo-Falle."
  },
  {
    q: "Muss ich eine App aus dem App Store herunterladen?",
    a: "Nein, Frisuren.ai läuft zu 100% in deinem Web-Browser auf deinem Smartphone, Tablet oder Computer. Du musst keine App installieren."
  },
  {
    q: "Welche Pflegetipps und Farbberatungen bekomme ich?",
    a: "Zu jedem Test erhältst du individuelle Pflegetipps für deine Haarstruktur, konkrete Styling Do's & Don'ts für deine Gesichtsform sowie 3 typgerechte Farbtipps (z.B. Balayage, Schokobraun, kühles Blond)."
  },
  {
    q: "Kann ich auch Freunden meine Testergebnisse zeigen?",
    a: "Ja! Du kannst mit 1 Klick eine kostenlose WhatsApp-Umfrage erstellen und an deine Freunde schicken, damit sie für deine beste Frisur abstimmen können."
  },
  {
    q: "Werden meine hochgeladenen Fotos vertraulich behandelt?",
    a: "Ja! Bei Frisuren.ai gilt strenger Datenschutz nach DSGVO. Deine Fotos werden sicher verarbeitet und nicht für andere Zwecke verwendet."
  }
];
