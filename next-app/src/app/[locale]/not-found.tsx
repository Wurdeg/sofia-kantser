import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      padding: 40,
      textAlign: 'center'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-playfair)',
        fontStyle: 'italic',
        fontSize: 64,
        color: 'var(--pink)'
      }}>
        404
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 18 }}>
        Страница не найдена / Page not found / Pagina nu a fost găsită
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px',
          background: 'var(--pink)',
          color: 'white',
          borderRadius: 50,
          fontWeight: 700
        }}
      >
        На главную
      </Link>
    </main>
  );
}
