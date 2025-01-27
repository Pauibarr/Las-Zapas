import { useTranslation } from 'react-i18next';

export function LanguageToggleButton() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 mx-1 text-white dark:text-blue-gray-800 dark:hover:text-blue-gray-400 hover:text-blue-gray-400 hover:scale-x-105 hover:scale-y-105 transition duration-150 border-double border-4 border-spacing-4 border-white dark:border-blue-gray-800 rounded"
    >
      {i18n.language === 'es' ? 'ES' : 'EN'}
    </button>
  );
}