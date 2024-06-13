// Import modules
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Import assets
import './assets/styles/index.css';

// Import components
import App from './components/App';

// Create and render root
const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
