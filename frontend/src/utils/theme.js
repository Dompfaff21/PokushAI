class ThemeManager {
  constructor() {
    this.initialized = false;
    this.darkThemeIcons = [
      '/pictures/sidebar/home.svg',
      '/pictures/sidebar/programm.svg',
      '/pictures/sidebar/recipe.svg',
      '/pictures/sidebar/user.svg',
      '/pictures/face.svg',
      '/pictures/logout.svg',
    ];
    
    this.themeIcons = {
      dark: '/pictures/theme.svg',
      light: '/pictures/theme_dark.svg'
    };
    
    this.iconMap = {
      'home': 0,
      'programm': 1,
      'recipe': 2,
      'user': 3,
      'auth-icon': 4,
      'logout-icon': 5
    };
  }
  
  async init() {
    if (this.initialized) return;
    await this.loadIcons();
    this.setInitialTheme();
    this.setupEventListeners();
    this.initialized = true;
  }
  
  async loadIcons() {
    this.darkIcons = await this.loadMultipleSvgs(this.darkThemeIcons);
    this.themeSvgs = {
      dark: await this.loadSvg(this.themeIcons.dark),
      light: await this.loadSvg(this.themeIcons.light)
    };
  }
  
  async loadSvg(filePath) {
    const response = await fetch(filePath);
    return await response.text();
  }
  
  async loadMultipleSvgs(filePaths) {
    const svgPromises = filePaths.map(filePath => this.loadSvg(filePath));
    return await Promise.all(svgPromises);
  }
  
  setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemDark ? 'dark' : 'light');
    this.setTheme(theme, !savedTheme);
  }
  
  setTheme(theme, isInitial = false) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(theme === 'dark' ? 'dark-theme' : 'light-theme');
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = this.themeSvgs[theme === 'dark' ? 'light' : 'dark'];
    }
    
    this.updateIcons(theme);
    
    if (!isInitial) {
      localStorage.setItem('theme', theme);
    }
  }
  
  updateIcons(theme) {
    const icons = this.darkIcons;
    for (const [id, index] of Object.entries(this.iconMap)) {
      const element = document.getElementById(id);
      if (element) element.innerHTML = icons[index];
    }
  }
  
  toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    this.setTheme(isDark ? 'light' : 'dark');
  }
  
  setupEventListeners() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.removeEventListener('click', this.toggleThemeHandler);
      this.toggleThemeHandler = () => this.toggleTheme();
      toggleBtn.addEventListener('click', this.toggleThemeHandler);
    }
  }
}

export const themeManager = new ThemeManager();