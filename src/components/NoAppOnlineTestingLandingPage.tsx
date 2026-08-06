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
  Globe,
  Smartphone,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NoAppOnlineTestingLandingPageProps {
  onStartAnalysis: () => void;
}

export default function NoAppOnlineTestingLandingPage({ onStartAnalysis }: NoAppOnlineTestingLandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Dynamic SEO Setup: document title, meta tags, and structured JSON-LD schema
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Frisuren online testen ohne App – Virtueller Frisuren-Simulator im Web | Frisuren.ai";

    let metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Frisuren online testen ohne App: Probiere neue Haarschnitte & Haarfarben direkt im Web-Browser auf deinem Foto aus. Gratis Erstanalyse, KI-Gesichtsformbestimmung & Pflegetipps – ohne Download & ohne Installation!');
    }

    let canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical ? canonical.getAttribute('href') : '';
    if (canonical) {
      canonical.setAttribute('href', 'https://frisuren.ai/frisuren-online-testen-ohne-app');
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-noapp-jsonld';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Frisuren.ai - Frisuren online testen ohne App",
          "operatingSystem": "All (Web Browser, iOS, Android, Windows, Mac)",
          "applicationCategory": "LifestyleApplication",
          "description": "Die führende Lösung zum Frisuren online testen ohne App-Installation. KI-basierte Erstanalyse mit kostenlosem Bild, Gesichtsformbestimmung, Pflegetipps & Farbberatung direkt im Browser.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "24100"
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
      const injectedScript = document.getElementById('seo-noapp-jsonld');
      if (injectedScript) injectedScript.remove();
    };
  }, []);

  const advantagesNoApp = [
    {
      icon: <Globe className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Sofort im Browser nutzbar",
      description: "Keine Wartezeit für Downloads im App Store oder Google Play Store. Öffne einfach die Webseite auf deinem Handy oder PC und lege sofort los."
    },
    {
      icon: <HardDrive className="w-6 h-6 text-[#FF9EBE]" />,
      title: "0 MB Speicherplatzbedarf",
      description: "Schone den Speicher deines Smartphones. Keine riesigen App-Updates oder versteckte Datenmengen auf deinem Gerät."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Maximaler Datenschutz",
      description: "Kein Zugriff auf deinen Standort, deine Kontakte oder Hintergrunddaten. Volle DSGVO-Konformität und automatische Löschung."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Kompatibel mit jedem Gerät",
      description: "Egal ob iPhone (Safari), Android (Chrome), Tablet oder Desktop-Computer – Frisuren.ai funktioniert überall nahtlos."
    }
  ];

  const featuresList = [
    {
      icon: <Scan className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Erstanalyse mit kostenlosem Bild",
      description: "Lade ein Selfie hoch – unsere KI analysiert in 3 Sekunden deine Gesichtsform (oval, rund, eckig, herzförmig) sowie Stirn- und Kinnpartie."
    },
    {
      icon: <Scissors className="w-6 h-6 text-[#FF9EBE]" />,
      title: "9 maßgeschneiderte Frisuren-Vorschläge",
      description: "Erhalte ein individuelles Haarschnitt-Portfolio, das exakt auf deine Gesichtsproportionen abgestimmt ist – von Trend-Cuts bis zu Klassikern."
    },
    {
      icon: <Droplet className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Individuelle Pflegetipps & Haar-Analyse",
      description: "Profitiere von konkreten Empfehlungen für deine Haarstruktur (fein, dick, lockig) sowie Styling Do's & Don'ts vom KI-Stylisten."
    },
    {
      icon: <Palette className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Typgerechte Farbberatung",
      description: "Entdecke 3 passende Haarfarben-Empfehlungen, die deinem Teint und Hautunterton schmeicheln – von Balayage bis zu kühlem Blond."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Virtuelles Styling Studio",
      description: "Teste verschiedene Haarfarben und Längen fotorealistisch auf deinem hochgeladenen Foto ohne Risiko beim Friseur."
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF9EBE]" />,
      title: "Frisuren-Polls (WhatsApp-Umfrage)",
      description: "Erstelle mit 1 Klick eine kostenlose Umfrage und schicke sie per WhatsApp an deine Freunde, um den besten Schnitt zu wählen."
    }
  ];

  const comparisonTable = [
    { feature: "Installation / Download", webApp: "Kein Download (100% Web-Browser)", appStore: "Pflicht im App Store / Play Store" },
    { feature: "Speicherplatz auf Handy", webApp: "0 Megabyte", appStore: "Oft 100 - 300 Megabyte" },
    { feature: "Geräte-Kompatibilität", webApp: "Jedes Gerät (iOS, Android, PC, Mac)", appStore: "NUR auf bestimmten mobilen Geräten" },
    { feature: "Erstanalyse mit Bild", webApp: "100% Kostenlos", appStore: "Häufig sofortige Paywall vor Vorschau" },
    { feature: "Datenschutz & Tracking", webApp: "DSGVO-konform, kein App-Tracking", appStore: "Häufig Berechtigungen für Kamera & Kontakte" },
    { feature: "Pflegetipps & Farbberatung", webApp: "Inklusive & individuell", appStore: "Gar nicht vorhanden" }
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
            <Globe size={14} className="animate-pulse" />
            <span>100% Im Browser – Frisuren online testen ohne App</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight">
            Frisuren online testen ohne App: <span className="italic text-[#FF9EBE] block sm:inline">Direkt auf deinem Foto</span>
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed">
            Du möchtest <strong>Frisuren online testen ohne eine App installieren zu müssen</strong>? Mit Frisuren.ai probierst du neue Haarschnitte, Haarfarben und Stylings fotorealistisch direkt in deinem Web-Browser aus. Inklusive kostenloser KI-Erstanalyse mit deinem Bild, Pflegetipps und Farbberatung.
          </p>
        </div>

        {/* Big CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-brand-primary/20 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <Upload size={18} className="text-[#FF9EBE]" />
            <span>Jetzt Foto hochladen & Online testen (Ohne App)</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/50">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF9EBE]" /> 0 MB Speicherplatz</span>
            <span className="opacity-25">•</span>
            <span>Keine App-Installation</span>
            <span className="opacity-25">•</span>
            <span>Erstanalyse mit Bild gratis</span>
          </div>
        </div>

        {/* Social Proof */}
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

      {/* 2. ADVANTAGES OF NO-APP ONLINE TESTING */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Warum ohne App?</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">4 Vorteile: Frisuren online testen ohne App</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Warum Speicherplatz verschwenden und komplizierte App-Store-Downloads durchführen, wenn es direkt im Browser viel schneller und sicherer geht?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {advantagesNoApp.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-xl flex items-start gap-6 hover:border-[#FF9EBE]/40 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FF9EBE]/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif">{item.title}</h3>
                <p className="text-xs md:text-sm text-brand-primary/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. COMPLETE FEATURE SET */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Alle Features im Browser</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Vollständiges Friseur-Studio in deiner Tasche</h2>
          <p className="text-brand-primary/60 text-sm md:text-base">
            Auch ohne App-Installation steht dir der volle Funktionsumfang unserer hochmodernen KI-Styling-Plattform zur Verfügung.
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

      {/* 4. COMPARISON MATRIX: BROWSER VS APP STORE DOWNLOAD */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Der direkte Vergleich</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Online-Browser vs. App Store Downloads</h2>
          <p className="text-brand-primary/60 text-sm max-w-xl mx-auto">
            Sieh selbst, warum die Web-App von Frisuren.ai die komfortabelste Lösung für deinen Frisuren-Test ist.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-black/10 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-primary text-white text-xs uppercase tracking-widest font-bold">
                  <th className="p-4 md:p-6">Eigenschaft</th>
                  <th className="p-4 md:p-6 bg-[#FF9EBE] text-white flex items-center gap-1.5">
                    <Sparkles size={14} /> Frisuren.ai (Ohne App)
                  </th>
                  <th className="p-4 md:p-6 opacity-75">Klassische App Store Download App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-xs md:text-sm font-medium">
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-black/[0.01]'}>
                    <td className="p-4 md:p-6 font-bold">{row.feature}</td>
                    <td className="p-4 md:p-6 text-emerald-600 font-bold bg-[#FF9EBE]/5 flex items-center gap-2">
                      <Check size={16} className="text-emerald-500 shrink-0" />
                      <span>{row.webApp}</span>
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

      {/* 5. HOW IT WORKS - 3 STEPS */}
      <section className="max-w-5xl mx-auto px-4 py-12 bg-[#FF9EBE]/5 rounded-[3rem] border border-[#FF9EBE]/15">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Blitzschneller Start</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">In 3 Schritten Frisuren online testen ohne App</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-lg font-serif">Foto im Browser hochladen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Klicke einfach auf "Foto hochladen", wähle ein Bild von deinem Gerät oder nimm ein direktes Foto auf. Keine App erforderlich.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-lg font-serif">KI-Erstanalyse erhalten</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Unsere Cloud-KI berechnet deine Gesichtsform, schlägt 9 passende Haarschnitte vor und erstellt deine individuellen Pflegetipps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl space-y-4 border border-black/5 shadow-md">
              <div className="w-10 h-10 rounded-full bg-[#FF9EBE] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-lg font-serif">Ergebnisse ansehen & teilen</h3>
              <p className="text-xs text-brand-primary/70 leading-relaxed">
                Betrachte deine neuen Looks online, verändere Haarfarben im Studio oder befrage deine Freunde per WhatsApp-Umfrage.
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
            Frisuren online testen ohne App: Die Zukunft des virtuellen Hair-Stylings
          </h2>
        </div>

        <p>
          Wer auf der Suche nach einer Veränderung auf dem Kopf ist, möchte am liebsten sofort sehen, wie ein neuer Cut oder eine neue Haarfarbe am eigenen Gesicht wirkt. Früher bedeutete das: App Store öffnen, Speicherplatz freischaufeln, lange Downloads abwarten und am Ende oft feststellen, dass die App Geld kostet oder voller Werbung ist.
        </p>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Warum der Web-Browser die moderne Alternative zur App ist
        </h3>
        <p>
          Dank moderner Progressive Web App (PWA) Technologien und leistungsstarker Server-KI im Hintergrund werden rechenintensive KI-Analysen direkt in der Cloud durchgeführt. Das bedeutet für dich:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-xs md:text-sm">
          <li><strong>Kein Speicherplatzverlust:</strong> Dein Smartphone bleibt schlank und schnell.</li>
          <li><strong>Keine Installationsbarriere:</strong> Du musst keine Passwort-Bestätigungen im App Store eingeben.</li>
          <li><strong>Überall verfügbar:</strong> Starte deinen Test am Smartphone und schaue dir die Ergebnisse später bequem am großen Bildschirm deines Laptops an.</li>
        </ul>

        <h3 className="text-xl font-bold font-serif text-brand-primary pt-2">
          Erstanalyse mit kostenlosem Bild & typgerechter Beratung
        </h3>
        <p>
          Wenn du <strong>Frisuren online testen ohne App</strong> wählst, musst du auf keinerlei Qualität verzichten. Die KI von Frisuren.ai erkennt millimetergenau deine Gesichtsform (oval, rund, eckig, herzförmig) und schlägt dir Schnitte vor, die deine natürliche Schönheit betonen. Dazu erhältst du wertvolle <strong>Pflegetipps</strong> für dein Haar und 3 konkrete <strong>Farbempfehlungen</strong> für deinen Hauttyp.
        </p>

        <div className="p-6 bg-[#FF9EBE]/10 rounded-2xl border border-[#FF9EBE]/30 my-4 space-y-2">
          <h4 className="font-bold text-brand-primary flex items-center gap-2">
            <Sparkles size={16} className="text-[#FF9EBE]" />
            Sofort im Browser ausprobieren!
          </h4>
          <p className="text-xs text-brand-primary/70">
            Klicke auf den Button, lade ein Foto hoch und starte deinen kostenlosen Online-Frisurentest – ohne App, ohne Download!
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
          <h2 className="text-3xl md:text-4xl font-serif font-bold">FAQ: Frisuren online testen ohne App</h2>
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
              Jetzt Frisuren online testen – Ganz ohne App! ✂️
            </h2>
            <p className="text-white/90 max-w-xl mx-auto text-sm sm:text-base md:text-lg font-medium">
              Lade direkt in deinem Browser ein Foto hoch und erhalte in Sekundenschnelle deine kostenlose Erstanalyse inklusive 9 Frisurenvorschlägen, Pflegetipps & Farbberatung.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-white text-[#FF9EBE] font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Foto hochladen & Online-Test starten</span>
              <ArrowRight size={16} />
            </button>
            
            <p className="mt-6 text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] flex flex-wrap items-center justify-center gap-3">
              <span>Keine App-Installation</span>
              <span>•</span>
              <span>0 MB Speicherplatz</span>
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
    q: "Kann ich Frisuren wirklich ohne App-Download online testen?",
    a: "Ja, absolut! Frisuren.ai läuft zu 100% in deinem normalen Web-Browser (z.B. Safari, Chrome, Firefox). Du musst keine App aus dem App Store oder Google Play Store herunterladen."
  },
  {
    q: "Ist der Online-Frisurentest ohne App kostenlos?",
    a: "Ja, die Erstanalyse mit deinem hochgeladenen Foto ist zu 100% kostenlos. Du erhältst eine automatische Gesichtsform-Analyse, 9 passende Frisuren-Empfehlungen, Pflegetipps für dein Haar und 3 Farbempfehlungen."
  },
  {
    q: "Funktioniert das Ganze auf dem iPhone und Android-Handy?",
    a: "Ja! Da Frisuren.ai im Browser läuft, funktioniert es perfekt auf jedem Smartphone (iPhone, Samsung, Google Pixel etc.), Tablet, iPad sowie auf Desktop-PCs und Mac-Computern."
  },
  {
    q: "Was brauche ich für den Online-Test?",
    a: "Du benötigst lediglich ein gut belichtetes Porträtfoto (Selfie) von dir von vorne. Lade es direkt im Browser hoch – unsere KI erledigt den Rest in 3 Sekunden."
  },
  {
    q: "Werden meine Fotos auf meinem Handy oder Server gespeichert?",
    a: "Deine Fotos werden verschlüsselt und DSGVO-konform verarbeitet. Sie belegen keinen Speicherplatz auf deinem Smartphone."
  },
  {
    q: "Kann ich im Browser auch Haarfarben und eigene Frisurenwünsche testen?",
    a: "Ja, in unserem virtuellen Styling Studio kannst du direkt im Browser verschiedene Haarfarben testen, Haarlängen verändern oder deinem KI-Stylisten freie Anweisungen geben."
  }
];
