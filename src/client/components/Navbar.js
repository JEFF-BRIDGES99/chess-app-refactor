import { NavLink } from 'react-router-dom'

function Navbar() {

    return(
        <nav className="navbar">
            <NavLink to="/" exact={true} activeClassName="is-active">Home</NavLink>
            <NavLink to="/game" activeClassName="is-active">Play</NavLink>
            <NavLink to="/history" activeClassName="is-active">Look up a game</NavLink>
        </nav>
    );
}

export default Navbar;

