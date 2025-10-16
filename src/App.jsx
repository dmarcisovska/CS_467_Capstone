
import { Routes, Route } from 'react-router-dom';
import './App.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import ResponsiveAppBar from './components/Nav';
import Home from './pages/Home'
import Events from './pages/Events';
import Create from './pages/Create';

function App() {

  return (
    <>
    
    <ResponsiveAppBar/>
     <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/events' element={<Events />} />
        <Route path='/create' element={<Create />} />
      </Routes>
    </>
  )
}

export default App
