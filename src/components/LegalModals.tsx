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
    <div className="fixed inset-0 z-[200] overflow-y-auto flex items-start justify-center p-4 md:p-12 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 cursor-default"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col my-auto"
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
      <p>Frisuren.ai AI Solutions<br />Frankfurter Ring 193A<br />80807 München</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Inhaber:</h3>
      <p>Orry Kress</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Kontakt</h3>
      <p>Telefon: 089/12134053<br />E-Mail: team@frisuren.ai</p>
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
      <h3 className="text-lg font-bold text-brand-primary mb-2">1. Verantwortlicher</h3>
      <p>Verantwortlich für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
      <p className="mt-2">
        Orry Kress<br />
        Frankfurter Ring 193A<br />
        80807 München<br />
        Deutschland<br />
        E-Mail: team@frisuren.ai
      </p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">2. Allgemeine Hinweise</h3>
      <p>Der Schutz deiner personenbezogenen Daten ist uns wichtig. Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Vorschriften, insbesondere der DSGVO und des Bundesdatenschutzgesetzes (BDSG).</p>
      <p>Diese Datenschutzerklärung informiert dich darüber, welche Daten wir erheben, zu welchem Zweck wir sie verwenden und welche Rechte du hast.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">3. Welche Daten wir verarbeiten</h3>
      <p>Je nach Nutzung unserer Website bzw. App verarbeiten wir insbesondere folgende Daten:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>hochgeladene Fotos oder Selfies,</li>
        <li>Angaben zur Nutzung der App,</li>
        <li>technische Nutzungsdaten wie IP-Adresse, Browsertyp, Gerätedaten und Zeitstempel,</li>
        <li>Zahlungsdaten im Rahmen von Käufen oder Abonnements,</li>
        <li>Kommunikationsdaten, wenn du uns kontaktierst.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">4. Zweck der Verarbeitung</h3>
      <p>Wir verarbeiten deine Daten zu folgenden Zwecken:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>Bereitstellung unserer KI-Frisuren-App,</li>
        <li>Analyse von Gesichtsform und Haarbild,</li>
        <li>Erstellung personalisierter Frisurenvorschläge,</li>
        <li>Abwicklung von Zahlungen und Abonnements,</li>
        <li>technische Bereitstellung, Sicherheit und Fehleranalyse,</li>
        <li>Bearbeitung von Support-Anfragen,</li>
        <li>Erfüllung gesetzlicher Pflichten.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">5. Verarbeitung deiner Fotos</h3>
      <p>Wenn du ein Foto hochlädst, verwenden wir dieses ausschließlich zur Analyse und zur Erstellung deiner personalisierten Frisurenvorschläge.</p>
      <p>Die Fotoverarbeitung erfolgt nur für den jeweiligen Analysevorgang. Soweit technisch vorgesehen, werden die Bilder nach Abschluss der Analyse automatisch gelöscht oder nicht dauerhaft gespeichert.</p>
      <p>Eine Weitergabe deiner Fotos an Dritte erfolgt nicht, sofern dies nicht für die technische Bereitstellung erforderlich ist.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">6. Rechtsgrundlagen</h3>
      <p>Wir verarbeiten personenbezogene Daten auf folgenden Rechtsgrundlagen:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>Art. 6 Abs. 1 lit. b DSGVO zur Erfüllung des Nutzungsvertrags,</li>
        <li>Art. 6 Abs. 1 lit. c DSGVO zur Erfüllung gesetzlicher Pflichten,</li>
        <li>Art. 6 Abs. 1 lit. f DSGVO auf Grundlage unseres berechtigten Interesses an sicherem und funktionsfähigem Betrieb,</li>
        <li>Art. 6 Abs. 1 lit. a DSGVO, soweit wir eine Einwilligung einholen, etwa für bestimmte Analyse- oder Trackingfunktionen.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">7. Zahlungsabwicklung über Stripe</h3>
      <p>Für die Zahlungsabwicklung nutzen wir Stripe. Dabei werden folgende Daten an Stripe übermittelt:</p>
      <ul className="list-disc pl-5 space-y-1 mt-2">
        <li>Name, E-Mail, Rechnungsadresse</li>
        <li>Zahlungsdaten (nur an Stripe)</li>
        <li>IP-Adresse, Geräteinformationen</li>
      </ul>
      <p className="mt-2"><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</p>
      <p className="mt-2">Stripe ist verpflichtet, Ihre Daten gemäß DSGVO zu verarbeiten. Weitere Informationen finden Sie in der Stripe-Datenschutzerklärung: <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-[#FF9EBE] underline">https://stripe.com/de/privacy</a></p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">8. Hosting und technische Bereitstellung</h3>
      <p>Unsere Website wird bei einem Hosting-Anbieter betrieben (Google Cloud/Firebase). Dabei werden technische Daten verarbeitet, die für den Betrieb, die Sicherheit und die Auslieferung der Website erforderlich sind.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">9. Cookies und Tracking</h3>
      <p>Sofern wir Cookies oder ähnliche Technologien einsetzen, geschieht dies zur technischen Bereitstellung, zur Reichweitenmessung oder zur Verbesserung unseres Angebots.</p>
      <p>Soweit dafür eine Einwilligung erforderlich ist, holen wir diese vorab über ein Consent-Banner ein.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">10. Empfänger der Daten</h3>
      <p>Deine Daten werden nur dann an Dritte weitergegeben, wenn dies erforderlich ist, etwa an:</p>
      <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>Hosting-Dienstleister,</li>
        <li>Zahlungsdienstleister,</li>
        <li>Analyse- und Sicherheitsdienste,</li>
        <li>technische Dienstleister zur Wartung der Website.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">11. Speicherdauer</h3>
      <p>Wir speichern personenbezogene Daten nur so lange, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.</p>
      <p>Fotos werden, soweit technisch vorgesehen, nach Abschluss der Analyse gelöscht.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">12. Deine Rechte</h3>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit, Widerspruch gegen bestimmte Verarbeitungen sowie Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">13. Beschwerderecht</h3>
      <p>Du hast außerdem das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.</p>
    </section>
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">14. Änderungen dieser Datenschutzerklärung</h3>
      <p>Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich unsere Website, unsere App oder die rechtlichen Anforderungen ändern.</p>
    </section>
  </div>
);

