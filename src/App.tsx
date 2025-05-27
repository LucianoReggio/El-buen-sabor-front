
import './App.css'

import { Routes, Route } from 'react-router-dom'
import Footer from './components/common/Layout/Footer';
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