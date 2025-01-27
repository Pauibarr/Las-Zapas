import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';


// Traducciones
const resources = {
  en: {
    translation: {
      "Home":"Home",
      "Name":"Name",
      "Role":"Role",
      "Actions":"Actions",
      "User Management":"User Management",
      "Welcome":"Welcome",
      "Users":"Users",
      "Rubén Henares Hidalgo&apos; art page, to make known the art of the world.":"Rubén Henares Hidalgo's art page, to make known the art of the world.",
      "Sculptures": "Sculptures",
      "Paintings": "Paintings",
      "Gioconda":"Gioconda",
      "Starry Night":"Starry Night",
      "Featured Sculpture":"Featured Sculpture",
      "A masterpiece by Vincent van Gogh.":"A masterpiece by Vincent van Gogh.",
      "An iconic painting by Leonardo da Vinci.":"An iconic painting by Leonardo da Vinci.",
      "Created by":"Created by",
      "Sculpture (from the Latin sculptūra) is the art of molding clay, carving in stone, wood and other materials. The work created by a sculptor is also called sculpture.":"Sculpture (from the Latin sculptūra) is the art of molding clay, carving in stone, wood and other materials. The work created by a sculptor is also called sculpture.",
      "Painting is the art of graphic representation using pigments mixed with other binding substances, organic or synthetic. This art uses painting techniques, knowledge of color theory and pictorial composition, and drawing. The practice of the art of painting consists of applying, on a specific surface a sheet of paper, a canvas, a wall, a piece of wood, a fragment of fabric, etc. A specific technique, to obtain a composition of shapes, colors, textures, drawings, etc. giving rise to a work of art according to some aesthetic principles.":"Painting is the art of graphic representation using pigments mixed with other binding substances, organic or synthetic. This art uses painting techniques, knowledge of color theory and pictorial composition, and drawing. The practice of the art of painting consists of applying, on a specific surface a sheet of paper, a canvas, a wall, a piece of wood, a fragment of fabric, etc. A specific technique, to obtain a composition of shapes, colors, textures, drawings, etc. giving rise to a work of art according to some aesthetic principles.",
      "Login":"Login",
      "Sign up":"Sign up",
      "Logout":"Logout",
      "Edit":"Edit",
      "Delete":"Delete"
    }
  },
  es: {
    translation: {
      "Home":"Inicio",
      "Name":"Nombre",
      "Role":"Rol",
      "Actions":"Acciones",
      "User Management":"Gestión de Usuarios",
      "Welcome":"Bienvenido/a",
      "Users":"Usuarios",
      "Rubén Henares Hidalgo&apos; art page, to make known the art of the world.":"Página de arte de Rubén Henares Hidalgo, para dar a conocer el arte del mundo.",
      "Sculptures": "Esculturas",
      "Paintings": "Pinturas",
      "Gioconda":"Mona Lisa",
      "Starry Night":"Noche Estrellada",
      "Featured Sculpture":"Escultura destacada",
      "A masterpiece by Vincent van Gogh.":"Una obra maestra de Vincent van Gogh.",
      "An iconic painting by Leonardo da Vinci.":"Una pintura icónica de Leonardo da Vinci.",
      "Created by":"Creado por",
      "Sculpture (from the Latin sculptūra) is the art of molding clay, carving in stone, wood and other materials. The work created by a sculptor is also called sculpture.":"Se llama escultura (del latín sculptūra) al arte de moldear el barro, tallar en piedra, madera y otros materiales. También se denomina escultura a la obra elaborada por un escultor.",
      "Painting is the art of graphic representation using pigments mixed with other binding substances, organic or synthetic. This art uses painting techniques, knowledge of color theory and pictorial composition, and drawing. The practice of the art of painting consists of applying, on a specific surface a sheet of paper, a canvas, a wall, a piece of wood, a fragment of fabric, etc. A specific technique, to obtain a composition of shapes, colors, textures, drawings, etc. giving rise to a work of art according to some aesthetic principles.":"La pintura es el arte de la representación gráfica utilizando pigmentos mezclados con otras sustancias aglutinantes, orgánicas o sintéticas. En este arte se emplean técnicas de pintura, conocimientos de teoría del color y de composición pictórica, y el dibujo. La práctica del arte de pintar, consiste en aplicar, en una superficie determinada una hoja de papel, un lienzo, un muro, una madera, fragmento de tejido, etc. Una técnica determinada, para obtener una composición de formas, colores, texturas, dibujos, etc. dando lugar a una obra de arte según algunos principios estéticos.",
      "Login":"Iniciar sesión",
      "Sign up":"Registrarse",
      "Logout":"Cerrar sesión",
      "Edit":"Editar",
      "Delete":"Eliminar"
    }
  }
};

i18n
  .use(initReactI18next) // Vincula con react-i18next
  .init({
    resources,
    lng: 'es', // Idioma predeterminado
    interpolation: {
      escapeValue: false // React ya hace escaping
    }
  });

  export default i18n;