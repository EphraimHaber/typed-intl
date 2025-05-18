import { type Locales, messages } from ".";
import type { AppIntlShape } from './useAppIntl';
import { flattenObject } from './flattenOvject';
import { createIntlCache, type MessageFormatElement, createIntl } from "react-intl";


const cache = createIntlCache();

let intl: AppIntlShape;

export const setAppIntl = (locale: Locales, messages: Record<string, string> | Record<string, MessageFormatElement[]>) => {
    intl = createIntl(
        {
            locale,
            messages,
        },
        cache,
    );
};

export const getAppIntl = (): AppIntlShape => {
    if (!intl) {
        const defaultLocale = 'en';
        setAppIntl(defaultLocale, flattenObject(messages[defaultLocale]));
    }

    return intl;
};