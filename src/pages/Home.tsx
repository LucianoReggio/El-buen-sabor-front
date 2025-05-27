import React from "react";
import Header from "../components/layouts/Header"; // ajustá el path si cambia

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      {/* Acá podés seguir agregando el contenido de la página principal */}
      <section>
        <h2>Bienvenido a El Buen Sabor</h2>
        <p>Explorá nuestras categorías y elegí tu comida favorita.</p>
      </section>
    </div>
  );
};

export default Home;
