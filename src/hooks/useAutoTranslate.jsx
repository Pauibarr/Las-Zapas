import { useEffect } from "react";
import { LibreTranslate } from "../hooks/LibreTranslate";

export function useAutoTranslate(language) {
  const { translate } = LibreTranslate();

  useEffect(() => {
    // Función para traducir un nodo de texto
    const translateTextNode = async (node) => {
      const originalText = node.textContent.trim();

      if (originalText && !node.dataset.translated) {
        node.dataset.translated = "processing"; // Marca el nodo como en proceso

        try {
          const translatedText = await translate(
            originalText,
            language === "en" ? "es" : "en", // Idioma fuente
            language // Idioma destino
          );
          node.textContent = translatedText;
          node.dataset.translated = "true"; // Marca el nodo como traducido
        } catch (error) {
          console.error(`Error translating text: "${originalText}"`, error);
          node.dataset.translated = "error"; // Marca el nodo como error
        }
      }
    };

    // Función para traducir todos los nodos de texto en el DOM
    const translateDOM = async () => {
      const elements = document.querySelectorAll(
        "*:not(script):not(style):not(meta):not(link)"
      );

      for (const element of elements) {
        if (
          element.childNodes.length === 1 &&
          element.childNodes[0].nodeType === Node.TEXT_NODE
        ) {
          await translateTextNode(element.childNodes[0]); // Traduce el nodo de texto
        }
      }
    };

    // Observador de cambios en el DOM
    const observer = new MutationObserver(() => {
      translateDOM(); // Traduce los nuevos nodos añadidos dinámicamente
    });

    translateDOM(); // Traducción inicial
    observer.observe(document.body, { childList: true, subtree: true }); // Observa cambios en el DOM

    // Limpieza del observador
    return () => observer.disconnect();
  }, [language]);
}
