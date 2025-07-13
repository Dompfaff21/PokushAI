import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { themeManager } from '../../utils/theme';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    themeManager.init();
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    const handleResize = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const closeSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <aside 
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      onMouseEnter={() => !isMobile && setIsCollapsed(false)}
      onMouseLeave={() => !isMobile && setIsCollapsed(true)}
      onClick={isMobile ? (isCollapsed ? toggleSidebar : undefined) : undefined}
    >
      <div className="sidebar__content">
        <div className="sidebar__item">
            <button 
                className="hamburger-icon" 
                aria-label="Меню"
                onClick={(e) => {
                  if (isMobile) {
                    e.stopPropagation();
                    toggleSidebar();
                  }
                }}
            >
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
                <span className="hamburger-bar"></span>
            </button>
            
            <div className="item__text">
                <p>Навигация</p>
            </div>
            
            {isMobile && !isCollapsed && (
                <span className="close-btn" onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(true);
                }}>&times;</span>
            )}
        </div>
        <hr className="shr" />
        
        <div className="sidebar__item">
          <div id="home">
            <img 
              src={document.body.classList.contains('dark-theme')
                ? "/pictures/light_theme/home_light.png"
                : "/pictures/dark_theme/home_dark.png"} 
              alt="Home"
            />
          </div>
          <div className="item__text">
            <Link to="/" className="sidebar-link" onClick={closeSidebar}>Главная</Link>
          </div>
        </div>
        
        <div className="sidebar__item">
          <div id="programm">
            <img 
              src={document.body.classList.contains('dark-theme')
                ? "/pictures/light_theme/programm_light.png"
                : "/pictures/dark_theme/programm_dark.png"} 
              alt="App"
            />
          </div>
          <div className="item__text">
            <Link to="/app" className="sidebar-link" onClick={closeSidebar}>Приложение</Link>
          </div>
        </div>
        
        <div className="sidebar__item">
          <div id="recipe">
            <img 
              src={document.body.classList.contains('dark-theme')
                ? "/pictures/light_theme/recipe_light.png"
                : "/pictures/dark_theme/recipe_dark.png"} 
              alt="Collections"
            />
          </div>
          <div className="item__text">
            <Link to="/posts" className="sidebar-link" onClick={closeSidebar}>Подборки</Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;