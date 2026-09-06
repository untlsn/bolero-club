# Bolero Club

Prywatny ranking 97 smaków (w tym 20 energetyków) Bolero dla Filipa i Emilii. Oceny są przechowywane w SQLite przez libSQL i Drizzle ORM, dzięki czemu bazę można później przenieść do Turso bez zmiany warstwy danych.

```bash
npm install
npm run db:migrate
npm run dev
```

Domyślna baza to lokalny plik `local.db`. Konfigurację Turso opisuje plik `.env.example`.

Oceny są dostępne na stronie głównej, a automatyczny ranking pod adresem `/tier-lista`.

Każdy smak ma wspólny komentarz (do 2000 znaków). Rozwiń „Dodaj komentarz” lub „Edytuj komentarz” i kliknij „Zapisz komentarz”. Zapisanie pustego pola usuwa komentarz. Komentarze są widoczne również w rankingu i pozostają po cofnięciu oceny. Przed uruchomieniem nowej wersji zastosuj migracje poleceniem `npm run db:migrate`.

## Vercel + Turso

1. Utwórz bazę Turso i token dostępu.
2. Uruchom migracje, przekazując `DATABASE_URL` i `DATABASE_AUTH_TOKEN` do `npm run db:migrate`.
3. Dodaj obie zmienne do środowisk `Production`, `Preview` i `Development` w Vercelu.
4. Połącz repozytorium z Vercel i wdroż aplikację. Projekt używa oficjalnego adaptera Vercel, Node.js 24 i regionu `fra1`.

Lokalny development nadal domyślnie korzysta z `file:local.db`.
