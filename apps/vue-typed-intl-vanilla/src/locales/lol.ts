import { commonDescriptor } from './en/commonDescriptor';
import frCommonDescriptor from './fr/commonDescriptor';
import { formatMessage } from './intl.instance';

export const enMessages = {
  commonDescriptor,
} as const;

const frMessage = {
  commonDescriptor: frCommonDescriptor,
};

export const messages = {
  en: enMessages,
  fr: frMessage,
} as const;

export type IntlMessages = typeof messages;
export type Locales = keyof typeof messages;
export { formatMessage };
