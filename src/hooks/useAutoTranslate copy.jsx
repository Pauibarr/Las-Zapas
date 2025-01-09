import { useEffect } from "react";
import { LibreTranslate } from "../hooks/LibreTranslate";

export function useAutoTranslate(language) {
  const { translate } = LibreTranslate();

  useEffect(() => {
    const translateDOM = async () => {
      const elements = document.querySelectorAll(
        "*:not(script):not(style):not(meta):not(link)"
      );

      for (const element of elements) {
        if (
          element.childNodes.length === 1 &&
          element.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
          const originalText = element.textContent.trim();

          // Evita traducir textos vacíos o ya traducidos
          if (originalText && !element.dataset.translated) {
            try {
              const translatedText = await translate(
                originalText,
                language === "en" ? "es" : "en", // Idioma fuente
                language // Idioma destino
              );
              element.textContent = translatedText;
              element.dataset.translated = "true"; // Marca como traducido
            } catch (error) {
              console.error(`Error translating text: "${originalText}"`, error);
            }
          }
        }
      }
    };

    translateDOM();
  }, [language]); // Se ejecuta cada vez que cambia el idioma
}
