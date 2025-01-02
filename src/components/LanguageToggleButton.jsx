import { useState } from 'react';
import { LibreTranslate } from '../hooks/LibreTranslate'; // Ruta al hook

export function LanguageToggleButton() {
    const { translate, loading, error } = LibreTranslate();
    const [language, setLanguage] = useState('es');
    const [translatedText, setTranslatedText] = useState("Hola, mundo!");

    const toggleLanguage = async () => {
        const newLanguage = language === 'es' ? 'en' : 'es';
        const sourceLang = language;
        const targetLang = newLanguage;

        const result = await translate(translatedText, sourceLang, targetLang);
        setTranslatedText(result);
        setLanguage(newLanguage);
    };

    return (
        <div>
            <button onClick={toggleLanguage}  className="px-2 py-1 mx-1 text-white dark:text-blue-gray-800 dark:hover:text-blue-gray-400 hover:text-blue-gray-400 hover:scale-x-105 hover:scale-y-105 transition duration-150 border-double border-4 border-spacing-4 border-white dark:border-blue-gray-800 rounded">
                {language === 'es' ? 'EN' : 'ES'}
            </button>
            <p>{loading ? 'Traduciendo...' : translatedText}</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
}