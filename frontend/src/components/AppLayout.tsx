import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnnouncementBar, Navigation, Footer } from './layout';

export function Layout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Update document title based on route
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Alprint — Print shop, reimagined',
      '/cart': 'Cart — Alprint',
      '/customize': 'Create Your Own — Alprint',
      '/account': 'Account — Alprint',
    };
    document.title = titles[pathname] || 'Alprint';
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <AnnouncementBar />
      <Navigation />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
