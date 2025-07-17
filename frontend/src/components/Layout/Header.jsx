import React, { useEffect, useState, useContext } from 'react'; // Добавляем useContext
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { themeManager } from '../../utils/theme';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const { authState, logout } = useContext(AuthContext); // Используем контекст

  useEffect(() => {
    themeManager.init()
      .then(() => setIsInitialized(true))
      .catch(console.error);
  }, []);

  const isProfilePage = location.pathname === '/profile';
  const isSignupPage = location.pathname === '/signup';
  const isLoginPage = location.pathname === '/login';

  const handleLogout = (e) => {
    e.preventDefault();
    logout(); // Используем функцию logout из контекста
    navigate('/signup');
  };

  const handleProfile = (e) => {
    e.preventDefault();
    navigate('/profile');
  };

  useEffect(() => {
    if (isInitialized) {
      themeManager.updateIcons(
        document.body.classList.contains('dark-theme') ? 'dark' : 'light'
      );
    }
  }, [location.pathname, isInitialized]);

  const headerClass = location.pathname === '/' ? 'header_index' : '';

  return (
    <header id="name-section" className={headerClass}>
      <div className="logo">
        <img alt="логотип" src="/pictures/pig.png" />
      </div>
      <div className="authors" id="tg">
        <p>3pigs.inc</p>
        <img alt="tg" src="/pictures/tg.png"/>
      </div>

      {!isSignupPage && !isLoginPage && (
        <>
          {authState.isAuthenticated ? ( // Используем authState из контекста
            isProfilePage ? (
              <button className="logout" onClick={handleLogout}>
                <div id="logout-icon"></div>
                <p>Выйти</p>
              </button>
            ) : (
              <button className="logout" onClick={handleProfile}>
                <div id="user"></div>
                <p>{authState.username}</p>
              </button>
            )
          ) : (
            <Link className="button" to="/signup">
              <div id="auth-icon"></div>
              <p>Войти</p>
            </Link>
          )}
        </>
      )}

      <div className="theme" id="theme-toggle"></div>
    </header>
  );
};

export default Header;