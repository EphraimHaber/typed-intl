import type { AppIntlMessageKeys } from "./FormattedAppMessage";


export const getExactTypedKeyList = <T extends AppIntlMessageKeys[]>(keys: T) => keys;