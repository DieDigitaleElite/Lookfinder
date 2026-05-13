# Deployment Guide: Frisuren.ai

Um die Seite sicher live auf **GitHub** und **Vercel** zu betreiben, befolge bitte diese Checkliste sorgfältig.

## 1. Umgebungsvariablen (Secrets)
Die folgenden Keys **DÜRFEN NICHT** im Code stehen. Sie müssen im Vercel Dashboard unter **Settings > Environment Variables** hinzugefügt werden:

| Variable | Beschreibung |
| :--- | :--- |
| `GEMINI_API_KEY` | Dein Google AI Studio API Key (für die KI-Funktionen). |
| `STRIPE_SECRET_KEY` | Dein Stripe Secret Key (sk_test_... oder sk_live_...). |
| `APP_URL` | Die URL deiner Live-Seite (z.B. `https://frisuren.ai`). |

## 2. Firebase Sicherheit
Die Firebase Client-Konfiguration in `src/firebase.ts` ist öffentlich (wie üblich bei Firebase). Um Missbrauch zu verhindern:
1. Gehe in die **Google Cloud Console**.
2. Suche unter **APIs & Services > Credentials** nach deinem Firebase API Key.
3. Füge **Website-Einschränkungen** hinzu: Erlaube nur deine Domain (z.B. `frisuren.ai`) und die Vercel-Preview-Domains (`*.vercel.app`).
4. Schränke den Key auf die benötigten APIs ein (Firestore, Auth, Storage).

## 3. Firestore Rules
Wir haben bereits robuste Sicherheitsregeln in `firestore.rules` erstellt. Diese verhindern, dass Nutzer fremde Daten lesen oder manipulieren können.
- **Wichtig:** Nach jeder Änderung an der Datenbank-Struktur müssen diese Regeln via `npm run deploy-rules` (oder manuell in der Firebase Console) aktualisiert werden.

## 4. Datenschutz & Rechtliches
Da die App Fotos verarbeitet:
- Stelle sicher, dass deine **Datenschutzerklärung** (Privacy Policy) DSGVO-konform ist.
- Fotos werden momentan nur im Arbeitsspeicher der KI oder temporär in Firebase (falls konfiguriert) verarbeitet.
- Der von mir implementierte **Proxy im Backend** (`/api/gemini`) sorgt dafür, dass dein `GEMINI_API_KEY` niemals im Browser des Nutzers erscheint.

## 5. Kostenkontrolle (Quota)
- **Stripe:** Nutze das Stripe Dashboard, um Limits für Zahlungen zu setzen.
- **Gemini:** Überwache dein Kontingent in der Google AI Studio Console. Der Proxy hilft, unautorisierte Anfragen zu filtern.
- **Firebase:** Behalte die "Free Tier" Limits im Auge (insb. Firestore Writes/Reads).

---
**Status der Prüfung:**
- [x] KI-Keys im Backend versteckt (Proxy implementiert).
- [x] Fehlercodes werden gesäubert (keine API-Key Leaks in Logs).
- [x] PII (personenbezogene Daten) in Fehlerlogs entfernt.
- [x] Firestore Rules auf dem neuesten Stand.
