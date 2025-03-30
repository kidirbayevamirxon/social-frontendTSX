// src/utils/storageUtils.ts
export const getLocalStorageImage = (): string | null => {
    try {
      const img = localStorage.getItem('userImage');
      return img && img !== 'undefined' && img !== 'null' ? img : null;
    } catch (error) {
      console.error('LocalStorage read error:', error);
      return null;
    }
  };
  
  export const setLocalStorageImage = (url: string): void => {
    try {
      if (url) {
        localStorage.setItem('userImage', url);
        window.dispatchEvent(new Event('storage'));
      }
    } catch (error) {
      console.error('LocalStorage write error:', error);
    }
  };