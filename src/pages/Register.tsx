import React from 'react';
import RegisterForm from '../features/auth/RegisterForm';
import '../components/Register.css'; 
const Register: React.FC = () => {
  return (
    <div className="register-container">
      <div className="register-image">
        <img src="/img/Registro-Login.png" alt="Delivery" />
      </div>
      <div className="register-form-section">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
