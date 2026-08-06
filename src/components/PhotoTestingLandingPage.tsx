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
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhotoTestingLandingPageProps {
  onStartAnalysis: () => void;
}

export default function PhotoTestingLandingPage({ onStartAnalysis }: PhotoTestingLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic SEO Setup: document title, meta tags, and structured JSON-LD schema
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Frisuren auf Foto testen – Frisuren testen mit Bild hochladen | Frisuren.ai";

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Frisuren auf Foto testen & Frisuren testen mit Bild hochladen: Lade jetzt dein Foto hoch & probiere neue Haarschnitte & Haarfarben fotorealistisch aus. KI-Gesichtsformanalyse, Pflegetipps & Farbberatung gratis!');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (canonical) {
      canonical.setAttribute('href', 'https://frisuren.ai/frisuren-auf-foto-testen');
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-[#FF9EBE]oto-jsonld';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Frisuren.ai - Frisuren auf Foto testen & Bild hochladen",
          "operatingSystem": "All (Web Browser, iOS, Android, Windows, Mac)",
          "applicationCategory": "LifestyleApplication",
          "description": "Die beste Anwendung um Frisuren auf dem eigenen Foto zu testen. Einfach Bild hochladen, KI-Gesichtsformanalyse erhalten, 9 Frisurenvorschläge, Pflegetipps & Farbberatung gratis.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "28500"
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
      const injectedScript = document.getElementById('seo-[#FF9EBE]oto-jsonld');
      if (injectedScript) injectedScript.remove();
    };
  }, []);

  const featuresList = [
    {
      icon: <Camera className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Bild hochladen & KI-Erstanalyse",
      description: "Einfach dein eigenes Foto oder Selfie hochladen. Die KI scannt in Sekundenschnelle deine Gesichtsstruktur (oval, rund, eckig, herzförmig) und Stirn- sowie Kinnpartie."
    },
    {
      icon: <Scissors className="w-6 h-6 text-[#FF9EBE]" />,
      title: "9 maßgeschneiderte Frisuren-Vorschläge",
      description: "Erhalte ein individuell auf dein Gesicht abgestimmtes Portfolio aus 9 fotorealistischen Haarschnitt-Vorschlägen – von kurzen Bobs bis hin zu langen Stufen."
    },
    {
      icon: <Droplet className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Individuelle Pflegetipps & Haar-Analyse",
      description: "Profitiere von konkreten Empfehlungen für deine spezifische Haarstruktur (fein, dacht, gewellt) sowie Styling Do's & Don'ts vom KI-Stylisten."
    },
    {
      icon: <Palette className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Typgerechte Farbberatung",
      description: "Entdecke 3 passende Haarfarben-Tipps, die deinen Hautunterton perfekt zur Geltung bringen – von warmen Balayage-Nuancen bis zu kühlem Blond."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Virtuelles Styling Studio",
      description: "Teste alternative Haarfarben direkt auf deinem hochgeladenen Bild, verändere Haarlängen oder fordere den KI-Stylisten mit eigenen Wünschen heraus."
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Frisuren-Polls (WhatsApp-Freunde-Umfrage)",
      description: "Du kannst dich nicht entscheiden? Erstelle mit 1 Klick eine kostenlose Umfrage und teile sie per WhatsApp mit deinen Freunden, um Feedback einzuholen."
    }
  ];

  const comparisonData = [
    { feature: "Foto-Upload & Analyse", frisurenAi: "Eigenes Bild hochladen (100% Fotorealistisch)", standardFilter: "Unpassende 2D-Schablonen / Perücken-Overlay" },
    { feature: "Gesichtsform-Erkennung", frisurenAi: "Präzise KI-Erfassung (Oval, Rund, Eckig, Herz)", standardFilter: "Keine Anpassung an Gesichtsform" },
    { feature: "Erstanalyse mit Bild", frisurenAi: "100% Kostenlos", standardFilter: "Meist In-App-Abo vor erster Vorschau" },
    { feature: "Pflegetipps & Farbberatung", frisurenAi: "Inklusive & individuell auf dich abgestimmt", standardFilter: "Gar nicht vorhanden" },
    { feature: "App-Download erforderlich?", frisurenAi: "Nein, direkt im Web-Browser", standardFilter: "App Store / Play Store Download Pflicht" },
    { feature: "Datenschutz & Speicherung", frisurenAi: "100% DSGVO-konform, verschlüsselt", standardFilter: "Häufig Datenspeicherung beim Anbieter" }
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
            <Camera size={14} className="animate-pulse" />
            <span>#1 KI Foto-Styling Studio 2026 – Ohne App-Download</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            Frisuren auf Foto testen: <span className="italic text-[#FF9EBE] block sm:inline">Frisuren testen & Bild hochladen</span>
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed">
            Möchtest du <strong>Frisuren auf deinem Foto testen</strong> und sehen, wie dir ein neuer Schnitt oder eine neue Haarfarbe steht? Bei Frisuren.ai musst du nur dein <strong>Bild hochladen und Frisuren testen</strong> – mit kostenloser KI-Erstanalyse, Gesichtsformbestimmung, Pflegetipps und Farbberatung!
          </p>
        </div>

        {/* Big CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-brand-primary/20 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload size={18} className="text-[#FF9EBE]" />
            <span>Jetzt Bild hochladen & Frisuren auf Foto testen</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/50">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF9EBE]" /> Erstanalyse mit Bild gratis</span>
            <span className="opacity-25">•</span>
            <span>Keine Registrierung nötig</span>
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
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Vollständiges KI-Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Alles inklusive, wenn du dein Bild hochlädst</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Einfach Bild hochladen: Frisuren.ai kombiniert fotorealistisches KI-Styling mit professioneller Typ- und Pflegeberatung.
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
                <ImageIcon size={12} />
                <span>100% Fotorealistische KI-Anpassung</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
                Dein Gesicht bleibt 100% original – nur die Frisur verändert sich!
              </h2>

              <p className="text-brand-primary/70 text-sm md:text-base leading-relaxed">
                Herkömmliche Apps legen unnatürliche Perücken über deine Stirn. Bei Frisuren.ai werden dein Gesicht, deine Augen und deine Hauttöne zu 100% bewahrt. Wenn du bei uns ein <strong>Bild hochlädst um Frisuren zu testen</strong>, wird der Haarschnitt nahtlos an deine echte Kopfform angepasst.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs md:text-sm font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>Gesichtsform-Analyse (Oval, Rund, Eckig, Herz)</span>
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
                  <span>1 Click WhatsApp-Poll für Feedback von Freunden</span>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onStartAnalysis}
                  className="px-8 py-4 bg-brand-primary text-white font-bold rounded-xl text-xs sm:text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Bild hochladen & Frisuren testen</span>
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
                  <span className="text-[10px] font-bold text-brand-primary/40 uppercase tracking-widest">Frisuren.ai Photo Studio</span>
                </div>

                <div className="bg-[#FF9EBE]/10 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold text-brand-primary">
                  <Sparkles className="text-[#FF9EBE] shrink-0" size={18} />
                  <span>Foto analysiert: Ovales Gesicht – 9 perfekte Cut-Matchings</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-[#FF9EBE]/20 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      Pixie Cut ✨
                    </div>
                  </div>
                  <div className="bg-black/5 rounded-xl aspect-square flex flex-col items-center justify-center p-2 text-center border border-black/5 relative overflow-hidden group">
                    <div className="w-full h-full bg-gradient-to-tr from-purple-500/10 to-transparent rounded-lg flex items-center justify-center font-bold text-xs">
                      Wolf Cut 💇‍♀️
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#FF9EBE] tracking-wider">Erstanalyse Pflegetipp</span>
                  <p className="text-[11px] text-brand-primary/80 leading-snug">
                    Verwende nach dem Waschen ein leichtes Hitzeschutzspray für natürlichen Glanz.
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
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Der direkte Vergleich</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Frisuren.ai KI-Foto-Test vs. Einfache Filter</h2>
          <p className="text-brand-primary/60 text-sm max-w-xl mx-auto">
            Warum das Testen von Frisuren auf deinem eigenen Foto mit KI der beste Weg vor dem Friseurbesuch ist.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-black/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white text-xs uppercase tracking-widest font-bold">
                  <th className="p-4 md:p-6">Feature</th>
                  <th className="p-4 md:p-6 bg-[#FF9EBE] text-white flex items-center gap-1.5">
                    <Sparkles size={14} /> Frisuren.ai
                  </th>
                  <th className="p-4 md:p-6 opacity-75">Klassische 2D-Perücken-Filter</th>
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
                      <span>{row.standardFilter}</span>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Einfache Schritt-für-Schritt-Anleitung</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">So kannst du Frisuren auf Foto testen</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-lg font-serif">Eigenes Bild hochladen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Wähle ein gut belichtetes Porträtfoto von dir aus (von vorne, ohne verdecktes Gesicht). Keine Registrierung nötig.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-lg font-serif">KI-Foto-Analyse erhalten</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                In 3 Sekunden bestimmt die KI deine Gesichtsform, generiert 9 passende Haarschnitte auf deinem Bild und liefert Pflegetipps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#FF9EBE] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-lg font-serif">Stylen & Feedback einholen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Passe Haarfarben im Studio an oder schicke deine neuen Looks per WhatsApp-Umfrage an deine Freunde.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SEO ARTICLE */}
      <article className="max-w-4xl mx-auto px-4 space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-black/5 shadow-sm text-brand-primary/80 text-sm md:text-base leading-relaxed">
        <div className="space-y-4 border-b border-black/10 pb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Ratgeber & Foto-Guide</span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-brand-primary">
            Frisuren auf Foto testen: Der ultimative Ratgeber für das perfekte Bild-Ergebnis
          </h2>
        </div>

        <p>
          Wer eine Typveränderung wagt, möchte sich 100% sicher sein. Wenn du <strong>Frisuren auf Foto testen</strong> möchtest, ist das hochgeladene Ausgangsbild der Schlüssel zu einem perfekten KI-Ergebnis. Hier erfährst du, wie du das beste Foto für deinen Frisurentest auswählst und worauf es ankommt.
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Tipps für das optimale Foto beim Frisuren testen (Bild hochladen)
        </h3>
        <p>
          Damit die KI deine Gesichtsform (oval, rund, eckig, herzförmig) exakt berechnen und dir fotorealistische Frisuren vorschlagen kann, beachte folgende Punkte beim Foto-Upload:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
          <li><strong>Blick nach vorne:</strong> Schaue direkt in die Kamera, damit die Gesichtssymmetrie klar erkennbar ist.</li>
          <li><strong>Gutes Tageslicht:</strong> Vermeide scharfe Schatten im Gesicht für eine optimale Haut- und Augen-Erkennung.</li>
          <li><strong>Freies Gesicht:</strong> Halte Haare aus der Stirn oder binde sie nach hinten, damit die KI die Gesichtskonturen präzise scannen kann.</li>
        </ul>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Gesichtsform-Erkennung & Pflegetipps inklusive
        </h3>
        <p>
          Sobald du dein <strong>Bild hochlädst und Frisuren testest</strong>, ermittelt die KI von Frisuren.ai nicht nur 9 passende Haarschnitte, sondern liefert dir eine vollständige Typberatung. Du erhältst individuelle <strong>Pflegetipps</strong> für deine spezifische Haarstruktur (fein, dick, gewellt) sowie 3 typgerechte <strong>Farbempfehlungen</strong> für deinen Teint.
        </p>

        <div className="p-6 bg-[#FF9EBE]/10 rounded-2xl border border-[#FF9EBE]/30 my-4 space-y-2">
          <h4 className="font-bold text-brand-primary flex items-center gap-2">
            <Sparkles size={16} className="text-[#FF9EBE]" />
            Bereit für deinen KI-Foto-Test?
          </h4>
          <p className="text-xs text-brand-primary/70">
            Lade jetzt dein Bild hoch und teste in Sekundenschnelle deine neuen Lieblings-Frisuren kostenlos auf deinem eigenen Foto!
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
          <h2 className="text-3xl md:text-4xl font-serif font-bold">FAQ: Frisuren auf Foto testen</h2>
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
              Jetzt Bild hochladen & Frisuren auf Foto testen! 📸✂️
            </h2>
            <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium">
              Lade kostenlos ein Porträtfoto hoch und erfahre in wenigen Sekunden, welche Frisur und welche Haarfarbe am besten zu deinem Gesicht passen.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-white text-[#FF9EBE] font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Bild hochladen & Foto-Test starten</span>
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
    q: "Wie kann ich Frisuren auf meinem Foto testen?",
    a: "Lade einfach dein Selfie auf Frisuren.ai hoch. Unsere Künstliche Intelligenz analysiert dein Bild in 3 Sekunden, erkennt deine Gesichtsform und passt 9 verschiedene Haarschnitte fotorealistisch an dein Gesicht an."
  },
  {
    q: "Ist das Frisuren testen mit Bild hochladen wirklich kostenlos?",
    a: "Ja, deine Erstanalyse mit dem hochgeladenen Foto ist 100% kostenlos. Du erhältst eine Gesichtsform-Analyse, 9 individuelle Frisuren-Vorschläge, Pflegetipps für deine Haarstruktur und 3 Farbtipps gratis."
  },
  {
    q: "Welches Foto eignet sich am besten für den Frisurentest?",
    a: "Ein gutes Frontal-Selfie bei hellem Tageslicht, bei dem dein Gesicht und deine Stirn gut erkennbar sind. Vermeide stark seitliche Winkel oder verdeckende Sonnenbrillen."
  },
  {
    q: "Sieht das Ergebnis wirklich realistisch aus?",
    a: "Ja! Unsere modernste KI behält dein Gesicht, deine Augen und Hauttöne zu 100% unverändert bei und tauscht lediglich die Haarschnitte natürlich und fotorealistisch aus."
  },
  {
    q: "Bekomme ich auch Pflegetipps und Farbberatung?",
    a: "Ja! Zu jedem Foto-Test erhältst du persönliche Pflegetipps für deine Haarstruktur sowie 3 typgerechte Farbtipps, die perfekt zu deinem Teint passen."
  },
  {
    q: "Kann ich meine Frisuren-Fotos mit Freunden teilen?",
    a: "Ja! Du kannst mit 1 Klick eine kostenlose Umfrage aus deinen Ergebnissen erstellen und den Link per WhatsApp an deine Freunde schicken, um abstimmen zu lassen."
  }
];
