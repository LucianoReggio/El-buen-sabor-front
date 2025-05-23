# Proyecto el Buen Sabor

---

## 🧱 Estructura de Capas para el Frontend con React

### 📁 1. **src/**

Carpeta raíz de tu aplicación React. Dentro de ella, puedes organizar todo así:

```
src/
├── assets/           # Imágenes, logos, íconos, etc.
├── components/       # Componentes reutilizables (Botón, Modal, Card, etc.)
├── features/         # Módulos funcionales (auth, menú, carrito, pedidos, etc.)
├── hooks/            # Custom Hooks
├── layout/           # Layouts generales (Navbar, Footer, etc.)
├── pages/            # Páginas completas (Home, Menu, Carrito, Login, etc.)
├── routes/           # Configuración de rutas (React Router)
├── services/         # Funciones para acceder a APIs (Axios, fetch, etc.)
├── store/            # Gestión de estado (Redux, Zustand, Context API)
├── types/            # Tipos y modelos (TypeScript)
├── utils/            # Funciones utilitarias
└── App.tsx           # Componente raíz
```

---

## 🧩 Descripción de cada capa o carpeta

### ✅ **components/**

Componentes reutilizables y genéricos que no dependen de una lógica de negocio específica. Ejemplos:

* `Button.tsx`
* `Input.tsx`
* `ProductCard.tsx`
* `Modal.tsx`

### ✅ **features/**

Módulos específicos del dominio del negocio. Aquí se agrupan **componentes**, **servicios** y **hooks** relacionados a cada función principal:

```
features/
├── auth/
│   ├── LoginForm.tsx
│   ├── authSlice.ts
│   └── authService.ts
├── menu/
│   ├── MenuList.tsx
│   ├── menuSlice.ts
│   └── menuService.ts
├── carrito/
│   ├── Cart.tsx
│   ├── cartSlice.ts
│   └── cartService.ts
```

### ✅ **hooks/**

Custom hooks reutilizables. Ejemplo:

* `useAuth()`
* `useCart()`
* `useFetch()`

### ✅ **layout/**

Componentes generales que envuelven el contenido de las páginas:

* `Navbar.tsx`
* `Footer.tsx`
* `MainLayout.tsx`

### ✅ **pages/**

Aquí están tus vistas principales, aquellas que se renderizan por rutas:

* `Home.tsx`
* `Menu.tsx`
* `Carrito.tsx`
* `Login.tsx`
* `Perfil.tsx`

### ✅ **routes/**

Toda la lógica de ruteo con React Router v6+:

* `AppRouter.tsx`

  ```tsx
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/menu" element={<Menu />} />
    <Route path="/carrito" element={<Carrito />} />
    ...
  </Routes>
  ```

### ✅ **services/**

Encapsula las llamadas HTTP a tu backend 

```ts
// menuService.ts
import axios from 'axios';

export const fetchMenu = () => axios.get('/api/menu');
export const fetchItem = (id: number) => axios.get(`/api/menu/${id}`);
```

### ✅ **store/**

Manejo del estado global. Si usás Redux:

```
store/
├── index.ts         # Configuración del store
├── authSlice.ts
├── menuSlice.ts
└── cartSlice.ts
```

Si preferís usar Context API o Zustand, iría también acá.

### ✅ **types/**

Interfaces y tipos TypeScript:

```ts
// MenuItem.ts
export interface MenuItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}
```

### ✅ **utils/**

Funciones utilitarias genéricas:

* `formatearPrecio()`
* `validarEmail()`
* `calcularTotalCarrito()`

---



