export type Theme = "light" | "dark";
export const themeStorageKey = "portfolio-theme";

export function resolveTheme(value: string | null): Theme {
  return value === "light" ? "light" : "dark";
}

// Run before paint so the loading screen also uses the saved theme,
// and prevent unwanted scroll jumps on fresh visit/reload.
export const themeBootstrap = `try{var t=localStorage.getItem('${themeStorageKey}')==='light'?'light':'dark';document.documentElement.dataset.theme=t;document.documentElement.classList.toggle('dark',t==='dark');if('scrollRestoration' in history){history.scrollRestoration='manual';}var isNav=sessionStorage.getItem('nav_target_section');if(!isNav){if(window.location.hash){history.replaceState(null,'',window.location.pathname+window.location.search);}window.scrollTo(0,0);}}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.classList.add('dark');}`;
