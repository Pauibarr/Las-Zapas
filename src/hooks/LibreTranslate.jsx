import { useState } from 'react';

export function LibreTranslate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const translate = async (text, sourceLang, targetLang) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://libretranslate.com/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang,
                    format: "text",
                }),
            });

            const data = await response.json();
            setLoading(false);
            return data.translatedText;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return text; // Devuelve el texto original en caso de error
        }
    };

    return { translate, loading, error };
}