export const AGBContent = () => (
  <div className="space-y-6">
    <p className="text-sm text-brand-primary/60 italic">Stand: 31. März 2026</p>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">1. Geltungsbereich</h3>
      <p>Die folgenden Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Frisuren.ai-Website und der Frisuren.ai-App sowie den Erwerb von kostenpflichtigen Funktionen, Einmalfreischaltungen und Abonnements.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">2. Vertragsgegenstand</h3>
      <p>Frisuren.ai bietet eine digitale Anwendung zur Analyse von Gesichtsformen und zur Erstellung personalisierter Frisurenvorschläge auf Basis hochgeladener Fotos.</p>
      <p className="mt-2">Die angebotenen Ergebnisse dienen der Orientierung und Inspiration. Es wird keine Garantie übernommen, dass eine Frisur im realen Leben exakt dem digitalen Ergebnis entspricht.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">3. Vertragsschluss</h3>
      <p>Der Vertrag über kostenpflichtige Leistungen kommt zustande, wenn der Nutzer den Bezahlvorgang abschließt und die Zahlung erfolgreich verarbeitet wurde.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">4. Preise und Zahlungsabwicklung</h3>
      <p>Alle Preise werden im Bestellprozess klar angezeigt. Die Zahlung erfolgt über den jeweils angebotenen Zahlungsdienstleister (Stripe).</p>
      <p className="mt-2">Die Nutzer werden während des Bestellvorgangs auf die sichere Checkout-Seite von Stripe weitergeleitet. Sensible Zahlungsdaten werden ausschließlich von Stripe verarbeitet und nicht auf unseren Servern gespeichert.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">5. Einmalige Freischaltungen</h3>
      <p>Einmalige Freischaltungen berechtigen zur sofortigen Nutzung der jeweils beschriebenen zusätzlichen Funktionen oder Ergebnisse. Ein Anspruch auf Rückerstattung besteht nur, soweit gesetzlich vorgesehen oder ausdrücklich zugesagt.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">6. Abonnements</h3>
      <p>Abonnements verlängern sich automatisch um die jeweils angegebene Laufzeit, sofern sie nicht vor Ablauf der Kündigungsfrist gekündigt werden.</p>
      <p className="mt-2">Kündigungsmöglichkeiten, Laufzeiten und Preise werden vor Abschluss des Abonnements transparent angezeigt.</p>
    </section>

    <section className="bg-black/5 p-6 rounded-2xl border border-black/10">
      <h3 className="text-lg font-bold text-brand-primary mb-4">7. Widerrufsbelehrung</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-brand-primary mb-1">Widerrufsrecht</h4>
          <p className="text-sm">Verbraucher haben grundsätzlich das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
          <p className="text-sm mt-1">Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
          <p className="text-sm mt-1">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss informieren, diesen Vertrag zu widerrufen. Sie können dafür das unten aufgeführte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
          <p className="text-sm mt-1">Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
        </div>

        <div>
          <h4 className="font-bold text-brand-primary mb-1">Erlöschen des Widerrufsrechts bei digitalen Inhalten</h4>
          <p className="text-sm">Das Widerrufsrecht erlischt bei einem Vertrag über die Lieferung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten, wenn wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2 text-sm">
            <li>ausdrücklich zugestimmt haben, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung des Vertrags beginnen, und</li>
            <li>Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung Ihr Widerrufsrecht verlieren.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-brand-primary mb-1">Folgen des Widerrufs</h4>
          <p className="text-sm">Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.</p>
          <p className="text-sm mt-1">Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.</p>
        </div>

        <div>
          <h4 className="font-bold text-brand-primary mb-1">Muster-Widerrufsformular</h4>
          <div className="p-4 bg-white rounded-xl font-mono text-[10px] whitespace-pre-wrap border border-black/5 mt-2">
{`An:
Orry Kress
Frankfurter Ring 193A
80807 München
E-Mail: team@frisuren.ai

Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der folgenden digitalen Inhalte:

Bestellt am:

Name des Verbrauchers:

Anschrift des Verbrauchers:

Datum:

Unterschrift des Verbrauchers (nur bei Mitteilung auf Papier)`}
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">8. Nutzungsrechte</h3>
      <p>Die über Frisuren.ai erzeugten Inhalte dürfen ausschließlich privat genutzt werden, sofern nichts anderes vereinbart wurde.</p>
      <p className="mt-2">Eine Weitergabe, der Weiterverkauf oder die kommerzielle Nutzung der Ergebnisse ist nur mit ausdrücklicher Zustimmung gestattet.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">9. Pflichten der Nutzer</h3>
      <p>Nutzer verpflichten sich, nur eigene oder rechtmäßig verwendete Fotos hochzuladen und die App nicht missbräuchlich zu verwenden.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">10. Verfügbarkeit</h3>
      <p>Wir bemühen uns um eine hohe Verfügbarkeit der Dienste, können jedoch keine unterbrechungsfreie Nutzung garantieren.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">11. Haftung</h3>
      <p>Wir haften nur im Rahmen der gesetzlichen Bestimmungen. Eine Haftung für Schäden, die durch eine abweichende reale Umsetzung einer empfohlenen Frisur entstehen, ist ausgeschlossen, soweit gesetzlich zulässig.</p>
    </section>

    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">12. Schlussbestimmungen</h3>
      <p>Es gilt deutsches Recht. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Regelungen unberührt.</p>
    </section>
  </div>
);


