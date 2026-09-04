# Bolero Club

Prywatny ranking 78 smaków Bolero dla Filipa i Emilii. Oceny są przechowywane w SQLite przez libSQL i Drizzle ORM, dzięki czemu bazę można później przenieść do Turso bez zmiany warstwy danych.

```bash
npm install
npm run db:migrate
npm run dev
```

Domyślna baza to lokalny plik `local.db`. Konfigurację Turso opisuje plik `.env.example`.

Oceny są dostępne na stronie głównej, a automatyczny ranking pod adresem `/tier-lista`.
