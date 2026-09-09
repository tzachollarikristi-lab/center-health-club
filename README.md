# Σύλλογος Κέντρου Υγείας

Ένα πλήρες web project για τον Σύλλογο Κέντρου Υγείας με React/Vite frontend και Node/Express backend.

## Δομή

- `client/` - εφαρμογή React με Tailwind CSS, Framer Motion, React Router, Axios.
- `server/` - backend Express με SQLite, JWT authentication, Multer upload.
- `server/database/club.db` - βάση δεδομένων SQLite.
- `server/uploads/` - αποθηκευμένα αρχεία εικόνων και PDF.

## Εγκατάσταση

Από το root του έργου:

```bash
npm install
```

Αυτό εγκαθιστά τα dependencies για `client` και `server` μέσω workspaces.

## Εκτέλεση

Για ανάπτυξη με hot reload:

```bash
npm run dev
```

Μετάβαση:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Δημιουργία πρώτου administrator

Κατά την πρώτη εκτέλεση, το backend δημιουργεί αυτόματα έναν διαχειριστή με:

- Email: `admin@healthclub.gr`
- Password: `password123`

Αλλαγή του password γίνεται απευθείας από τη βάση ή από νέο admin δημιουργημένο χειροκίνητα.

## Backup βάσης δεδομένων

Η βάση βρίσκεται στο `server/database/club.db`.
Αντιγράψτε το αρχείο για backup:

```bash
cp server/database/club.db server/database/club.db.backup
```

## Supabase setup (real shared database)

Το project είναι έτοιμο να συνδεθεί με ένα πραγματικό Supabase project και να μοιράζεται τα δεδομένα μεταξύ πολλών συσκευών.

1. Δημιουργήστε ένα νέο project στο Supabase.
2. Πηγαίνετε στο SQL Editor και εκτελέστε το περιεχόμενο του αρχείου `supabase/migrations/001_initial.sql`.
3. Αν θέλετε να έχετε και demo δεδομένα, εκτελέστε επίσης το `supabase/seed.sql`.
4. Στο frontend δημιουργήστε το αρχείο `client/.env` από το `client/.env.example` και βάλτε το URL και το anon key του project σας:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Στο Supabase → Authentication → Users, δημιουργήστε τον πρώτο admin χρήστη με email/password.
   - Ο πρώτος χρήστης που θα δημιουργηθεί γίνεται αυτόματα admin χάρη στο trigger στο `001_initial.sql`.
6. Επανεκτελέστε το `npm run dev`.

Από εκεί, κάθε αλλαγή που γίνεται από το admin panel αποθηκεύεται στο κοινό Supabase database και εμφανίζεται σε οποιαδήποτε άλλη συσκευή ανοίγει τον ιστότοπο αφού ανανεώσει τη σελίδα.

## Deployment

Συνιστάται να αναπτύξετε τον server και τον client ως δυο υπηρεσίες.

1. Χρησιμοποιήστε `npm run build` στο `client`.
2. Φιλοξενήστε το backend στο Node.js hosting.
3. Ρυθμίστε το `CORS` και τη βάση δεδομένων SQLite / MySQL.

Για MySQL αντικαταστήστε την λογική σύνδεσης στο `server/src/utils/db.js` και τις SQL queries με MySQL drivers.

## Σημειώσεις

- Το admin panel βρίσκεται στη διαδρομή `/admin`.
- Το backend προστατεύεται με JWT.
- Οι εικόνες και τα PDF ανεβαίνουν στο `server/uploads/`.
- Ο front-end proxy του Vite προωθεί τα `/api` αιτήματα στο `http://localhost:4000`.

## Static preview & mock API

If you only want to preview the frontend without running the backend, the app will fall back to a local mock API. From the `client` folder:

```
npm run build
npm run preview:static

# then open http://127.0.0.1:3000
```

Mock admin credentials for static preview:

- Email: `admin@123.com`
- Password: `admin123`

supabase database password:UmLEtqDBzze6YhLd
