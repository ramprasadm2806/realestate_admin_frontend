import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiPlus, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__logo">RAM</div>
        <div>
          <strong>Admin Panel</strong>
          <span>Land Developers</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          <FiHome /> All Properties
        </NavLink>
        <NavLink to="/add" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FiPlus /> Add Property
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        <p>{admin?.email}</p>
        <button type="button" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>
    </aside>
  );
}
