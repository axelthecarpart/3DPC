import { Routes, Route } from 'react-router-dom'
//import { useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import './App.css'
import { Header } from './components/header'
import HomePage from './pages/home'
import BuilderPage from './pages/builder'
function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
      </Routes>
    </ThemeProvider>

  )
}

export default App
