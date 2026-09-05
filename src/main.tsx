import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './auth-menu.css';
import './auth-provider-buttons.css';
import './mobile-premium.css';
import './mobile-hero.css';
import './footer-map.css';
import './action-motion.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
