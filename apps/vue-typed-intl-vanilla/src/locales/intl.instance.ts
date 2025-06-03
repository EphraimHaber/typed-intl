// import { type Locales, messages } from '.';
import type { AppIntlShape } from './useAppIntl';
import { flattenObject } from './flattenOvject';

import { createI18n } from 'vue-i18n';
import { messages } from './lol';

export const typedI8n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: flattenObject(messages.en),
    fr: flattenObject(messages.fr),
  },
});

export const formatMessage = typedI8n.global.t;

export type EnMessages = typeof messages.en;
// const cache = createIntlCache();

// let intl: AppIntlShape;

// export const setAppIntl = (locale: Locales, messages: Record<string, string> | Record<string, MessageFormatElement[]>) => {
//     intl = createIntl(
//         {
//             locale,
//             messages,
//         },
//         cache,
//     );
// };

// export const getAppIntl = (): AppIntlShape => {
//     if (!intl) {
//         const defaultLocale = 'en';
//         setAppIntl(defaultLocale, flattenObject(messages[defaultLocale]));
//     }

//     return intl;
// };
