import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {MobileHero} from './components/MobileHero.tsx';
import './index.css';
import './auth-menu.css';
import './mobile-premium.css';
import './mobile-hero.css';
import './footer-map.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MobileHero />
    <App />
  </StrictMode>,
);
