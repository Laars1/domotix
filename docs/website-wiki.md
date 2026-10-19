# Website domotix.ch – Aufbau, Hosting und Deployment

> Stand: 9. Oktober 2026 · Repository: [github.com/Laars1/domotix](https://github.com/Laars1/domotix) · Live: [www.domotix.ch](https://www.domotix.ch)

## Auf einen Blick

| Thema | Kurz |
|---|---|
| Technik | Angular 18 als Single-Page-App, wird als statische Dateien ausgeliefert (keine Datenbank, kein Server-Code) |
| Code | GitHub, Repository `Laars1/domotix`, Live-Stand ist der Branch `master` |
| Build und Deploy | Push auf `master` → GitHub Actions baut → Ergebnis landet im Branch `gh-pages` → manueller Git-Pull in Plesk bringt ihn auf den Server |
| Hosting | Metanet, Server `olaf.metanet.ch` mit Plesk (Webseite, DNS und Mail) |
| Sprachen | Deutsch, Französisch, Englisch (Italienisch vorbereitet, nicht aktiv) |

```
 Entwickler            GitHub                                        Metanet (Plesk)
 ─────────             ──────                                        ───────────────
 git push master  ──►  Actions: lint + build  ──►  Branch gh-pages  ──►  Git-Pull (manuell)  ──►  Webroot auf olaf.metanet.ch
                       (.github/workflows/main.yml)
```

---

## 1. Technik

| Baustein | Version / Detail |
|---|---|
| Framework | Angular 18.2, Standalone-Komponenten, Seiten werden lazy geladen |
| Gestaltung | Bootstrap 5.3, Bootstrap Icons, eigene SCSS pro Komponente |
| Mehrsprachigkeit | ngx-translate, Texte in JSON-Dateien |
| Artikel, Referenzen, Datenschutz | ngx-markdown, Inhalte als Markdown-Dateien |
| Schrift | Avenir Next, lokal eingebunden (`src/avenirnextltpro-regular-webfont.*`) |
| Node.js | 22 (wie in der CI) |

Farben und Grundtypografie stehen zentral in `src/styles.scss`:

| Name | Wert | Verwendung |
|---|---|---|
| `$color-light` | `#F2F2F2` | Seitenhintergrund, helle Abschnitte |
| `$color-dark` | `#0D0D0D` | dunkle Abschnitte (Über uns, Footer) |
| `$color-tan` | `#A69885` | Akzentfarbe, Abschnittstitel, Links |
| `$color-bluegrey` | `#8599A6` | Nebentexte |

---

## 2. Seiten und URLs

| URL | Seite | Inhalt |
|---|---|---|
| `/` | Startseite | Hero, Vision mit Lichtszenen-Haus, Über uns, Hinweis auf Referenzen |
| `/gebaeude/<sprache>` | Gebäude | Hero, Einleitung, 6 Leistungen mit vollem Text abwechselnd links und rechts einer senkrechten Linie (Icon gross auf der Gegenseite), dunkler Abschluss aus Partner-Logos, Referenzen-Hinweis und Fusszeile |
| `/experience/<sprache>` | Experience | Kartenstapel: Der Hero schrumpft beim Scrollen zur hintersten Karte, dann schieben sich die 3 Werte-Karten darüber, als letzte die goldbraune Kontaktkarte mit Button |
| `/referenzen/<sprache>` | Referenzen | Bilder-Mosaik aller Projekte |
| `/referenzen/<sprache>/<slug>` | Referenz-Detail | Projekt mit Text, Bildern und Aufgaben |
| `/artikel/<sprache>` | Wissen | Artikel-Übersicht |
| `/artikel/<sprache>/<slug>` | Artikel-Detail | Fachartikel |
| alles andere | 404 | „Seite nicht gefunden“ |

- `<sprache>` ist `de`, `fr` oder `en`. Ohne Sprache (z. B. `/gebaeude`) wird auf `/de` umgeleitet.
- Auf der Startseite steht die Sprache nicht in der URL. Sie folgt der Browsersprache bzw. dem Sprachumschalter.
- Die Routen stehen in `src/app/app.config.ts`, die aktiven Sprachen in `src/environments/environment*.ts` (`providedLanguages`).

---

## 3. Projektstruktur

```
src/
├── index.html               Grundgerüst, Meta-Tags, Fallback-Text ohne JavaScript
├── styles.scss              Farben, Schrift, globale Klassen (section-label, hairline, Buttons)
├── .htaccess                SPA-Regel für den Webserver (siehe Kapitel 7)
├── 404.html                 Altlast von GitHub Pages (siehe Kapitel 7)
├── sitemap.xml, robots.txt  SEO, von Hand gepflegt
├── llms.txt, llms-full.txt  Zusammenfassung der Website für KI-Suchdienste, von Hand gepflegt
├── app/
│   ├── app.config.ts        Routen und Grundeinstellungen
│   ├── pages/               eine Komponente pro Seite (home, gebaeude, experience, referenzen, artikel, not-found)
│   ├── common/components/   wiederverwendbare Bausteine (navigation, page-hero, services, partner, vision, footer …)
│   ├── common/services/     Daten laden, Sprache, SEO
│   ├── common/models/       Datentypen (Artikel, Referenz, Partner)
│   └── shared/constants/    Kontakt-E-Mail
└── assets/
    ├── i18n/                Oberflächentexte pro Sprache (de/en/fr/it.json)
    ├── artikel/<sprache>/   Artikel: index.json + ein Markdown pro Artikel
    ├── referenzen/<sprache>/ Referenz-Texte als Markdown
    ├── data/                references/<sprache>.json, partners.json
    ├── rechtliches/<sprache>/ Datenschutzerklärung als Markdown
    └── images/              alle Bilder (siehe Kapitel 5)
```

---

## 4. Inhalte pflegen – wo ändere ich was?

| Was | Datei(en) |
|---|---|
| Texte der Oberfläche, Navigation, Seitentitel, Meta-Beschreibungen | `src/assets/i18n/<sprache>.json` |
| Leistungen Gebäude | Liste in `pages/gebaeude/gebaeude.component.ts`, Texte unter `light`, `heating` … in i18n (`title`, `tagline`, `text`). Einleitung unter `building.intro`. Darstellung: `layout="line"` der Komponente `services`. |
| Karten Experience (Werte) | Liste in `pages/experience/experience.component.ts`, Texte unter `experience.values` in i18n. Kontaktkarte: `contact` in derselben Datei, Texte unter `experience.contact`. Darstellung: `layout="cards"` der Komponente `services`. |
| Artikel | `assets/artikel/<sprache>/index.json` (Titel, Datum, Bild) und `<slug>.md` (Text) |
| Referenzen | `assets/data/references/<sprache>.json` (Titel, Ort, Bilder, Aufgaben) und `assets/referenzen/<sprache>/<slug>.md` (Text). `"draft": true` blendet ein Projekt aus. |
| Partner-Logos | `assets/data/partners.json`. Im Feld `pages` steht, auf welcher Seite das Logo erscheint; derzeit alle auf `gebaeude`. SVG in `images/Partners/`. |
| Hero-Bilder | im Template der jeweiligen Seite (`home-page.component.html`, `gebaeude.component.html`, `experience.component.html`) |
| Team-Porträts | `common/components/about/about.component.ts` |
| Datenschutz | `assets/rechtliches/<sprache>/datenschutz.md` |
| Impressum | i18n unter `footer.policies.imprint` |
| Kontakt-E-Mail | `shared/constants/configuration.constants.ts` |

**Wichtig bei Übersetzungen:** Neue Oberflächentexte immer in **allen** Sprachdateien eintragen. Als Ersatz dient die Browsersprache des Besuchers, nicht Deutsch. Ein fehlender englischer Text erscheint bei Besuchern mit englischem Browser als roher Platzhalter (z. B. `experience.values.label`).

**Artikel** werden zuerst auf Deutsch geschrieben. Die anderen Sprachen folgen später.

**Slugs** (der letzte Teil der URL) sind in allen Sprachen gleich. Nur so funktionieren Sprachumschalter und hreflang.

---

## 5. Bilder

| Ordner | Inhalt |
|---|---|
| `images/Landing/Hero/` | Startseiten-Hero, `hero-1.webp` … `hero-4.webp` und je eine `-mobile`-Variante |
| `images/Landing/Vision/` | vier Lichtszenen des Hauses (Tag, Nacht, TV, Golf) |
| `images/Landing/portraits/` | Team-Fotos |
| `images/Building/Hero/` | Hero der Gebäude-Seite |
| `images/Experience/Hero/` | Hero der Experience-Seite |
| `images/Artikel/` | Titelbilder der Artikel |
| `images/References/<projekt>/` | `hero.webp` und `1.webp`, `2.webp` … pro Projekt |
| `images/Partners/` | Partner-Logos (SVG) |
| `images/Logo/` | Domotix-Logo |

**Formate**

- Fotos als **WebP**.
- Hero-Bilder brauchen zwei Versionen: Querformat **2560 × 1440** (`hero-1.webp`) und Hochformat **1170 × 2550** für Handys (`hero-1-mobile.webp`). Hochformat-Bildschirme bekommen automatisch die Handy-Version.
- Hero-Bilder ohne Rand exportieren. Leere oder weisse Streifen sind im Hero voll sichtbar.

**Kodieren**

- Immer aus dem Original kodieren, nie eine schon komprimierte Datei nochmals komprimieren.
- Originale nie überschreiben.
- Bewährt hat sich:

  ```bash
  cwebp -q 88 -m 6 -sharp_yuv -af original.png -o bild.webp
  ```

- Originale (PNG, Kamera-Dateien) gehören nicht nach `src/assets`. Alles in diesem Ordner wird mitveröffentlicht, auch wenn die Seite es nie lädt.

**Gross- und Kleinschreibung**

- Der Webserver unterscheidet zwischen `Artikel` und `artikel`, macOS nicht.
- Pfade im Code müssen deshalb exakt der Schreibweise im Ordner entsprechen. Auf dem Mac fällt ein Fehler sonst nicht auf, erst live.
- Benennt man nur die Gross-/Kleinschreibung eines Ordners um, bemerkt Git das auf dem Mac nicht. Man muss es Git ausdrücklich melden:

  ```bash
  git rm -r --cached src/assets/images/alterName
  git add src/assets/images/NeuerName
  ```

---

## 6. Lokal entwickeln

Voraussetzungen: Node.js 22 und npm.

```bash
npm ci            # Abhängigkeiten installieren (genau nach package-lock.json)
npm start         # Entwicklungsserver auf http://localhost:4200, lädt bei Änderungen neu
npm run lint      # Code-Prüfung (ESLint)
npm run build     # Lint + Produktions-Build nach dist/domotix/browser/
```

- `npm run build` bricht ab, wenn Lint Fehler findet. Das gilt auch in der CI und blockiert dann das Deployment.
- Branches: `master` ist live. Pushes auf `feature/*`, `fix/*` und `chore/*` werden in der CI gebaut und geprüft, aber nicht veröffentlicht.

---

## 7. Hosting bei Metanet

| Punkt | Stand |
|---|---|
| Domain | `domotix.ch`, Nameserver bei Metanet (`ns1.olaf.metanet.ch`, `ns2.olaf.metanet.ch`) |
| Server | `domotix.ch` und `www.domotix.ch` zeigen auf `94.126.21.150` = `olaf.metanet.ch`, verwaltet mit Plesk |
| Webserver | antwortet als nginx und wertet `.htaccess` aus |
| HTTPS | Zertifikat von Let's Encrypt, gültig bis 20.11.2026 |
| Weiterleitungen | `domotix.ch` → `www.domotix.ch` und `http` → `https`. Eingerichtet im Hosting, nicht im Repository. |
| Kanonische Adresse | `https://www.domotix.ch` (im Code: `SITE_URL` in `common/services/seo.service.ts`) |
| E-Mail | `mail.domotix.ch`, ebenfalls auf `olaf.metanet.ch` |

### Die SPA-Regel (`.htaccess`)

Die Website ist eine Single-Page-App: Es gibt nur eine `index.html`, und Angular baut die Seite im Browser je nach URL zusammen. Ruft jemand direkt `www.domotix.ch/referenzen/de` auf, existiert auf dem Server keine solche Datei. Die `.htaccess` regelt das so:

```apache
RewriteCond %{REQUEST_FILENAME} -f [OR]   # existiert die Datei (Bild, JS, CSS …)?
RewriteCond %{REQUEST_FILENAME} -d        # oder der Ordner?
RewriteRule ^ - [L]                       # → direkt ausliefern
RewriteRule ^ index.html [L]              # sonst → index.html, Angular übernimmt
```

- Die Datei wird über `angular.json` (`assets`) in den Build kopiert und muss im Webroot liegen.
- Ohne sie liefern Direktaufrufe und Neuladen auf Unterseiten einen Fehler 404.

### Cache und Sicherheits-Header (ebenfalls `.htaccess`)

| Dateien | Cache-Control | Warum |
|---|---|---|
| Build-Dateien mit Prüfsumme im Namen (`main-ZPW3FEGH.js`, `media/…-FY65SBJB.woff2`) | 1 Jahr, `immutable` | neue Version = neuer Dateiname |
| Bilder und Schriften in `assets` | 1 Tag, danach im Hintergrund aktualisiert | behalten beim Ersetzen ihren Namen |
| alles andere (`index.html`, Texte, Daten, Sitemap) | `no-cache` | Browser fragt immer nach, meist kurze 304-Antwort |

Dazu `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` und Schutz gegen Einbetten in fremde Seiten (`X-Frame-Options`, `frame-ancestors`). HSTS und Brotli-Komprimierung setzt bereits das Hosting.

**Nach einem Deploy prüfen:** `curl -I https://www.domotix.ch/assets/images/Landing/og-image.jpg` muss `cache-control` zeigen. Fehlt er, liefert nginx die Dateien direkt aus und ignoriert die `.htaccess`; dann dieselben Regeln in Plesk unter „Apache & nginx-Einstellungen → Zusätzliche nginx-Anweisungen“ eintragen.

### Altlast GitHub Pages

- Früher lief die Seite auf GitHub Pages. Davon stammen `src/404.html` und ein kleines Skript in `index.html`, das den Pfad nach einer Umleitung wiederherstellt.
- Bei Metanet übernimmt das die `.htaccess`. Beides schadet nicht und kann entfernt werden, sobald GitHub Pages sicher nicht mehr gebraucht wird.

---

## 8. Deployment

### Ablauf

1. Änderungen auf `master` pushen bzw. einen Pull Request mergen.
2. GitHub Actions startet den Workflow **„Github Pages CI/CD“** (`.github/workflows/main.yml`):
   1. `npm ci` und `npm run build` (Lint und Build)
   2. **Release:** Folgen die Commit-Messages dem Conventional-Commits-Format (`feat: …`, `fix: …`), erhöht die Action die Version, setzt einen Tag (z. B. `v0.18.2`) und legt ein GitHub-Release an. Andere Commit-Messages lösen kein Release aus, deployt wird trotzdem.
   3. `npm run deploy`
3. `npm run deploy` (Paket `angular-cli-ghpages`) baut die Seite und schreibt den Inhalt von `dist/domotix/browser/` als neuen Commit („Auto-generated commit“) in den Branch **`gh-pages`**.
4. In Plesk den **Git-Pull manuell auslösen**: Plesk holt den Branch `gh-pages` von GitHub in den Webroot. Erst danach ist der neue Stand live. Vorher in GitHub unter „Actions“ prüfen, dass der Workflow grün durchgelaufen ist, sonst wird der alte Stand gepullt.

### Prüfen, ob der neue Stand live ist

- Im Quelltext von www.domotix.ch steht eine Datei `main-XXXXXXXX.js`. Sie muss gleich heissen wie die `main-…js` im neuesten Commit von `gh-pages`.
- Eine Unterseite direkt aufrufen und neu laden (z. B. `/referenzen/de`). Erscheint sie, funktioniert die SPA-Regel.
- `curl -I https://www.domotix.ch` zeigt mit `last-modified`, wann die Dateien zuletzt geändert wurden.

### Zurück auf einen alten Stand (Rollback)

- Die fehlerhafte Änderung auf `master` rückgängig machen (`git revert`) und pushen. Die CI baut den korrigierten Stand nach `gh-pages`, danach in Plesk pullen.
- Plesk holt immer den neuesten Stand von `gh-pages`. Ein älterer Deploy lässt sich deshalb nicht einfach in Plesk auswählen; der Weg führt über `master`.

### Wenn GitHub nicht erreichbar ist

- **Die Webseite läuft normal weiter.** Plesk hat die Dateien beim letzten Pull auf den Metanet-Server kopiert und liefert sie von dort aus. Die Seite lädt im Betrieb nichts von GitHub nach.
- **Veröffentlichen geht nicht:** GitHub Actions baut nicht, und der Pull in Plesk schlägt fehl. Online bleibt der zuletzt gepullte Stand.
- **Muss trotzdem dringend etwas live:** lokal `npm run build` und den Inhalt von `dist/domotix/browser/` per Plesk-Dateimanager oder FTP in den Webroot hochladen. Die Änderung danach trotzdem auf `master` bringen, sonst überschreibt der nächste Pull sie wieder.
- **Einzige fremde Abhängigkeit im Betrieb** ist das Statistik-Skript von `analytics.domotix.swiss` (in `index.html`, verzögert geladen). Fällt es aus, fehlen nur Statistiken.

### Manuell deployen (Notfall)

- `npm run deploy` funktioniert auch lokal und schreibt direkt nach `gh-pages` (Schreibrechte auf das Repository nötig). Danach in Plesk pullen.
- **Achtung:** Gebaut wird aus der lokalen Arbeitskopie, also mit allen nicht committeten Änderungen. Vorher `git status` prüfen.

---

## 9. SEO

| Was | Wo |
|---|---|
| Titel, Beschreibung, Open-Graph-/Twitter-Tags pro Seite | in der jeweiligen Seiten-Komponente (`updateMeta()`), Texte aus i18n |
| Canonical und hreflang | `SeoService` (`common/services/seo.service.ts`) |
| Strukturierte Daten (JSON-LD) | Startseite: Firma (`ProfessionalService`), Referenzen: Projektliste (`ItemList`) und je Projekt `CreativeWork`, Artikel: `Article` mit Brotkrumen (`BreadcrumbList`) |
| Sitemap | `src/sitemap.xml`, **von Hand pflegen**: neue Seiten, Artikel und Referenzen selbst eintragen |
| KI-Suchdienste | `src/llms.txt` (Übersicht) und `src/llms-full.txt` (Artikel im Volltext), ebenfalls von Hand |
| Robots | `src/robots.txt` (alles erlaubt, Verweis auf die Sitemap) |

**Link-Vorschauen** (LinkedIn, WhatsApp, Teams …) lesen nur das statische `src/index.html`, nicht die Tags, die die App pro Seite setzt. Dort stehen deshalb Standardwerte mit dem Vorschaubild `images/Landing/og-image.jpg` (1200 × 630, JPG, weil nicht alle Plattformen WebP anzeigen). Seitenspezifische Vorschauen bräuchten Prerendering.

**Sprachen:** Angeboten werden DE, FR und EN (`providedLanguages`). Italienisch ist teilweise übersetzt, aber nicht freigeschaltet. Französisch verwendet vor `: ? ! ;` und innerhalb von « » ein geschütztes Leerzeichen.

---

## 10. Offene Punkte

- [ ] **Git-Pull in Plesk ergänzen:** Der Pull wird manuell ausgelöst. Noch festhalten: Wer hat Zugang zu Plesk, und in welchen Ordner wird deployt?
- [ ] **Kontaktformular:** Wird intern abgeklärt. Vorschlag: Angular-Formular, das an ein PHP-Skript auf dem Metanet-Hosting sendet; das Skript verschickt per SMTP über `mail.domotix.ch`. Vorher klären: Ist PHP im Hosting aktiv, welches Mail-Konto versendet, eigene Seite `/kontakt` oder auf jeder Seite, welche Felder.
- [ ] **Metanet-Konto:** Wer hat Zugang zum Kundencenter, und wo sind die Zugangsdaten abgelegt?
- [ ] **Zertifikat:** Prüfen, ob Metanet das Let's-Encrypt-Zertifikat automatisch verlängert (läuft bis 20.11.2026).
- [ ] **GitHub Pages:** In den Repository-Einstellungen prüfen, ob GitHub Pages noch aktiv ist. Falls ja, abschalten, sonst ist die Seite doppelt im Netz.
