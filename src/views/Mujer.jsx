import { Link } from "react-router-dom"

export function Mujer(){

    return(
        <div>
            <Link to="/mujer">
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