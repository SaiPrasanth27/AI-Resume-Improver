// Safe localStorage utilities to prevent browser extension conflicts

export const safeLocalStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
      return false;
    }
  }
};

// Safe async operation wrapper
export const safeAsync = async (asyncFn, fallback = null) => {
  try {
    return await asyncFn();
  } catch (error) {
    console.warn('Async operation failed:', error);
    return fallback;
  }
};