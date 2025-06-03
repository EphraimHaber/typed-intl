import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import router from './router';
import { EN_US, JA_JP, type MessageSchema } from './locales2/schema';
import { typedI8n } from './locales/intl.instance';

// const i18n = createI18n<[MessageSchema], 'en-US' | 'ja-JP'>({
//   locale: 'en-US',
//   fallbackLocale: 'en',
//   messages: {
//     'en-US': EN_US,
//     'ja-JP': JA_JP,
//   },
// });
const i18n = typedI8n;

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(router);

app.mount('#app');
