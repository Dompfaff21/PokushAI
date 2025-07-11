import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { themeManager } from '../../utils/theme';

const Header = () => {
  const location = useLocation();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    themeManager.init()
      .then(() => setIsInitialized(true))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      themeManager.updateIcons(
        document.body.classList.contains('dark-theme') ? 'dark' : 'light'
      );
    }
  }, [location.pathname, isInitialized]);

  return (
    <header id="name-section">
      <div className="logo">
        <img alt="логотип" src="/pictures/pig.png" />
      </div>
      <div className="authors" id="tg">
        <p>3pigs.inc</p>
        <img alt="tg" src="/pictures/tg.png"/>
      </div>


      {/* <form method="post" action="/logout">
            <button className="logout" type="submit">
              <div id="logout-icon"></div>
              <p>Выйти</p>
            </button>
          </form>

          <form method="post" action="/profile">
            <button className="logout" type="submit">
              <div id="user"></div>
              <p>Аккаунт</p>
            </button>
          </form> */}


      {!['/signup'].includes(location.pathname) && (
        <Link className="button" to="/signup">
          <div id="auth-icon"></div>
          <p>Войти</p>
        </Link>
      )}

      <div className="theme" id="theme-toggle"></div>
    </header>
  );
};

export default Header;

