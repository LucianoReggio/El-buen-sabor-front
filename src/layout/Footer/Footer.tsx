import './Footer.css';
import logoMoto from '../../assets/logos/Logo-imagen.png';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={logoMoto} alt="Logo Moto" className="footer-logo" />
          </div>
          <div className="footer-center">
            
          <div className="contact-info">
            <h4>Medios de contacto</h4>
            <p><Phone size={16} /> +54 261 4692230</p>
            <p><Mail size={16} /> mail@elbuenSabor.com.ar</p>
            <p><MapPin size={16} /> Av. San Martín 123, Ciudad, Mendoza</p>
          </div>
        </div>
        <div className="footer-right">
          <h4>¡Seguinos en nuestras redes!</h4>
          <p><Instagram size={16} /> @ElBuenSabor.Restaurante</p>
          <p><Facebook size={16} /> El-Buen-Sabor</p>
        </div>
      </div>
    </footer>
  );
}
