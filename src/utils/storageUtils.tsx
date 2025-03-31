// src/utils/storageUtils.ts
export const getLocalStorageImage = (): string | null => {
  try {
    const img = localStorage.getItem("userImage");
    if (!img || img === "undefined" || img === "null" || !isValidHttpUrl(img)) {
      localStorage.removeItem("userImage");
      return null;
    }
    return img;
  } catch (error) {
    console.error("LocalStorage read error:", error);
    return null;
  }
};
export const setLocalStorageImage = (url: string): void => {
  try {
    if (url && isValidHttpUrl(url)) {
      localStorage.setItem("userImage", url);
      window.dispatchEvent(new Event("storage"));
    } else {
      localStorage.removeItem("userImage");
    }
  } catch (error) {
    console.error("LocalStorage write error:", error);
  }
};
export function isValidHttpUrl(url: string): boolean {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (err) {
    return false;
  }
}
