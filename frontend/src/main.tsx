import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'App';

// dayjs
import frenchLocale from 'dayjs/locale/fr';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
dayjs.locale(frenchLocale);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
