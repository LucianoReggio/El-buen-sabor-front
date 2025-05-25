
import './App.css'

import { Routes, Route } from 'react-router-dom'
import Footer from './layout/Footer/Footer';
import Home from './pages/Home';
function App() {
  return (
    <>
{/* Navbar visible en todas las páginas */}

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;