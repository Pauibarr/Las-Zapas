-Creo un proyecto con react + vite + javascript:

npm i create vite .
    react
    javascript
npm i
npm run dev

-instalamos react-router-dom
    Sirve para navegar entre vistas y utilizar componentes

    App.jsx:
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/footer' element={<Footer />} />
        </Routes>

-instalamos tailwind.css
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p

Quito el contenido del index.css y App.css.Y añado contenido del tailwind al index.css

    @tailwind base;
    @tailwind components;
    @tailwind utilities;

