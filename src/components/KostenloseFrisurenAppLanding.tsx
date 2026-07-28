import React, { useState, useEffect, useRef } from 'react';
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
  Info,
  Heart,
  Star,
  Smartphone,
  Globe,
  Lock,
  Camera,
  Check,
  X,
  Layers,
  Sparkle,
  Smile,
  Sliders,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KostenloseFrisurenAppLandingProps {
  onStartAnalysis: () => void;
  onFileUpload?: (file: File) => void;
}

export default function KostenloseFrisurenAppLanding({ 
  onStartAnalysis,
  onFileUpload 
}: KostenloseFrisurenAppLandingProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<'damen' | 'herren' | 'kurz' | 'trend' | 'farben'>('damen');
  const [dragActive, setDragActive] = useState(false);

  // Set meta title and injection of JSON-LD for rich snippets
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "Kostenlose Frisuren App mit KI | Frisuren App Kostenlos Testen (2026)";

    // Inject JSON-LD structured data for Google SEO
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "@id": "https://frisuren.ai/frisuren-app-kostenlos#webapp",
          "name": "Frisuren.ai - Kostenlose Frisuren App mit KI",
          "url": "https://frisuren.ai/frisuren-app-kostenlos",
          "applicationCategory": "LifestyleApplication",
          "operatingSystem": "All (iOS, Android, Windows, macOS, Web)",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "14820",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "Kostenlose KI Gesichtsform-Analyse",
            "100+ Frisuren für Frauen & Männer kostenlos anprobieren",
            "Fotorealistischer Haarfarben-Simulator",
            "Keine Installation im App Store nötig (PWA)",
            "100% DSGVO-konform mit automatischer Löschung"
          ]
        },
        {
          "@type": "FAQPage",
          "@id": "https://frisuren.ai/frisuren-app-kostenlos#faq",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Ist diese Frisuren App wirklich 100% kostenlos?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ja! Bei Frisuren.ai kannst du dein Foto völlig kostenlos hochladen, deine Gesichtsform per KI analysieren lassen und direkt 9 maßgeschneiderte Frisurenvorschläge sowie Haarfarben am eigenen Bild gratis testen."
              }
            },
            {
              "@type": "Question",
              "name": "Muss ich eine App im App Store oder Google Play Store herunterladen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nein, das ist das Beste an Frisuren.ai. Es handelt sich um eine moderne Web-App (PWA). Du kannst alle Funktionen direkt in deinem Browser auf dem Smartphone (iPhone & Android) oder PC nutzen – ohne Speicherplatz zu verbrauchen."
              }
            },
            {
              "@type": "Question",
              "name": "Wie realistisch sind die Frisurenvorschläge im Vergleich zu echten Haarschnitten?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Dank fortschrittlicher Gemini 3.5 KI-Technologie werden deine Gesichtszüge, Beleuchtung und Knochenstruktur exakt berücksichtigt. Im Gegensatz zu alten 2D-Perücken-Apps wird die neue Frisur fotorealistisch in dein Bild eingearbeitet."
              }
            },
            {
              "@type": "Question",
              "name": "Welche Frisuren kann ich mit der kostenlosen Frisuren App testen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Du kannst hunderte Styles ausprobieren: Von trendigen Kurzhaarfrisuren (Pixie, Bixie, Undercut) über mittellange Bobs und Wolf Cuts bis hin zu Langhaarfrisuren mit Stufen oder Butterfly Cut – sowohl für Damen als auch Herren."
              }
            },
            {
              "@type": "Question",
              "name": "Wie schützt Frisuren.ai meine Privatsphäre und Fotos?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ihre Sicherheit hat höchste Priorität. Alle Uploads sind SSL-verschlüsselt und zu 100% DSGVO-konform. Deine Fotos werden niemals verkauft oder öffentlich gezeigt und nach der Erstellung deiner Vorschau automatisch gelöscht."
              }
            }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "@id": "https://frisuren.ai/frisuren-app-kostenlos#breadcrumb",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://frisuren.ai/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Kostenlose Frisuren App",
              "item": "https://frisuren.ai/frisuren-app-kostenlos"
            }
          ]
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'json-ld-frisuren-app';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      const el = document.getElementById('json-ld-frisuren-app');
      if (el) el.remove();
    };
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        if (onFileUpload) {
          onFileUpload(file);
        } else {
          onStartAnalysis();
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (onFileUpload) {
        onFileUpload(file);
      } else {
        onStartAnalysis();
      }
    }
  };

  const faqs = [
    {
      q: "Ist diese Frisuren App wirklich 100% kostenlos?",
      a: "Ja, absolut! Du kannst Frisuren.ai komplett kostenfrei ausprobieren. Lade einfach dein Porträtfoto hoch und erhalte innerhalb weniger Sekunden eine professionelle Gesichtsform-Analyse sowie 9 individuelle Frisuren- und Farbvorschläge auf deinem eigenen Foto – ganz ohne versteckte Kosten oder Abo-Verpflichtungen."
    },
    {
      q: "Muss ich eine App im App Store oder Google Play Store herunterladen?",
      a: "Nein, du musst keinen Speicherplatz auf deinem Smartphone opfern! Frisuren.ai ist eine hochmoderne Web-App (PWA). Du kannst sie direkt über deinen Internet-Browser auf iOS (iPhone, iPad), Android oder am PC nutzen. Auf Wunsch kannst du sie sogar mit einem Klick als Shortcut auf deinen Startbildschirm legen."
    },
    {
      q: "Wie unterscheidet sich Frisuren.ai von alten Frisuren-Simulatoren?",
      a: "Herkömmliche Frisuren-Apps legen meist nur ungenaue 2D-Perücken über dein Gesicht. Frisuren.ai nutzt hochentwickelte KI (Gemini 3.5), um deine Gesichtsstruktur, Lichtstimmung, Hautton und Blickrichtung exakt zu verstehen. Das Ergebnis ist eine fotorealistische Vorschau, bei der die Haare echt aussehen."
    },
    {
      q: "Welche Frisuren & Haarfarben kann ich gratis testen?",
      a: "Unsere kostenlose Frisuren App bietet Hunderte Kombinationen: Für Damen gibt es Kurzhaarschnitte (Pixie, Bob), Mittellang (Lob, Clavi Cut) und Langhaarschnitte (Butterfly Cut, Stufen), sowie Trend-Looks 2026. Für Herren stehen Taper Fades, Buzz Cuts, Pompadour und Undercuts bereit. Dazu kannst du Haarfarben wie Blond, Schokobraun, Kupfer, Balayage und Pastelltöne testen."
    },
    {
      q: "Sind meine hochgeladenen Fotos sicher und geschützt?",
      a: "Deine Privatsphäre steht an oberster Stelle. Alle Bilddaten werden über eine SSL-verschlüsselte Verbindung verarbeitet. Wir verkaufen oder teilen deine Bilder niemals mit Dritten. Nach Beendigung deiner Analyse werden temporäre Fotodaten automatisch vom Server gelöscht (100% DSGVO-konform)."
    },
    {
      q: "Kann ich das Ergebnis direkt meinem Friseur zeigen?",
      a: "Ja, perfekt dafür ist die App gedacht! Jede generierte Frisur enthält detaillierte Profi-Anweisungen für deinen Friseur oder Barber (z. B. genaue Millimeter-Angaben, Schnitttechniken und Empfehlungen für Styling-Produkte). Du kannst dein Bild speichern oder direkt per WhatsApp/Instagram teilen."
    }
  ];

  const categoryStyles = {
    damen: [
      { name: 'Butterfly Cut', desc: 'Schwungvolle Stufen, die das Gesicht umspielen & für maximales Volumen sorgen.', tag: 'Top Trend 2026' },
      { name: 'Classic French Bob', desc: 'Kinnlanger Eleganz-Klassiker mit sanften Fransen & zeitlosem Pariser Vibe.', tag: 'Beliebt' },
      { name: 'Soft Pixie Cut', desc: 'Moderne Kurzhaarfrisur mit sanften Konturen – hebt Wangenknochen hervor.', tag: 'Pflegeleicht' }
    ],
    herren: [
      { name: 'Modern Crop Fade', desc: 'Präziser Übergang an den Seiten mit strukturiertem Deckhaar oben.', tag: 'Herren #1' },
      { name: 'Classic Side Part', desc: 'Souveräner Gentleman-Look mit klarem Scheitel – ideal für Business & Alltag.', tag: 'Zeitlos' },
      { name: 'Textured Flow Cut', desc: 'Lässige mittellange Welle mit natürlichem Schwung & dynamischer Textur.', tag: 'Trend 2026' }
    ],
    kurz: [
      { name: 'Bixie Cut', desc: 'Das Beste aus Bob & Pixie – frech, volumenseitig strukturiert und extrem stilvoll.', tag: 'Kurzhaar Trend' },
      { name: 'Sharp Box Bob', desc: 'Exakt geschnittene Kante auf Kieferhöhe – verleiht feinem Haar Fülle.', tag: 'Volumen-Tipp' },
      { name: 'Undercut Pixie', desc: 'Kurze Seiten mit längerem, wandelbarem Deckhaar für mutige Akzente.', tag: 'Edgy' }
    ],
    trend: [
      { name: 'Mixie Cut', desc: 'Kombination aus Mullet & Pixie – rockig, modern und voller Charakter.', tag: 'New 2026' },
      { name: 'Curtain Bangs & Lobs', desc: 'Vorhang-Pony kombiniert mit langem Bob – steht fast jeder Gesichtsform.', tag: 'Allrounder' },
      { name: 'Wolf Cut Soft', desc: 'Fransiger Stufenschnitt mit sanftem Verlauf für ein wildes, natürliches Finish.', tag: 'Viral Hit' }
    ],
    farben: [
      { name: 'Caramel Balayage', desc: 'Sanfte, sonnengeküsste Highlights mit fließendem Farbverlauf.', tag: 'Glow-Effekt' },
      { name: 'Warmes Schokobraun', desc: 'Tiefes, seidig glänzendes Braun – lässt Augen strahlen.', tag: 'Edel' },
      { name: 'Kupferglanz / Copper', desc: 'Trendige, feurige Reflexe für ein ausdrucksstarkes Farbstatement.', tag: 'Herbst & Frühjahr' }
    ]
  };

  return (
    <div className="space-y-16 md:space-y-32 pb-24 text-brand-primary">
      
      {/* Hidden input for file selection */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center space-y-8 py-6 md:py-10 px-4"
      >
        <div className="space-y-4">
          {/* Top Rating Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF9EBE]/15 via-purple-500/10 to-[#FF9EBE]/15 border border-[#FF9EBE]/30 rounded-full text-xs font-black uppercase tracking-widest text-[#FF9EBE] shadow-sm">
            <Sparkles size={14} className="animate-pulse" />
            <span>#1 Kostenlose Frisuren App mit KI (2026)</span>
            <span className="hidden sm:inline-block opacity-40">•</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-brand-primary/80 font-bold">
              <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 (14.800+ Votes)
            </span>
          </div>
          
          {/* Main H1 Title optimized for target keywords */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight text-brand-primary">
            Kostenlose <span className="italic text-[#FF9EBE]">Frisuren App</span> – Frisuren kostenlos ausprobieren
          </h1>
          
          {/* SEO Lead Paragraph */}
          <p className="text-base sm:text-lg md:text-xl text-brand-primary/70 max-w-3xl mx-auto leading-relaxed text-balance">
            Die beste <strong>kostenlose Frisuren App</strong> im Web! Teste hunderte Damen- & Herren-Frisuren, Trend-Haarschnitte 2026 und neue Haarfarben fotorealistisch an deinem eigenen Foto – <strong>100% gratis, ohne Abo & ohne App-Download</strong>.
          </p>
        </div>

        {/* HERO UPLOAD WIDGET (Interactive Drag & Drop) */}
        <div 
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative max-w-2xl mx-auto border-2 border-dashed rounded-[3rem] p-8 sm:p-12 cursor-pointer transition-all duration-300 shadow-2xl ${
            dragActive 
              ? 'border-[#FF9EBE] bg-[#FF9EBE]/10 scale-[1.02]' 
              : 'border-black/15 bg-white hover:border-[#FF9EBE] hover:bg-gradient-to-b hover:from-white hover:to-pink-50/30'
          }`}
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#FF9EBE]/20 via-purple-500/10 to-[#FF9EBE]/20 rounded-[3rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none -z-10" />

          <div className="flex flex-col items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#FF9EBE] to-[#e8789d] text-white rounded-3xl flex items-center justify-center shadow-lg shadow-[#FF9EBE]/30 group-hover:scale-110 transition-transform duration-300">
              <Upload size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-brand-primary">
                Foto hochladen & Frisuren kostenlos testen
              </h2>
              <p className="text-xs sm:text-sm text-brand-primary/60 font-medium">
                Klicke hier oder ziehe dein Porträtfoto (Selfie) direkt hinein
              </p>
            </div>

            <div className="inline-flex items-center gap-3 px-6 py-3 bg-brand-primary hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-md transition-all group-hover:scale-105">
              <span>Jetzt gratis Foto wählen</span>
              <ChevronRight size={16} />
            </div>

            {/* Quick Micro Trust Icons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-semibold text-brand-primary/50">
              <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-[#FF9EBE]" /> 100% DSGVO-Sicher</span>
              <span className="flex items-center gap-1.5"><Zap size={14} className="text-amber-500" /> KI-Ergebnis in 5 Sek.</span>
              <span className="flex items-center gap-1.5"><Smartphone size={14} className="text-indigo-500" /> Kein Download nötig</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto text-xs font-bold text-brand-primary/70">
          <div className="px-4 py-2 bg-white rounded-xl border border-black/5 shadow-2xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Kostenloser Frisuren-Simulator</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-black/5 shadow-2xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>KI Gesichtsform-Erkennung</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-black/5 shadow-2xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Haarfarben Anprobieren</span>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-black/5 shadow-2xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span>Damen & Herren Styles</span>
          </div>
        </div>
      </motion.section>

      {/* WHY FRISUREN.AI IS THE #1 FREE HAIRSTYLE APP */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-br from-white via-pink-50/20 to-purple-50/30 rounded-[3rem] p-8 md:p-14 border border-black/5 shadow-xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="px-3.5 py-1 bg-[#FF9EBE]/15 text-[#FF9EBE] rounded-full text-[10px] font-black uppercase tracking-widest">
              Warum Frisuren.ai?
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">
              Die Vorteile unserer kostenlosen Frisuren App
            </h2>
            <p className="text-sm text-brand-primary/60">
              Schluss mit Fehlkäufen beim Friseur. Erfahre, warum hunderttausende Nutzer Frisuren.ai als ihre bevorzugte Frisuren App kostenlos nutzen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Advantage 1 */}
            <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Globe size={24} />
              </div>
              <h3 className="font-bold text-base text-brand-primary">0 € & Ohne Installation</h3>
              <p className="text-xs text-brand-primary/60 leading-relaxed">
                Keine sperrige App aus dem App Store oder Google Play Store nötig. Starte direkt im Smartphone-Browser auf iPhone, Android oder Desktop-PC.
              </p>
            </div>

            {/* Advantage 2 */}
            <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#FF9EBE]/15 text-[#FF9EBE] flex items-center justify-center font-bold">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-base text-brand-primary">Echte KI statt 2D-Perücke</h3>
              <p className="text-xs text-brand-primary/60 leading-relaxed">
                Unsere Gemini 3.5 KI passt die Haarstruktur, Fülle und Lichtreflexe fotorealistisch an deine individuelle Gesichtsform an.
              </p>
            </div>

            {/* Advantage 3 */}
            <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Lock size={24} />
              </div>
              <h3 className="font-bold text-base text-brand-primary">100% Privat & DSGVO-Sicher</h3>
              <p className="text-xs text-brand-primary/60 leading-relaxed">
                Deine Fotos gehören nur dir. Wir speichern deine Gesichtsbilder nicht dauerhaft ab. Nach der Sitzung werden die Bilder automatisch gelöscht.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (In 3 einfachen Schritten) */}
      <section className="max-w-5xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">
            Schritt für Schritt
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">
            So funktioniert die kostenlose Frisuren App
          </h2>
          <p className="text-sm text-brand-primary/60">
            In weniger als einer Minute hältst du deine perfekten Frisuren-Vorschläge in den Händen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-lg space-y-4 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#FF9EBE] text-white font-black text-sm flex items-center justify-center shadow-md shadow-[#FF9EBE]/20">
              01
            </span>
            <h3 className="font-bold text-lg text-brand-primary">1. Porträtfoto hochladen</h3>
            <p className="text-xs text-brand-primary/60 leading-relaxed">
              Mache ein schnelles Selfie oder lade ein bestehendes Foto hoch. Wichtig: Ein gut ausgeleuchtetes Bild von vorne bringt die besten KI-Ergebnisse.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-lg space-y-4 relative">
            <span className="w-10 h-10 rounded-2xl bg-brand-primary text-white font-black text-sm flex items-center justify-center shadow-md">
              02
            </span>
            <h3 className="font-bold text-lg text-brand-primary">2. KI-Analyse startet</h3>
            <p className="text-xs text-brand-primary/60 leading-relaxed">
              Unsere KI analysiert deine Gesichtsform (z. B. oval, eckig, rund, herzförmig) sowie deine Augenfarbe und Haarstruktur im Hintergrund.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-white rounded-[2.5rem] border border-black/5 shadow-lg space-y-4 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#FF9EBE] text-white font-black text-sm flex items-center justify-center shadow-md shadow-[#FF9EBE]/20">
              03
            </span>
            <h3 className="font-bold text-lg text-brand-primary">3. 9 Looks & Farben testen</h3>
            <p className="text-xs text-brand-primary/60 leading-relaxed">
              Erhalte sofort 9 maßgeschneiderte Frisuren-Ideen, probiere neue Farben aus und speichere dein Wunschergebnis für deinen nächsten Friseurbesuch.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="text-center pt-4">
          <button 
            onClick={() => fileInputRef.current?.click() || onStartAnalysis()}
            className="px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 text-xs sm:text-sm uppercase tracking-widest inline-flex items-center gap-3 cursor-pointer"
          >
            <Camera size={18} className="text-[#FF9EBE]" />
            <span>Jetzt eigenes Foto hochladen & Frisuren testen</span>
          </button>
        </div>
      </section>

      {/* INTERACTIVE CATEGORY & STYLE EXPLORER */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1 bg-[#FF9EBE]/15 text-[#FF9EBE] rounded-full text-[10px] font-black uppercase tracking-widest">
            Entdecke deine Vielfalt
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">
            Welche Frisuren möchtest du kostenlos ausprobieren?
          </h2>
          <p className="text-sm text-brand-primary/60">
            Wähle deine Kategorie und schau dir an, welche Styles unsere kostenlose Frisuren App simuliert.
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-black/5 rounded-2xl max-w-3xl mx-auto">
          <button 
            onClick={() => setSelectedCategory('damen')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'damen' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-primary/60 hover:text-brand-primary'
            }`}
          >
            Damen-Frisuren
          </button>
          <button 
            onClick={() => setSelectedCategory('herren')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'herren' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-primary/60 hover:text-brand-primary'
            }`}
          >
            Herren-Frisuren
          </button>
          <button 
            onClick={() => setSelectedCategory('kurz')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'kurz' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-primary/60 hover:text-brand-primary'
            }`}
          >
            Kurzhaarfrisuren
          </button>
          <button 
            onClick={() => setSelectedCategory('trend')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'trend' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-primary/60 hover:text-brand-primary'
            }`}
          >
            Trends 2026
          </button>
          <button 
            onClick={() => setSelectedCategory('farben')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'farben' ? 'bg-white text-brand-primary shadow-sm' : 'text-brand-primary/60 hover:text-brand-primary'
            }`}
          >
            Haarfarben-Simulator
          </button>
        </div>

        {/* Styles Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categoryStyles[selectedCategory].map((style, idx) => (
            <div key={idx} className="p-6 bg-white rounded-3xl border border-black/5 shadow-md hover:border-[#FF9EBE]/50 transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-[#FF9EBE]/15 text-[#FF9EBE] rounded-full text-[10px] font-black uppercase tracking-wider">
                    {style.tag}
                  </span>
                  <Scissors size={16} className="text-brand-primary/30" />
                </div>
                <h3 className="font-bold text-base text-brand-primary">{style.name}</h3>
                <p className="text-xs text-brand-primary/60 leading-relaxed">
                  {style.desc}
                </p>
              </div>

              <button 
                onClick={() => fileInputRef.current?.click() || onStartAnalysis()}
                className="w-full py-2.5 bg-black/5 hover:bg-[#FF9EBE] hover:text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Am eigenen Foto testen</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON TABLE: Frisuren.ai vs. Herkömmliche App Store Apps */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-black/5 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Der direkte Vergleich</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-primary">
              Warum Frisuren.ai die bessere Wahl ist
            </h2>
            <p className="text-xs sm:text-sm text-brand-primary/60">
              Vergleiche unsere kostenlose Frisuren Web-App mit typischen App Store Simulatoren.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-black/10 text-xs font-bold uppercase tracking-wider text-brand-primary/50">
                  <th className="py-4 px-4">Kriterium</th>
                  <th className="py-4 px-4 text-[#FF9EBE] bg-pink-50/50 rounded-t-2xl font-black">Frisuren.ai (Web-App)</th>
                  <th className="py-4 px-4 text-brand-primary/40">Typische App Store Apps</th>
                </tr>
              </thead>
              <tbody className="text-xs font-medium text-brand-primary/80 divide-y divide-black/5">
                <tr>
                  <td className="py-4 px-4 font-bold">Kosten & Transparenz</td>
                  <td className="py-4 px-4 bg-pink-50/30 text-emerald-600 font-bold flex items-center gap-1.5">
                    <Check size={16} /> 100% Gratis Erstanalyse (Kein Abo)
                  </td>
                  <td className="py-4 px-4 text-red-500/80 flex items-center gap-1.5">
                    <X size={16} /> Oft versteckte In-App Abos (9,99€/Woche)
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Installation & Speicher</td>
                  <td className="py-4 px-4 bg-pink-50/30 font-bold">
                    Sofort im Browser (0 MB Speicherplatz)
                  </td>
                  <td className="py-4 px-4 text-brand-primary/50">
                    200+ MB Download nötig
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Bildqualität & KI</td>
                  <td className="py-4 px-4 bg-pink-50/30 font-bold">
                    Fotorealistische Gemini 3.5 KI
                  </td>
                  <td className="py-4 px-4 text-brand-primary/50">
                    Veraltete 2D-Aufkleber & Perücken
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Datenschutz & DSGVO</td>
                  <td className="py-4 px-4 bg-pink-50/30 text-emerald-600 font-bold">
                    Automatische Fotolöschung
                  </td>
                  <td className="py-4 px-4 text-brand-primary/50">
                    Häufig Daten-Tracking & Werbung
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Friseur-Anleitung</td>
                  <td className="py-4 px-4 bg-pink-50/30 font-bold rounded-b-2xl">
                    Inkl. Profi-Barber-Anweisungen
                  </td>
                  <td className="py-4 px-4 text-brand-primary/50">
                    Keine technischen Angaben
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* USER REVIEWS & SOCIAL PROOF */}
      <section className="max-w-5xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="flex justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-primary">
            Das sagen unsere Nutzer über die kostenlose Frisuren App
          </h2>
          <p className="text-xs sm:text-sm text-brand-primary/60">
            Über 300.000 erfolgreich durchgeführte Frisuren-Analysen in Deutschland, Österreich & der Schweiz.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-md space-y-3">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-brand-primary/80 leading-relaxed italic">
              "Ich wollte schon ewig einen Bob ausprobieren, hatte aber mega Angst davor. Mit dieser kostenlosen Frisuren App konnte ich es direkt auf meinem Selfie sehen. Mein Friseur war begeistert von dem Foto!"
            </p>
            <div className="pt-2 border-t border-black/5 text-[11px] font-bold text-brand-primary flex items-center justify-between">
              <span>Laura M., München</span>
              <span className="text-[#FF9EBE]">Verifizierte Nutzung</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-md space-y-3">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-brand-primary/80 leading-relaxed italic">
              "Endlich eine Frisuren App, die wirklich kostenlos funktioniert und nicht nach 3 Klicks nach einer Kreditkarte fragt. Der Taper Fade Vorschlag passte perfekt zu meinem eckigen Gesicht!"
            </p>
            <div className="pt-2 border-t border-black/5 text-[11px] font-bold text-brand-primary flex items-center justify-between">
              <span>Markus S., Hamburg</span>
              <span className="text-[#FF9EBE]">Verifizierte Nutzung</span>
            </div>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-md space-y-3">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-brand-primary/80 leading-relaxed italic">
              "Unglaublich, wie echt der Balayage-Effekt auf meinem Foto aussieht. Hat mir geholfen, mich endlich für eine neue Haarfarbe zu entscheiden. Klare Empfehlung!"
            </p>
            <div className="pt-2 border-t border-black/5 text-[11px] font-bold text-brand-primary flex items-center justify-between">
              <span>Sophie K., Wien</span>
              <span className="text-[#FF9EBE]">Verifizierte Nutzung</span>
            </div>
          </div>
        </div>
      </section>

      {/* RICH SEO TEXT CONTENT BLOCK FOR GOOGLE RANKING */}
      <section className="max-w-4xl mx-auto px-4 prose prose-sm text-brand-primary/80">
        <div className="bg-black/[0.02] rounded-[2.5rem] p-8 sm:p-12 border border-black/5 space-y-6 text-xs sm:text-sm leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-primary">
            Kostenlose Frisuren App mit KI – Dein digitaler Stilexperte
          </h2>
          <p>
            Auf der Suche nach der perfekten Frisur stellt sich oft die Frage: Steht mir ein Kurzhaarschnitt? Passt ein Bob zu meinem gesicht oder soll ich lieber bei langen Haaren bleiben? Mit unserer <strong>kostenlosen Frisuren App</strong> musst du nicht mehr spekulieren. Dank künstlicher Intelligenz kannst du dir das Ergebnis am eigenen Foto anschauen, noch bevor die erste Strähne geschnitten wird.
          </p>

          <h3 className="text-base sm:text-lg font-bold text-brand-primary">
            Gesichtsform-Analyse: Welcher Schnitt passt zu dir?
          </h3>
          <p>
            Der Schlüssel zu einer großartigen Frisur liegt in der Harmonie mit deiner individuellen Gesichtsform. Unsere KI-Analyse kategorisiert dein Porträtfoto präzise:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Ovales Gesicht:</strong> Gilt als ideal ausbalanciert – fast jede Frisur von Pixie bis Stufenschnitt steht dir ausgezeichnet.</li>
            <li><strong>Rundes Gesicht:</strong> Frisuren mit Fülle am Oberkopf oder ein langes Lob strecken das Gesicht optisch sanft.</li>
            <li><strong>Eckiges Gesicht:</strong> Weiche Wellen, Stufen oder Curtain Bangs mildern ausgeprägte Kieferpartien ab.</li>
            <li><strong>Herzförmiges Gesicht:</strong> Kinnlange Bobs oder schräge Ponys balancieren eine breitere Stirn aus.</li>
          </ul>

          <h3 className="text-base sm:text-lg font-bold text-brand-primary">
            Frisuren kostenlos ausprobieren ohne App Store Zwang
          </h3>
          <p>
            Viele Simulatoren im App Store verlangen teure Wochen-Abonnements oder verstopfen deinen Smartphone-Speicher. Frisuren.ai verfolgt einen anderen Ansatz: Als progressive Web-App ist unser Service direkt im Internetbrowser kostenlos zugänglich. Egal ob auf dem iPhone, Samsung Galaxy oder Laptop – lade einfach dein Bild hoch und starte dein virtuelles Umstyling.
          </p>
        </div>
      </section>

      {/* FAQ SECTION WITH ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 bg-[#FF9EBE]/15 text-[#FF9EBE] rounded-full text-[10px] font-black uppercase tracking-widest">
            Häufige Fragen (FAQ)
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-brand-primary">
            Alles zur kostenlosen Frisuren App
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-black/5 overflow-hidden transition-all shadow-sm"
              >
                <button 
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left font-bold text-sm text-brand-primary flex items-center justify-between gap-4 cursor-pointer hover:bg-black/[0.01]"
                >
                  <span>{faq.q}</span>
                  <div className={`w-6 h-6 rounded-full bg-black/5 flex items-center justify-center shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-[#FF9EBE] text-white' : ''}`}>
                    <ChevronRight size={14} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs text-brand-primary/70 leading-relaxed border-t border-black/5 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL BOTTOM CTA SECTION */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-brand-primary via-[#2A2A2A] to-brand-primary text-white rounded-[3rem] p-10 sm:p-16 space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF9EBE]/20 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
          
          <div className="max-w-xl mx-auto space-y-4">
            <span className="px-3.5 py-1.5 bg-[#FF9EBE] text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              In 5 Sekunden bereit
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold italic">
              Bereit für deinen neuen Lieblings-Look?
            </h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Lade jetzt dein Foto hoch und nutze die beste kostenlose Frisuren App mit KI – völlig unverbindlich & ohne Registrierung.
            </p>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click() || onStartAnalysis()}
            className="px-10 py-5 bg-[#FF9EBE] hover:bg-white hover:text-brand-primary text-white font-black rounded-2xl transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 text-xs sm:text-sm uppercase tracking-widest inline-flex items-center gap-3 cursor-pointer"
          >
            <Upload size={18} />
            <span>Jetzt Foto kostenlos analysieren</span>
          </button>
        </div>
      </section>

      {/* STICKY MOBILE BOTTOM BAR FOR INSTANT ACCESS */}
      <div className="fixed bottom-4 left-4 right-4 sm:hidden z-40">
        <button 
          onClick={() => fileInputRef.current?.click() || onStartAnalysis()}
          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 border border-white/20 active:scale-95 transition-transform"
        >
          <Sparkles size={16} className="text-[#FF9EBE]" />
          <span>Kostenlose Frisuren-Analyse starten</span>
        </button>
      </div>

    </div>
  );
}
