import { useEffect, useState } from "react";

import {Footer} from "./components/Footer";
import {Header} from "./components/Header";
import {MainContent} from "./components/MainContent";

export function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const savedTheme = window.localStorage.getItem('theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    return document.body.classList.contains('ids--dark') ? 'dark' : 'light'
  })

  useEffect(() => {
    document.body.classList.remove('ids--light', 'ids--dark')
    document.body.classList.add(theme === 'dark' ? 'ids--dark' : 'ids--light')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col bg-ids-surface-background text-ids-surface-text">
      <Header />
      <main className="flex-1 bg-ids-surface-background">
        <MainContent />
      </main>
      <Footer
        isDarkMode={theme === 'dark'}
        onThemeChange={(isDarkMode) => setTheme(isDarkMode ? 'dark' : 'light')}
      />
    </div>
  );
}