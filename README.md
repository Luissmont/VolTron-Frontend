# VolTron Frontend

VolTron es una plataforma web orientada a la ingeniería de circuitos robóticos. Permite a los usuarios explorar un catálogo de componentes electrónicos, construir proyectos de circuito en una mesa de ensamblaje virtual y obtener un diagnóstico eléctrico automático generado por el backend antes del ensamblaje físico.

La aplicación fue construida con Next.js 15 utilizando el App Router y se comunica con una API REST desarrollada en FastAPI.


## Descripción general del sistema

El flujo principal de la aplicación es el siguiente:

El usuario navega al Taller para explorar el catálogo de componentes disponibles. Selecciona las piezas que desea utilizar y las agrega a la Mesa de Ensamblaje. Una vez armado el circuito virtual, solicita una validación que comprueba la compatibilidad de voltaje y el consumo de corriente. El sistema devuelve un diagnóstico en lenguaje claro que indica si el circuito es seguro para el ensamblaje físico.

El acceso a funciones avanzadas requiere registro e inicio de sesión. El sistema distingue entre un modo invitado y un modo ingeniero, controlado mediante un token JWT almacenado en el navegador.


## Tecnologías utilizadas

**Framework principal:** Next.js 15 con App Router

**Lenguaje:** TypeScript

**Estilos:** Tailwind CSS v4 con paleta personalizada de colores industriales definida mediante variables CSS

**Autenticación:** JWT manejado en el cliente mediante localStorage, compatible con el estándar OAuth2 de FastAPI

**Arquitectura de componentes:** Componentes de servidor para las vistas de solo lectura (catálogo) y componentes de cliente para las vistas interactivas (ensamblaje, autenticación, navegación)


## Estructura del proyecto

```
voltron-frontend/
  app/
    page.tsx              Vista del Taller (catálogo de componentes)
    loading.tsx           Skeleton loader automático del Taller
    layout.tsx            Layout global con barra de navegación reactiva
    globals.css           Variables de diseño y estilos base
    ensamblaje/
      page.tsx            Mesa de Ensamblaje con motor de validación
    auth/
      login/
        page.tsx          Vista de inicio de sesion
      registro/
        page.tsx          Vista de creacion de cuenta
  servicios/
    api.ts                Servicio para obtener el catálogo de componentes
    proyectos.ts          Servicios para crear proyectos, vincular piezas y validar circuitos
    auth.ts               Servicios para inicio de sesion y registro de usuario
```


## Requisitos previos

Antes de ejecutar el proyecto es necesario tener instalado Node.js versión 18 o superior y tener acceso a la API de VolTron corriendo localmente o en un servidor.


## Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente variable:

```
NEXT_PUBLIC_URL_API_BASE=http://localhost:8000
```

El prefijo `NEXT_PUBLIC_` es obligatorio para que Next.js exponga la variable al navegador, ya que las peticiones se realizan desde el cliente.


## Instalación y ejecución

Instalación de dependencias:

```bash
npm install
```

Servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000


## Vistas y funcionalidades

**Taller (ruta /)**

Muestra el catálogo completo de componentes obtenido desde la API. Cada tarjeta muestra el nombre, la categoría, el nivel lógico, los miliamperios máximos y el precio en MXN y USD. Mientras carga, se muestra un skeleton loader que simula las tarjetas para mejorar la experiencia del usuario.

**Inicio de sesion (ruta /auth/login)**

Formulario que autentica al usuario enviando las credenciales al endpoint `/auth/login` del backend mediante el formato `application/x-www-form-urlencoded` requerido por el estándar OAuth2. Si la autenticación es exitosa, el token de acceso se guarda en el localStorage bajo la clave `token_voltron`.

**Registro (ruta /auth/registro)**

Formulario para crear una nueva cuenta enviando nombre, correo y contraseña como JSON al endpoint `/auth/register`. Tras un registro exitoso redirige automáticamente al inicio de sesion.


## Endpoints de la API consumidos

El servicio de catálogo consume `GET /components/` para traer todos los componentes disponibles.

El servicio de proyectos consume tres rutas: `POST /projects/` para crear un proyecto, `POST /projects/{id}/components/` para vincular una pieza y `GET /projects/{id}/validation` para obtener el diagnóstico eléctrico.

El servicio de autenticación consume `POST /auth/login` para iniciar sesion y `POST /auth/register` para registrar usuarios.


## Convenciones del proyecto

El código sigue las siguientes reglas de estilo establecidas para el proyecto:

Las variables, funciones y estados se nombran en español usando snake_case. No se incluyen comentarios dentro de los archivos de lógica. Los componentes interactivos incluyen la directiva `"use client"` al inicio del archivo. Los componentes de solo lectura como el catálogo son componentes de servidor y no llevan esa directiva.


