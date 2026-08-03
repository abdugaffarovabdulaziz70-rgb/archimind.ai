import { type ReactNode } from 'react';
import { Header, Footer } from '../layout';

export function PageLayout({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return (
    <div className="min-h-screen bg-white dark:bg-ink-950 text-ink-900 dark:text-ink-100">
      <Header />
      <main className="pt-16 lg:pt-20">{children}</main>
      {footer && <Footer />}
    </div>
  );
}
