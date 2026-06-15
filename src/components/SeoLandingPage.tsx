import React from 'react';
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
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';

interface SeoLandingPageProps {
  onStartAnalysis: () => void;
}

export default function SeoLandingPage({ onStartAnalysis }: SeoLandingPageProps) {
  // FAQs list for rich content
  const faqs = [
    {
      q: "Wie funktioniert das Ausprobieren von Frisuren am Bildschirm?",
      a: "Unsere fortschrittliche künstliche Intelligenz (KI) analysiert dein hochgeladenes Foto in Sekundenschnelle. Sie erkennt deine Gesichtsform (z.B. oval, eckig, rund) und passt die Haarschnitte fotorealistisch an deine Kopfstruktur an. So erhältst du ein authentisches Bild davon, wie ein neuer Schnitt an dir aussieht."
    },
    {
      q: "Ist die Frisuren-Erstanalyse wirklich kostenlos?",
      a: "Ja, absolut! Du kannst dein Foto vollkommen kostenfrei hochladen und eine erste professionelle KI-Analyse deiner Gesichtsform inkl. 9 perfekt abgestimmter Frisurenvorschläge erhalten. Es ist kein Abonnement und keine Registrierung erforderlich."
    },
    {
      q: "Bleiben meine hochgeladenen Fotos privat?",
      a: "Ja, der Schutz deiner Privatsphäre ist unser höchstes Gebot. Frisuren.ai ist zu 100% DSGVO-konform. Alle Fotos werden verschlüsselt übertragen, ausschließlich zur Analyse verarbeitet und nach deiner Sitzung automatisch gelöscht."
    },
    {
      q: "Welche Fotos eignen sich am besten für das Online-Styling?",
      a: "Wähle am besten ein gut ausgeleuchtetes Porträtfoto (Selfie), auf dem du direkt nach vorne in die Kamera blickst. Deine Haare sollten idealerweise aus dem Gesicht gestrichen sein (z.B. als Zopf), damit die KI deine Gesichtsform und Konturen präzise erfassen kann."
    },
    {
      q: "Kann ich im Styling Studio auch andere Haarfarben testen?",
      a: "Ja, in unserem integrierten Styling Studio kannst du nicht nur tolle moderne Schnitte am Bildschirm ausprobieren, sondern diese auch mit über 10 verschiedenen, glänzenden Haarfarben kombinieren und direkt miteinander vergleichen."
    }
  ];

  return (
    <div className="space-y-16 md:space-y-32 pb-24">
      
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto text-center space-y-8 py-8 md:py-12 px-4"
      >
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FF9EBE]/10 text-[#FF9EBE] rounded-full text-xs font-black uppercase tracking-widest">
            <Sparkles size={12} className="animate-pulse" />
            <span>Jetzt neu: Frisuren am Bildschirm ausprobieren</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold leading-tight tracking-tight text-brand-primary">
            Frisuren am Bildschirm <span className="italic text-[#FF9EBE] block sm:inline">ausprobieren</span> mit KI.
          </h1>
          
          <p className="text-base md:text-xl text-brand-primary/60 max-w-2xl mx-auto leading-relaxed">
            Willst du wissen, welche Frisur wirklich zu dir und deiner Gesichtsform passt – ganz ohne Friseur-Risiko? Probiere hunderte Haarschnitte fotorealistisch direkt auf deinem eigenen Foto aus.
          </p>
        </div>

        {/* Big CTA Button */}
        <div className="flex flex-col items-center gap-4 pt-4">
          <button 
            onClick={onStartAnalysis}
            className="group px-10 py-5 bg-brand-primary hover:bg-black text-white font-black rounded-2xl transition-all duration-300 shadow-xl hover:shadow-brand-primary/10 uppercase tracking-widest text-xs sm:text-sm flex items-center gap-3 cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Kostenlose Frisuren-Analyse starten</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-brand-primary/40">
            <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-[#FF9EBE]" /> 100% DSGVO-konform</span>
            <span className="opacity-25">•</span>
            <span>Kein Account nötig</span>
            <span className="opacity-25">•</span>
            <span>In Sekunden fertig</span>
          </div>
        </div>
      </motion.section>

      {/* Visual Preview Card simulating action */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-2xl shadow-black/[0.03] space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF9EBE]/5 blur-[80px] -mr-20 -mt-20" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">Smarte Technologie</span>
              <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight">Dein Foto wird zur perfekten Frisuren-Vorschau.</h2>
              <p className="text-brand-primary/60 text-sm md:text-base leading-relaxed">
                Unsere Technologie schneidet die Haare nicht einfach nur grob aus. Die KI versteht deine Knochenstruktur, kalkuliert den Lichteinfall und blendet deine neue Wunschfrisur nahtlos und fotorealistisch ein.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Exakte Berücksichtigung deiner Gesichtsform</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-brand-primary/80">
                  <div className="w-6 h-6 rounded-full bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>Natürlicher Glanz & realistische Texturen</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-black/5 rounded-[2rem] border border-black/5 overflow-hidden flex items-center justify-center p-6 group shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/[0.02] to-transparent" />
              <div className="flex flex-col items-center text-center p-8 space-y-4 max-w-xs relative z-10 bg-white/80 backdrop-blur-md rounded-3xl border border-white shadow-xl">
                <div className="w-12 h-12 rounded-full bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center shrink-0">
                  <Upload size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Bereit für dein neues Ich?</p>
                  <p className="text-[11px] text-brand-primary/50">Lade ein Bild hoch und probiere es jetzt am Bildschirm aus.</p>
                </div>
                <button 
                  onClick={onStartAnalysis}
                  className="w-full py-2.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md cursor-pointer hover:bg-[#FF9EBE] transition-colors"
                >
                  Jetzt Foto hochladen
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Guide - Simple and Clear */}
      <section className="max-w-5xl mx-auto px-4 py-8 bg-[#FF9EBE]/5 rounded-[3rem] border border-[#FF9EBE]/10">
        <div className="max-w-4xl mx-auto py-12 px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9EBE]">In 3 Schritten bereit</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold">So einfach probierst du Frisuren online aus:</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white text-brand-primary flex items-center justify-center font-serif font-extrabold italic text-lg shadow-sm">
                1
              </div>
              <h3 className="font-bold text-lg">Foto hochladen</h3>
              <p className="text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                Wähle ein Selfie von deinem Smartphone oder Computer aus. Es wird sicher und DSGVO-konform übertragen.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white text-brand-primary flex items-center justify-center font-serif font-extrabold italic text-lg shadow-sm">
                2
              </div>
              <h3 className="font-bold text-lg">KI-Analyse abwarten</h3>
              <p className="text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                Unsere künstliche Intelligenz analysiert deine Gesichtsform und berechnet binnen Sekunden die optimalen Haarschnitte.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF9EBE] text-white flex items-center justify-center font-serif font-extrabold italic text-lg shadow-md">
                3
              </div>
              <h3 className="font-bold text-lg text-brand-primary">Am Bildschirm testen</h3>
              <p className="text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                Sieh dir 9 unterschiedliche Frisuren an deinem Foto an und wechsle im Styling Studio nach Belieben Längen, Schnitte und Farben.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Benefits (Why Online Try-On?) */}
      <section className="max-w-5xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif font-bold">Warum am Bildschirm ausprobieren besser ist</h2>
          <p className="text-brand-primary/60 text-sm md:text-base max-w-xl mx-auto">
            Keine Enttäuschungen mehr beim Friseurbesuch. Nutze die Kraft neuester KI-Technologie für deine Traumfrisur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.01] flex gap-5 group hover:border-[#FF9EBE]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center shrink-0">
              <Target size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Zentimetergenaue Anpassung</h3>
              <p className="text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                Die künstliche Intelligenz bewertet dein Gesicht holistisch und schlägt ausschließlich Frisuren vor, die deine individuelle Struktur harmonisch ausgleichen.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.01] flex gap-5 group hover:border-[#FF9EBE]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center shrink-0">
              <Zap size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Völlig kostenlos am Start</h3>
              <p className="text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                Die Erstanalyse ist für dich zu 100% kostenfrei. Probiere 3 verschiedene Stufen der klassischen Längen (kurz, mittellang, lang) bedenkenlos direkt aus.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.01] flex gap-5 group hover:border-[#FF9EBE]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center shrink-0">
              <Scissors size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Styling Studio inklusive</h3>
              <p className="text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                Im erweiterten Studio färbst du deine Haare digital, schneidest sie virtuell kürzer oder veränderst die Längen und feinsten Details in Premium Handumdrehen.
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-xl shadow-black/[0.01] flex gap-5 group hover:border-[#FF9EBE]/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#FF9EBE]/10 text-[#FF9EBE] flex items-center justify-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Keine Installation notwendig</h3>
              <p className="text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                Probiere deine Frisuren unkompliziert direkt im Webbrowser aus. Keine App-Downloads, kein mühsames Suchen im App Store – sofort einsatzbereit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Optimized FAQ Accordion */}
      <section className="max-w-3xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1 text-brand-primary/30 text-xs font-bold uppercase tracking-[0.25em]">
            <HelpCircle size={14} />
            <span>Fragestellungen & Antworten</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Wissenswertes zum virtuellen Frisuren-Test</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="p-6 md:p-8 bg-white rounded-3xl border border-black/5 shadow-sm space-y-3"
            >
              <h3 className="font-bold text-base md:text-lg text-brand-primary flex items-start gap-3">
                <span className="text-[#FF9EBE] font-serif font-black">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <div className="pl-6 text-xs md:text-sm text-brand-primary/60 leading-relaxed">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Conversion CTA Card Banner */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="p-12 md:p-16 bg-[#FF9EBE] rounded-[3rem] text-white text-center space-y-8 relative overflow-hidden shadow-2xl shadow-[#FF9EBE]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/20 blur-[100px] -ml-32 -mb-32" />
          
          <div className="relative space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif font-bold italic text-white leading-tight">Bereit für deinen neuen Wunsch-Haarschnitt? 💇‍♀️</h2>
            <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base md:text-lg">
              Lade jetzt dein Bild hoch und probiere deine Lieblingsfrisuren in Sekundenschnelle am Bildschirm aus – 100% risikofrei und kostenlos.
            </p>
          </div>
          
          <div className="relative pt-4">
            <button 
              onClick={onStartAnalysis}
              className="px-10 py-5 bg-white text-[#FF9EBE] font-black rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest text-xs sm:text-sm flex items-center justify-center mx-auto gap-3 cursor-pointer"
            >
              <span>Jetzt Frisuren am Bildschirm testen</span>
              <ArrowRight size={16} />
            </button>
            
            <p className="mt-6 text-[9.5px] text-white/60 font-medium uppercase tracking-[0.2em] flex flex-wrap items-center justify-center gap-2">
              <span>Keine Registrierung erforderlich</span>
              <span className="opacity-40">•</span>
              <span>100% kostenloser Start</span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1">
                Made in Germany
                <div className="flex flex-col w-3 h-2 overflow-hidden rounded-[0.5px] shadow-sm shrink-0 border border-white/20">
                  <div className="h-1/3 bg-black"></div>
                  <div className="h-1/3 bg-[#FF0000]"></div>
                  <div className="h-1/3 bg-[#FFCC00]"></div>
                </div>
              </span>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
