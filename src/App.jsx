import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ResponsiveAppBar from './components/Nav';
import Home from "./pages/Home"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <ResponsiveAppBar/>
    <Home/>
    </>
  )
}

export default App
