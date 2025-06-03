import { useI18n } from 'vue-i18n';
import type { MessageSchema } from './schema';

const { t, d, n } = useI18n<{ message: MessageSchema }, 'en-US'>({
  inheritLocale: true,
});

export const foo = t;

import { createI18n } from 'vue-i18n';

export const typedI8n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en',
  messages: {
    'en-US': {
      hello: 'Hello {name}!',
    },
    'ja-JP': {
      hello: 'こんにちは {name}!',
    },
  },
});

// foo('my_messages.hello', { name: 'XDD' });
