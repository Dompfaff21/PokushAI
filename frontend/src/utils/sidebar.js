import { useEffect } from 'react';

const useSidebarPosition = () => {
  useEffect(() => {
    const updateSidebarPosition = () => {
      const header = document.querySelector("header");
      const sidebar = document.querySelector(".sidebar");
      if (!header || !sidebar) return;

      const headerRect = header.getBoundingClientRect();
      const topPosition = headerRect.bottom > 0 ? headerRect.bottom : 0;
      
      document.documentElement.style.setProperty(
        '--header-height', 
        `${topPosition}px`
      );
    };

    updateSidebarPosition();
    
    const events = ['scroll', 'resize', 'orientationchange'];
    events.forEach(event => 
      window.addEventListener(event, updateSidebarPosition)
    );

    return () => {
      events.forEach(event => 
        window.removeEventListener(event, updateSidebarPosition)
      );
    };
  }, []);
};

export default useSidebarPosition;