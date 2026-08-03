import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/common';

// Eager: Home (critical path)
import { HomePage } from './pages/HomePage';

// Lazy-loaded pages
const GeneratePage = lazy(() => import('./pages/GeneratePage').then((m) => ({ default: m.GeneratePage })));
const GalleryPage = lazy(() => import('./pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const SavedProjectsPage = lazy(() => import('./pages/SavedProjectsPage').then((m) => ({ default: m.SavedProjectsPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then((m) => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-ink-950">
      <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppRoutes() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/generate" element={<GeneratePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/saved" element={<SavedProjectsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
