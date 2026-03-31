import React from 'react';
import { X, Shield, FileText, Scale, RefreshCcw, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content, icon }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-black/5 flex items-center justify-between bg-brand-primary text-white">
          <div className="flex items-center gap-3">
            <div className="text-brand-accent">{icon}</div>
            <h2 className="text-xl font-serif font-bold">{title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-12 overflow-y-auto text-brand-primary/80 leading-relaxed space-y-6 text-sm md:text-base">
          {content}
        </div>
      </motion.div>
    </div>
  );
};

export const ImpressumContent = () => (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Angaben gemäß § 5 TMG</h3>
      <p>HairVision AI Solutions<br />Frankfurter Ring 193A<br />80807 München</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Inhaber:</h3>
      <p>Orry Kress</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Kontakt</h3>
      <p>Telefon: 089/12134053<br />E-Mail: team@hairvision-ai.de</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Umsatzsteuer-ID</h3>
      <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />DE260321718</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">EU-Streitschlichtung</h3>
      <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-accent underline">https://ec.europa.eu/consumers/odr/</a>. Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      <p>Verantwortliche/r i.S.d. § 18 Abs. 2 MStV:</p>
      <p>Orry Kress, Frankfurter Ring 193A, 80807 München</p>
    </section>
  </div>
);

export const DatenschutzContent = () => (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">1. Datenschutz auf einen Blick</h3>
      <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">2. Besondere Hinweise zur KI-Verarbeitung (Foto-Uploads)</h3>
      <p>Wenn Sie ein Foto (Selfie) hochladen, verarbeiten wir dieses wie folgt:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Datenarten:</strong> Biometrische Merkmale (Gesichtsform, Haarstruktur) aus Ihrem hochgeladenen Foto.</li>
        <li><strong>Zweck:</strong> Analyse der Gesichtsform und Generierung von Frisur-Vorschlägen mittels Künstlicher Intelligenz (Gemini AI Modelle).</li>
        <li><strong>KI-Modell:</strong> Wir nutzen Google Gemini Modelle zur Analyse und Bildgenerierung. Die Daten werden verschlüsselt an die API übertragen.</li>
        <li><strong>Speicherung:</strong> Fotos werden temporär für die Dauer der Analyse verarbeitet. Wenn Sie ein Konto erstellen, werden die generierten Ergebnisse (Bilder) in unserer Datenbank (Google Firebase) gespeichert, damit Sie darauf zugreifen können.</li>
        <li><strong>Löschung:</strong> Sie können Ihre gespeicherten Looks und Ihr Konto jederzeit löschen. Original-Uploads werden nach der Sitzung vom Server gelöscht, sofern sie nicht explizit gespeichert wurden.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">3. Hosting und Firebase</h3>
      <p>Unsere Website wird bei Google Cloud (Cloud Run) gehostet. Wir nutzen Firebase für die Authentifizierung und Datenbank-Speicherung. Die Serverstandorte befinden sich primär in der EU (Belgien/Frankfurt).</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">4. Ihre Rechte</h3>
      <p>Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit folgende Rechte:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Auskunftsrecht:</strong> Sie können Informationen über Ihre von uns verarbeiteten Daten verlangen.</li>
        <li><strong>Recht auf Berichtigung:</strong> Sie können die Korrektur unrichtiger Daten verlangen.</li>
        <li><strong>Recht auf Löschung:</strong> Sie können die Löschung Ihrer Daten verlangen (über die Profil-Einstellungen möglich).</li>
        <li><strong>Recht auf Datenübertragbarkeit:</strong> Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.</li>
        <li><strong>Beschwerderecht:</strong> Sie haben das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde zu beschweren.</li>
      </ul>
    </section>
  </div>
);