export const WiderrufContent = () => (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-bold text-brand-primary mb-2">Widerrufsbelehrung für Frisuren.ai</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-brand-primary mb-2">Widerrufsrecht</h4>
          <p>Verbraucher haben grundsätzlich das Recht, binnen vierzehn Tagen ohne Angabe von Gründen einen Vertrag zu widerrufen.</p>
          <p className="mt-2">Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
          <p className="mt-2">Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung über Ihren Entschluss informieren, diesen Vertrag zu widerrufen. Sie können dafür das unten aufgeführte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
          <p className="mt-2">Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.</p>
        </div>

        <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10">
          <h4 className="font-bold text-brand-primary mb-2">Erlöschen des Widerrufsrechts bei digitalen Inhalten</h4>
          <p>Das Widerrufsrecht erlischt bei einem Vertrag über die Lieferung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten, wenn wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>ausdrücklich zugestimmt haben, dass wir vor Ablauf der Widerrufsfrist mit der Ausführung des Vertrags beginnen, und</li>
            <li>Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung Ihr Widerrufsrecht verlieren.</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-brand-primary mb-2">Folgen des Widerrufs</h4>
          <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.</p>
          <p className="mt-2">Für die Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.</p>
        </div>

        <div>
          <h4 className="font-bold text-brand-primary mb-2">Muster-Widerrufsformular</h4>
          <p className="mb-4 text-sm text-brand-primary/60">(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
          <div className="p-6 bg-black/5 rounded-2xl font-mono text-xs whitespace-pre-wrap border border-black/10">
{`An:
Orry Kress
Frankfurter Ring 193A
80807 München
E-Mail: team@frisuren.ai

Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der folgenden digitalen Inhalte:

Bestellt am:

Name des Verbrauchers:

Anschrift des Verbrauchers:

Datum:

Unterschrift des Verbrauchers (nur bei Mitteilung auf Papier)`}
          </div>
        </div>
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
        Frisuren.ai ist eine <span className="font-bold text-brand-primary">KI-Frisuren-App aus München</span>, mit der du <span className="font-bold text-brand-primary">virtuell Frisuren testen</span> und verschiedene Looks in wenigen Sekunden ausprobieren kannst. Unser Ziel ist es, dir vor dem Friseurbesuch mehr Sicherheit zu geben und dir zu zeigen, welche <span className="font-bold text-brand-primary">Frisur und Haarfarbe</span> wirklich zu dir passen.
      </p>
    </section>

    {/* Story Section */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div className="space-y-4">
        <h4 className="text-xl font-serif font-bold text-brand-primary">Unsere Geschichte</h4>
        <p>Hallo, ich bin Orry Kress, Gründer von Frisuren.ai.</p>
        <p>
          Die Idee zu Frisuren.ai entstand aus einer ganz einfachen Frage: „Steht mir diese Frisur wirklich?“
          Wie viele andere stand ich selbst schon oft vor dem Spiegel oder nach einem Friseurbesuch da und hatte das Gefühl, dass das Ergebnis nicht ganz zu mir passt.
        </p>
        <p>
          Genau hier setzt Frisuren.ai an. Gemeinsam mit einem kleinen Team aus KI-Entwicklern, Designern und Beauty-Experten haben wir eine App entwickelt, mit der du deine <span className="font-bold text-brand-primary">Gesichtsform analysieren</span> und passende Frisuren virtuell testen kannst. Was in München als persönliche Lösung begann, ist heute eine App für alle, die sich vor dem nächsten Haarschnitt besser orientieren möchten.
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
          <h4 className="text-xl font-serif font-bold text-brand-accent flex items-center gap-2">
            Entwickelt in Deutschland
            <div className="flex flex-col w-3.5 h-2.5 overflow-hidden rounded-[1px] shadow-sm shrink-0">
              <div className="h-1/3 bg-black"></div>
              <div className="h-1/3 bg-[#FF0000]"></div>
              <div className="h-1/3 bg-[#FFCC00]"></div>
            </div>
            ❤️
          </h4>
          <p className="text-white/80">
            Frisuren.ai ist ein Münchner Startup und wird in Deutschland entwickelt. 
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
          Wir sind ein kleines Team aus München, das sich auf KI, Design und digitale Produkte spezialisiert hat. Unterstützt werden wir von Friseuren und Stylisten, die uns mit echtem Praxiswissen helfen, Frisuren.ai immer weiter zu verbessern. So verbinden wir Technologie mit dem Blick für das, was im Alltag wirklich funktioniert.
        </p>
      </div>
      <div className="space-y-4">
        <h4 className="text-xl font-serif font-bold text-brand-primary">Unsere Vision</h4>
        <p className="text-sm leading-relaxed">
          Wir wollen, dass niemand mehr unsicher aus dem Friseursalon geht. Frisuren.ai soll der erste Schritt zu einem besseren Look sein: unkompliziert, schnell und realistisch. In Zukunft möchten wir Menschen nicht nur dabei helfen, <span className="font-bold">Frisuren online zu testen</span>, sondern auch Haarfarben, Outfits und weitere Stilfragen einfacher zu entscheiden.
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
