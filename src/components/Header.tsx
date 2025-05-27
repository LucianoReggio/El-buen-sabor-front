import React from 'react';
import './Header.css';
import headerImage from '../../assets/img/Header.jpg';
import logo from '../../assets/logos/Logo-Completo.png';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <div className="top-section">
        <div className="logo-section">
          <img src={logo} alt="Logo El Buen Sabor" className="logo-img" />
        </div>
        <div className="image-section">
          <img src={headerImage} alt="Comida" className="food-img" />
        </div>
      </div>
      <nav className="navbar-categorias">
        <span className="label">CATEGORIAS</span>
        <span className="arrow">►</span>
        <ul>
          <li>Pizzas</li>
          <li>Lomos</li>
          <li>Burgers</li>
          <li>Tacos</li>
          <li>Bebidas</li>
        </ul>
        <span className="arrow">◄</span>
      </nav>
    </header>
  );
};

export default Header;