export const AGBContent = () => (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">1. Geltungsbereich</h3>
      <p>Diese Allgemeinen Geschäftsbedingungen gelten für alle über HairVision AI abgeschlossenen Verträge zwischen uns und unseren Kunden.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">2. Leistungen und Preise</h3>
      <p>Wir bieten KI-basierte Frisurenberatung an. Die Preise gestalten sich wie folgt:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Quick Unlock (Einmalig):</strong> 1,99 € inkl. MwSt. für die Freischaltung einer Analyse.</li>
        <li><strong>Styling-Flatrate (Abo):</strong> 2,49 € / Monat (jährliche Abrechnung) für unbegrenzten Zugriff.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">3. Vertragsschluss</h3>
      <p>Der Vertrag kommt durch den Abschluss des Bezahlvorgangs (Stripe) zustande. Sie erhalten eine Bestätigung per E-Mail, die gleichzeitig als Rechnung dient.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">4. Rechnungsstellung</h3>
      <p>Rechnungen werden elektronisch im PDF-Format erstellt und an die bei der Registrierung hinterlegte E-Mail-Adresse versandt.</p>
    </section>
  </div>
);

export const WiderrufContent = () => (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Widerrufsbelehrung</h3>
      <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
      <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Besonderer Hinweis zum vorzeitigen Erlöschen</h3>
      <p className="bg-brand-accent/5 p-4 rounded-xl border border-brand-accent/20">Das Widerrufsrecht erlischt bei einem Vertrag über die Lieferung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten auch dann, wenn wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie ausdrücklich zugestimmt haben, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, und Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Muster-Widerrufsformular</h3>
      <div className="p-6 bg-black/5 rounded-xl font-mono text-xs whitespace-pre-wrap">
{`An:
HairVision AI Solutions
Musterstraße 123
10115 Berlin
E-Mail: support@hairvision-ai.de

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)

Bestellt am (*)/erhalten am (*)
Name des/der Verbraucher(s)
Anschrift des/der Verbraucher(s)
Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)
Datum
(*) Unzutreffendes streichen.`}
      </div>
    </section>
  </div>
);

