import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

function Header() {
  return (
    <nav className="navbar bg-light mb-4 p-0">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <div className="d-flex">
            <img src={logo} alt="logo" className="mr-2" />
            <div>ProjectMgmt</div>
          </div>
        </Link>
      </div>
    </nav>
  );
}

export default Header;
