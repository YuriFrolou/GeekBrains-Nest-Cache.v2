import styles from './header.module.css';
import {NavLink} from "react-router-dom";

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">GeekBrains</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                  data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                  aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav d-flex justify-content-end" style={{width:'90%'}}>
              <NavLink className="nav-link" aria-current="page" to="/">All news</NavLink>
              <NavLink className="nav-link" aria-current="page" to="/create">Create news</NavLink>
              <NavLink className="nav-link" to="/auth">Login</NavLink>
            </div>
          </div>
          </div>
      </nav>

    </header>
  );
}

export default Header;
