import React from 'react';
import LoginForm from '../features/auth/LoginForm';
import '../components/Register.css'; // reutilizás los estilos

const Login: React.FC = () => {
  return (
    <div className="register-container">
      <div className="register-image">
        <img src="/img/Registro-Login.png" alt="Repartidor" />
      </div>
      <div className="register-form-section">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
