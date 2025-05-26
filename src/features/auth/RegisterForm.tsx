import React from 'react';

const RegisterForm: React.FC = () => {
  return (
    <div className="form-container">
      <h2>Regístrate y disfruta nuestras delicias</h2>
      <form>
        <input type="text" placeholder="Nombre" />
        <input type="text" placeholder="Apellido" />
        <input type="text" placeholder="Dirección" />
        <input type="text" placeholder="Departamento" />
        <input type="number" placeholder="Teléfono" />
        <input type="email" placeholder="Correo Electrónico" />
        <input type="password" placeholder="Contraseña" />
        <input type="password" placeholder="Confirmación Contraseña" />

        <button type="submit" className="btn-primary">Crear cuenta</button>
        <p>¿Ya tienes cuenta? <a href="/login">Iniciar sesión</a></p>

        <button type="button" className="btn-google">
          <img src="/img/google-icon.png" alt="Google" />
          Regístrate con Google
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
