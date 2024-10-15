import { Link } from "react-router-dom";

export function Hombre(){

    return(
        <div>
            <Link to="/hombre">
            <ul>
                <li>
                    Zapatillas
                </li>
                <li>
                    Zapatos de Vestir
                </li>
                <li>
                    Botas y Botines
                </li>
            </ul>
            </Link>
        </div>
    )
}