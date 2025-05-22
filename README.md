## Entwicklernotiz von Sefa Gür

### Arbeitszeit

* Gestartet: **22.05.2025 um 13:00 Uhr**
* Beendet: **22.05.2025 um 21:00 Uhr**
* Pausen: Ja (mehrere kurze Pausen und Einarbeitung in Tailwind & Next.js)

###  Hinweis zur Datenbank (PostgreSQL)

Damit das Frontend vollständig funktioniert, müssen **Firmen in die Datenbank eingefügt werden**. Das User-Formular setzt voraus, dass Firmen vorhanden sind, um Benutzer korrekt zuordnen zu können.

**Beispiel für eine Firma (JSON):**

json
{
  "id": 1,
  "name": "MediTech GmbH"
}


Die Daten müssen entweder über ein SQL-Insert direkt in PostgreSQL erfolgen oder über einen eigenen Endpunkt zur Erstellung von Firmen, sofern dieser später ergänzt wird.



### Umsetzung und Funktionsweise

#### Backend (NestJS + MikroORM + PostgreSQL)

* Die `User`-Entität wurde erweitert um:

  * `email`, `address`, `company`, `relatedCoworkers`
* Die `Company`-Entität wurde eingebunden (OneToMany-Beziehung)
* `relatedCoworkers` ist eine ManyToMany-Beziehung (selbstbezogen)
* Ein `AuditLog` protokolliert alle `CREATE` und `UPDATE`-Aktionen auf User-Ebene

#### Frontend (Angular , Signals, TailwindCSS)

* **User-Liste**: Zeigt alle User über eine wiederverwendbare Tabelle
* **User-Detail**:

  * Anzeige und Bearbeitung der Nutzerdaten
  * Auswahl einer Firma über ein Dropdown (live aus der `/companies` API)
  * Dynamisches Filtern der Coworker, basierend auf gewählter Firma
  * Speichern der Daten führt zu einem Update inkl. Audit-Log

#### Technische Highlights:

* Vollständig standalone Angular-Komponenten
* Reactive Forms + Signals
* Dynamische Checkbox-Logik für Coworker
* API-basierte Datenanbindung ohne doppeltes Laden



### Verbesserungsideen & zukünftige Features!

#### Funktional:

* Eigene **CRUD-Oberfläche für Firmen** (aktuell nur über DB möglich)
* Eigene Ansicht für **Audit-Logs** (wer hat was wann geändert?)
* **Login mit Rollen** (Admin vs. Benutzer)

#### UI/UX:

* Such- und Filterfunktion in der User-Tabelle
* Visuelle Darstellung von Coworker-Gruppen

#### Code/Technik:

* DTO-Validierung im Backend ergänzen
* `class-validator` nutzen für HTTP-Anfragen
* Tests für UI-Interaktionen

---

### Persönliches Fazit

Die Aufgabe war fordernd, aber lehrreich. Besonders der Einsatz von Next.js  und TailwindCSS war für mich neu, sodass ich mich erst einarbeiten musste. Dadurch hat sich die Bearbeitungszeit gestreckt. Am Ende konnte ich jedoch ein voll funktionsfähiges Fullstack-Projekt mit sauberer Architektur und erweiterbarer Logik umsetzen. 
