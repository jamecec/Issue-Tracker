import LoginButton from "./LoginButton.js";
import LogoutButton from "./LogoutButton.js";
import Profile from "./Profile.js";
import { Link, useMatch, useResolvedPath } from 'react-router-dom';

export default function Navbar() {
  const path = window.location.pathname;
  return(
    <>
    <nav className="nav">
    <Link to="/" className="site-title">Issue Tracker</Link>
    <ul>
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/issues">Issues</CustomLink>
        <CustomLink to="/add-issue">Add Issue</CustomLink>
        <CustomLink to="/my-issues">My Issues</CustomLink>
      <li>
        <LoginButton/>
      </li>
      <li>
      <Link to="/my-issues"><Profile/></Link>
      </li>
      <li>
        <LogoutButton/>
      </li>
    </ul>
      </nav>
    </>
  )
}

function CustomLink({to, children}){
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  return(
    <li className={isActive ? "active": ""}>
      <Link to={to}>{children}</Link>
    </li>
  )
}
