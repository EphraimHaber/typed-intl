import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { IntlProvider } from 'react-intl'
import { messages, type Locales } from './locales/index.ts'
import { flattenObject } from './locales/flattenOvject.ts'

const Root = () => {
  const [locale, setLocale] = useState<Locales>("en");

  return (
    <StrictMode>
      <IntlProvider messages={flattenObject(messages[locale])} locale={locale} defaultLocale={locale}>
        <App onLocaleChange={() => setLocale(prev => prev === "en" ? "fr" : "en")} />
      </IntlProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(
  <Root />,
)
