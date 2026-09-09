import { Link } from 'react-router-dom';

function Page404() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-sm uppercase tracking-[0.2em] text-brand-600">404</p>
      <h1 className="mt-4 text-5xl font-semibold text-slate-900">Η σελίδα δεν βρέθηκε</h1>
      <p className="mt-4 max-w-xl text-slate-600">Επιστρέψτε στην αρχική σελίδα ή χρησιμοποιήστε το μενού για να βρείτε αυτό που ψάχνετε.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white">Αρχική</Link>
    </div>
  );
}

export default Page404;