export const AboutContent: React.FC<{ onCtaClick?: () => void }> = ({ onCtaClick }) => (
  <div className="space-y-12 pb-8">
    {/* Hero Section */}
    <section className="text-center space-y-4">
      <h3 className="text-2xl md:text-3xl font-serif font-bold text-brand-primary leading-tight">
        Wir machen Frisuren-Testen einfacher, realistischer und sicherer.
      </h3>
      <p className="text-base md:text-lg text-brand-primary/70 max-w-3xl mx-auto">
        HairVision ist eine <span className="font-bold text-brand-primary">KI-Frisuren-App aus München</span>, mit der du <span className="font-bold text-brand-primary">virtuell Frisuren testen</span> und verschiedene Looks in wenigen Sekunden ausprobieren kannst. Unser Ziel ist es, dir vor dem Friseurbesuch mehr Sicherheit zu geben und dir zu zeigen, welche <span className="font-bold text-brand-primary">Frisur und Haarfarbe</span> wirklich zu dir passen.
      </p>
    </section>

    {/* Story Section */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h4 className="text-xl font-serif font-bold text-brand-primary">Unsere Geschichte</h4>
        <p>Hallo, ich bin Orry Kress, Gründer von HairVision.</p>
        <p>
          Die Idee zu HairVision entstand aus einer ganz einfachen Frage: „Steht mir diese Frisur wirklich?“
          Wie viele andere stand ich selbst schon oft vor dem Spiegel oder nach einem Friseurbesuch da und hatte das Gefühl, dass das Ergebnis nicht ganz zu mir passt.
        </p>
        <p>
          Genau hier setzt HairVision an. Gemeinsam mit einem kleinen Team aus KI-Entwicklern, Designern und Beauty-Experten haben wir eine App entwickelt, mit der du deine <span className="font-bold text-brand-primary">Gesichtsform analysieren</span> und passende Frisuren virtuell testen kannst. Was in München als persönliche Lösung begann, ist heute eine App für alle, die sich vor dem nächsten Haarschnitt besser orientieren möchten.
        </p>
      </div>
      <div className="bg-brand-accent/5 p-8 rounded-[2rem] border border-brand-accent/10 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-brand-accent/20 rounded-full flex items-center justify-center text-brand-accent">
          <Users size={40} />
        </div>
        <p className="font-serif italic text-brand-primary/60">"Technologie trifft auf Stil-Gefühl."</p>
      </div>
    </section>

    {/* Made in Germany & Privacy */}
    <section className="bg-brand-primary text-white p-8 md:p-12 rounded-[2rem] space-y-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 space-y-4">
          <h4 className="text-xl font-serif font-bold text-brand-accent">Made in Germany</h4>
          <p className="text-white/80">
            HairVision ist ein Münchner Startup und wird in Deutschland entwickelt. 
            Für uns bedeutet das nicht nur ein klares Qualitätsversprechen, sondern auch Verantwortung: 
            präzise Ergebnisse, verständliches Design und ein konsequenter Fokus auf Datenschutz.
          </p>
        </div>
        <div className="flex-1 space-y-4">
          <h4 className="text-xl font-serif font-bold text-brand-accent flex items-center gap-2">
            <Shield size={24} />
            DSGVO-konforme KI
          </h4>
          <p className="text-white/80">
            Deine Fotos werden ausschließlich für die Analyse und die Erstellung deiner personalisierten Frisuren verwendet und danach automatisch gelöscht. Wir speichern deine Bilder nicht dauerhaft und geben sie nicht an Dritte weiter.
          </p>
        </div>
      </div>
    </section>

    {/* Values Section */}
    <section className="space-y-6">
      <h4 className="text-xl font-serif font-bold text-brand-primary text-center">Unsere Werte</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "Realistische Ergebnisse", desc: "Wir zeigen Frisuren, die wirklich zu deinem Gesicht passen können." },
          { title: "Privatsphäre zuerst", desc: "Deine Daten gehören dir." },
          { title: "Einfachheit", desc: "Foto hochladen, analysieren lassen, Frisuren testen." },
          { title: "Transparenz", desc: "Wir erklären klar, wie unsere KI funktioniert und was sie macht." }
        ].map((val, i) => (
          <div key={i} className="p-5 bg-black/5 rounded-2xl border border-black/5">
            <h5 className="font-bold text-brand-primary mb-1">{val.title}</h5>
            <p className="text-sm text-brand-primary/60">{val.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Team & Vision */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="space-y-4">
        <h4 className="text-xl font-serif font-bold text-brand-primary">Unser Team</h4>
        <p className="text-sm leading-relaxed">
          Wir sind ein kleines Team aus München, das sich auf KI, Design und digitale Produkte spezialisiert hat. Unterstützt werden wir von Friseuren und Stylisten, die uns mit echtem Praxiswissen helfen, HairVision immer weiter zu verbessern. So verbinden wir Technologie mit dem Blick für das, was im Alltag wirklich funktioniert.
        </p>
      </div>
      <div className="space-y-4">
        <h4 className="text-xl font-serif font-bold text-brand-primary">Unsere Vision</h4>
        <p className="text-sm leading-relaxed">
          Wir wollen, dass niemand mehr unsicher aus dem Friseursalon geht. HairVision soll der erste Schritt zu einem besseren Look sein: unkompliziert, schnell und realistisch. In Zukunft möchten wir Menschen nicht nur dabei helfen, <span className="font-bold">Frisuren online zu testen</span>, sondern auch Haarfarben, Outfits und weitere Stilfragen einfacher zu entscheiden.
        </p>
      </div>
    </section>

    {/* Final CTA */}
    <section className="p-10 bg-brand-accent rounded-[2rem] text-center space-y-6 shadow-xl shadow-brand-accent/20">
      <h4 className="text-2xl font-serif font-bold text-brand-primary">Bereit für deinen perfekten Look?</h4>
      <p className="text-brand-primary/70">Dann lade jetzt dein Foto hoch und entdecke, welche Frisuren und Haarfarben wirklich zu dir passen.</p>
      <button 
        onClick={onCtaClick}
        className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
      >
        Jetzt meinen Style entdecken
      </button>
    </section>
  </div>
);
