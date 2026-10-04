import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

// Global Unhandled Error & Rejection Shield (Anti-Crash Guard)
window.addEventListener('error', (event) => {
  // Prevent third-party scripts or image decode errors from crashing execution
  console.warn('[KrishiLink Anti-Crash Shield] Intercepted global window error:', event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.warn('[KrishiLink Anti-Crash Shield] Intercepted unhandled promise rejection:', event.reason);
  // Prevent unhandled promise errors from aborting browser UI thread
  event.preventDefault();
});

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
