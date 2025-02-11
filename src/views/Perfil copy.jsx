import { useGlobalContext } from "../context/GlobalContext";

const Perfil = () => {
  const { compras } = useGlobalContext();

  return (
    <div>
      <h2>Mis Compras</h2>
      <ul>
        {compras.map((compra) => (
          <li key={compra.id} style={{ display: "flex", gap: "10px" }}>
            <img src={compra.Productos.imagen} alt={compra.Productos.nombre} width="50" />
            <div>
              <p>{compra.Productos.nombre}</p>
              <p>{compra.Productos.precio}€</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Perfil;