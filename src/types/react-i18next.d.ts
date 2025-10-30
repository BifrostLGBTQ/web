declare module 'react-i18next' {
  import type { FC } from 'react';
  export const initReactI18next: any;
  export function useTranslation(ns?: string): { t: (key: string, opts?: Record<string, any>) => string };
  export const I18nextProvider: FC<any>;
}
