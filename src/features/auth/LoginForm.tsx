import React from 'react';

const LoginForm: React.FC = () => {
  return (
    <div className="form-container">
      <h2>Iniciar sesión en tu cuenta</h2>
      <form>
        <input type="email" placeholder="Correo Electrónico" />
        <input type="password" placeholder="Contraseña" />
        <a href="/recuperar">Olvidé mi contraseña</a>
        <button type="submit" className="btn-primary">Iniciar sesión</button>
        <p>¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
      
      <button type="button" className="btn-google">
          <img src="/img/google-icon.png" alt="Google" />
          Iniciar con Google
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
