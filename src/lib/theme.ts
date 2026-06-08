export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "strada-theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

export function resolveTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) return stored;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_STORAGE_KEY, theme);

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#f8fafc" : "#020617");
  }
}

/** Inline script — prevents flash of wrong theme before hydration. */
export const themeInitScript = `(function(){try{var k="strada-theme";var t=localStorage.getItem(k);var d=document.documentElement;if(t==="light"||t==="dark"){d.dataset.theme=t;}else if(window.matchMedia("(prefers-color-scheme: light)").matches){d.dataset.theme="light";}else{d.dataset.theme="dark";}}catch(e){document.documentElement.dataset.theme="dark";}})();`;
