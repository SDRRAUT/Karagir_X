import { useAppStore } from '@/store/useAppStore';
import { translations, TranslationsDictionary } from '@/locales/translations';

export const useTranslation = () => {
  const locale = useAppStore((s) => s.locale);
  const langKey: 'en' | 'hi' = locale.startsWith('hi') ? 'hi' : 'en';
  const t: TranslationsDictionary = translations[langKey];

  return {
    t,
    locale,
    isHindi: langKey === 'hi',
    langKey,
  };
};
