/**
 * Utility functions for theme detection and management
 */

/**
 * Detect the current theme mode (dark or light)
 * This checks multiple sources in order of priority:
 * 1. localStorage theme setting
 * 2. Document class (dark/light)
 * 3. Data attributes on document
 * 4. System preference
 */
export const detectThemeMode = (): boolean => {
  try {
    // Check localStorage first (highest priority)
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;
    
    // Then check document class
    if (document.documentElement.classList.contains('dark')) {
      return true;
    }
    if (document.documentElement.classList.contains('light')) {
      return false;
    }
    
    // Check for data attributes
    const dataTheme = document.documentElement.getAttribute('data-theme');
    if (dataTheme === 'dark') return true;
    if (dataTheme === 'light') return false;
    
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (e) {
    // If anything fails, assume light mode as safer default
    console.error('Error detecting theme:', e);
    return false;
  }
};

/**
 * Set up a listener for theme changes
 * @param callback Function to call when theme changes
 * @returns Cleanup function to remove listeners
 */
export const watchThemeChanges = (callback: (isDarkMode: boolean) => void): () => void => {
  // Watch for document attribute changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.attributeName === 'class' || 
        mutation.attributeName === 'data-theme' ||
        mutation.attributeName === 'data-mode'
      ) {
        callback(detectThemeMode());
        break;
      }
    }
  });
  
  // Watch DOM attributes
  observer.observe(document.documentElement, { 
    attributes: true, 
    attributeFilter: ['class', 'data-theme', 'data-mode']
  });
  
  // Watch for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleMediaChange = () => callback(detectThemeMode());
  mediaQuery.addEventListener('change', handleMediaChange);
  
  // Watch for storage changes (for cross-tab consistency)
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'theme') {
      callback(detectThemeMode());
    }
  };
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    observer.disconnect();
    mediaQuery.removeEventListener('change', handleMediaChange);
    window.removeEventListener('storage', handleStorageChange);
  };
};