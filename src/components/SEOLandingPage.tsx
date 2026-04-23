import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, Scissors, Sparkles, CheckCircle2, ChevronRight, Star, Heart, ShieldCheck, Zap } from 'lucide-react';

export default function SEOLandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-brand-primary overflow-x-hidden">
      <Helmet>
        <title>Frisuren online testen ohne App – KI Hairstyler | Frisuren.ai</title>
        <meta name="description" content="Teste Frisuren online ohne App-Download. Unsere KI zeigt dir in Sekunden, welche Haarschnitte dir am besten stehen. Kostenlos, realistisch & sicher." />
        <meta name="keywords" content="frisuren online testen ohne app, virtueller friseur online, ki frisuren test, haarschnitte online ausprobieren" />
        <link rel="canonical" href="https://frisuren.ai/frisuren-online-testen" />
      </Helmet>
      {/* Navigation placeholder or Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <Sparkles size={18} />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-serif font-black tracking-tight">Frisuren</span>
              <span className="text-xl font-sans font-extralight italic text-[#FF9EBE]">.ai</span>
            </div>
          </Link>
          <Link to="/" className="px-5 py-2.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-brand-primary/20 hover:scale-105 transition-transform">
            App starten
          </Link>
        </div>
      </header>

      <main className="pt-32 pb-24">
        {/* Hero Section */}
        <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FF9EBE]/10 rounded-full border border-[#FF9EBE]/20">
              <Star size={14} className="text-[#FF9EBE]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">Virtueller Friseur 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-black italic leading-[0.95] tracking-tight">
              Frisuren online testen <br />
              <span className="text-[#FF9EBE]">ohne App Download</span>
            </h1>
            
            <p className="text-lg md:text-xl text-brand-primary/60 max-w-xl leading-relaxed">
              Vergiss komplizierte Apps oder teure Styling-Experimente. Mit unserer KI-Technologie kannst du <strong className="text-brand-primary">Frisuren online testen</strong> – direkt in deinem Browser, sicher und in Sekunden.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/" 
                className="px-10 py-5 bg-black text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all group"
              >
                <span>Jetzt kostenlos testen</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex flex-col justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-brand-primary/40 px-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-green-500" />
                  Keine Installation nötig
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={12} className="text-green-500" />
                  Privatsphäre garantiert
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-linear-to-tr from-[#FF9EBE]/20 to-transparent blur-3xl -z-10" />
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-2 border-white relative group">
              <img 
                src="https://images.unsplash.com/photo-1595475243692-3b38744be339?q=80&w=1000" 
                alt="Frisuren online testen ohne App" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 shadow-2xl"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#FF9EBE] rounded-lg flex items-center justify-center">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest">KI-Simulation Aktiv</span>
                </div>
                <p className="text-xs opacity-80 leading-relaxed font-medium">Unsere KI analysiert hunderte von Merkmalen, um dir das realistischste Ergebnis zu liefern.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="bg-black/5 py-24 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-serif font-black italic">Warum du keine App mehr brauchst</h2>
              <div className="w-24 h-1.5 bg-[#FF9EBE] mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-balance">
              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Zap className="text-[#FF9EBE]" size={20} />
                  Sofortige Ergebnisse
                </h3>
                <p className="text-brand-primary/60 leading-relaxed text-sm md:text-base bg-white p-6 rounded-2xl shadow-sm">
                  Lade einfach ein Foto hoch und lass unsere KI den Rest erledigen. Du musst nicht erst im App-Store suchen, dich durch Installationen quälen oder wertvollen Speicherplatz opfern. Bei Frisuren.ai kannst du deine neuen <strong className="text-brand-primary underline decoration-[#FF9EBE] decoration-2 underline-offset-4">Frisuren online testen ohne App</strong> – schneller als du "Schere" sagen kannst.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                  <ShieldCheck className="text-[#FF9EBE]" size={20} />
                  Maximale Sicherheit
                </h3>
                <p className="text-brand-primary/60 leading-relaxed text-sm md:text-base bg-white p-6 rounded-2xl shadow-sm">
                  Apps fragen oft nach Berechtigungen, die sie gar nicht benötigen. Bei uns bleibst du anonym. Wir speichern dein Gesicht nur so lange, wie du es willst. Deine Daten verlassen unsere sicheren Server in Deutschland nicht.
                </p>
              </div>
            </div>

            <div className="p-12 bg-white rounded-[3rem] shadow-xl space-y-8 relative border border-black/5">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-brand-primary rotate-12">
                <Scissors size={120} />
              </div>
              <h3 className="text-2xl font-serif font-bold italic">So einfach funktioniert der Online-Check:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <li className="space-y-2">
                  <div className="text-2xl font-black text-[#FF9EBE] opacity-20">01</div>
                  <h4 className="font-black uppercase text-xs tracking-widest">Foto wählen</h4>
                  <p className="text-xs text-brand-primary/40 leading-relaxed">Ein klares Porträtfoto sorgt für die besten Ergebnisse.</p>
                </li>
                <li className="space-y-2">
                  <div className="text-2xl font-black text-[#FF9EBE] opacity-20">02</div>
                  <h4 className="font-black uppercase text-xs tracking-widest">KI arbeiten lassen</h4>
                  <p className="text-xs text-brand-primary/40 leading-relaxed">Unsere KI analysiert deine Gesichtsform und passenden Styles.</p>
                </li>
                <li className="space-y-2">
                  <div className="text-2xl font-black text-[#FF9EBE] opacity-20">03</div>
                  <h4 className="font-black uppercase text-xs tracking-widest">Styles entdecken</h4>
                  <p className="text-xs text-brand-primary/40 leading-relaxed">Probiere hunderte Kombinationen ohne Risiko aus.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Camera size={24} />, title: "Live-Vorschau", desc: "Realistische Simulation in HD-Qualität." },
              { icon: <Scissors size={24} />, title: "Trend-Styles", desc: "Ständig aktualisierte Frisuren-Bibliothek." },
              { icon: <Heart size={24} />, title: "Kostenlos", desc: "Teste die ersten Looks völlig unverbindlich." },
              { icon: <Zap size={24} />, title: "Keine App", desc: "Funktioniert auf jedem Gerät im Browser." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2rem] border border-black/5 hover:border-[#FF9EBE]/20 transition-all group bg-white shadow-sm hover:shadow-xl">
                <div className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-brand-primary/40 group-hover:bg-[#FF9EBE]/10 group-hover:text-[#FF9EBE] transition-all mb-6">
                  {item.icon}
                </div>
                <h4 className="font-black uppercase text-xs tracking-widest mb-2">{item.title}</h4>
                <p className="text-xs text-brand-primary/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer Section */}
        <section className="px-6 mb-12">
          <div className="max-w-5xl mx-auto bg-brand-primary rounded-[3rem] p-12 md:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#FF9EBE22_0%,_transparent_70%)]" />
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl md:text-6xl font-serif font-black italic text-white leading-tight">
                Bereit für dein <br />
                <span className="text-[#FF9EBE]">neues Ich?</span>
              </h2>
              <p className="text-white/60 max-w-md mx-auto text-sm md:text-base leading-relaxed">
                Schließe dich tausenden zufriedenen Nutzern an und finde noch heute deinen perfekten Look – ohne App Download, direkt online.
              </p>
              <div className="pt-4">
                <Link 
                  to="/" 
                  className="inline-flex px-12 py-5 bg-white text-brand-primary border-4 border-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-transparent hover:text-white transition-all active:scale-95"
                >
                  Jetzt Analyse starten
                </Link>
              </div>
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 pt-4">
                <ShieldCheck size={14} />
                Made in Germany • Maximale Datensicherheit
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-black/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand-primary/20 rounded-md flex items-center justify-center text-brand-primary">
              <Sparkles size={12} />
            </div>
            <span className="text-xs font-serif font-black tracking-tight opacity-40">Frisuren.ai © 2026</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-brand-primary/20">
            <Link to="/" className="hover:text-brand-primary transition-colors">Startseite</Link>
            <Link to="/frisuren-online-testen" className="text-brand-primary/60 border-b-2 border-[#FF9EBE]/20">Frisuren Online Testen</Link>
            <button className="hover:text-brand-primary transition-colors">Impressum</button>
            <button className="hover:text-brand-primary transition-colors">Datenschutz</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
