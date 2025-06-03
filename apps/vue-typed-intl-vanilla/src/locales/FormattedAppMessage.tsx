// import type { ReactNode } from "react";
// import type { Props as ReactIntlFormattedMessageProps } from "react-intl/src/components/message";
// import { FormattedMessage as ReactIntlFormattedMessage } from "react-intl";
import { enMessages } from './index';
import type { FlattenKeys } from '../types/utilityTypes';
import type { ExtractMessageDescriptorValues } from '../types/icuTypes';

type Messages = typeof enMessages;
export type MessageValuesMap = ExtractMessageDescriptorValues<Messages>;
export type AppIntlMessageKeys = FlattenKeys<Messages>;

export type ConditionalValues<K extends AppIntlMessageKeys> = {} extends MessageValuesMap[K]
  ? { values?: MessageValuesMap[K] }
  : { values: MessageValuesMap[K] };

// type FormattedMessageProps<K extends AppIntlMessageKeys> = Omit<ReactIntlFormattedMessageProps<Record<string, ReactNode>>, "values"> & {
//     id: K;
// } & ConditionalValues<K>;

// export default function FormattedAppMessage<K extends AppIntlMessageKeys>({ id, values, ...rest }: FormattedMessageProps<K>) {
//     return <ReactIntlFormattedMessage id={id} values={values} {...rest} />;
// }
