#  Technische Dokumentation – Fullstack Coding Challenge

##  Projektstruktur (Kurzüberblick)

* `apps/backend`: NestJS Backend mit MikroORM + PostgreSQL
* `apps/ui`: Angular Frontend mit Signals, Tailwind und Reactive Forms
* `libs/shared`: geteilte Models und Services (sofern verwendet)

---

## Backend (NestJS)

### Technologien:

* NestJS
* MikroORM
* PostgreSQL

###  User-Entität:

* Felder: `name`, `email`, `address`, `company`, `relatedCoworkers`
* Beziehungen:

  * `@ManyToOne` zu `Company`
  * `@ManyToMany` selbstbezogen zu `User` (Coworker)

###  Company-Entität:

* Felder: `id`, `name`

###  AuditLog-Entität:

* Protokolliert jede `CREATE` und `UPDATE` Operation auf `User`
* Felder: `id`, `action`, `entity`, `data`, `timestamp`

###  Routen / Endpunkte

####  `/users` (GET)

* Holt alle User inkl. zugehöriger Firma & Coworker (via `populate`)
* Implementierung: `UserController.findAll()`
* Wird im Frontend auf der Liste und im Dropdown für Coworker verwendet

####  `/users/:id` (GET)

* Holt einen einzelnen User mit Firma und Coworkern
* Implementierung: `UserController.findOne()`

####  `/users` (POST)

* Erstellen eines neuen Users
* Unterstützt Übergabe von `{ company: { id }, relatedCoworkers: [{ id }] }`
* Intern werden Referenzen via `em.getReference(...)` aufgelöst

####  `/users/:id` (PUT)

* Aktualisiert bestehenden User
* Firma kann neu zugewiesen werden (Dropdown im Frontend)
* Coworker können durch Checkboxen verändert werden
* Intern: Formular-Update + Persistierung + Audit-Eintrag

####  `/companies` (GET)

* Liefert alle Firmen mit `id` und `name`
* Wird im Frontend für das Dropdown verwendet
* Implementierung: `CompanyController.findAll()`




  Technologien

* Angular Signals (reaktive Zustände)
* Reactive Forms
* TailwindCSS
* Standalone-Komponenten

   Komponenten

  `users-listing`

* Zeigt alle User in Tabelle
* Tabelle als wiederverwendbare Komponente `users-table`
* Auf Klick wird `router.navigate(['/users/:id'])` ausgeführt

   `users-detail`

* Holt User per `id` aus URL
* Form wird mit Signals + Reactive Form gesteuert
* Firma kann über Dropdown neu zugewiesen werden (live aus `/companies`)
* Coworker werden automatisch nach Firma gefiltert
* Checkboxen interagieren mit `FormArray`
* Änderungen werden über `userService.update()` gespeichert

###  Services

#### `user.service.ts`

* `getAll()`: Holt alle User inkl. Beziehungen
* `getOne(id)`: Holt User-Detail für Seite
* `getCompanies()`: Holt Firmenliste vom Backend
* `update(id, data)`: Speichert aktualisierten User mit Firma und Coworkern

---

## Beispiel-Daten (PostgreSQL)

Damit das Frontend korrekt funktioniert, müssen Firmen existieren.

```sql
INSERT INTO company (id, name) VALUES (1, 'MediTech GmbH');
```

Oder als JSON für API-Inserts:

```json
{
  "id": 1,
  "name": "MediTech GmbH"
}
```



