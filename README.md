# Servicios de Productos con Contentful

## Descripción
Esta aplicación, desarrollada con NestJS y Node.js, bajo el diseño de los principios SOLID y Clean Architecture y esta se encarga de:
- Sincronizar cada hora los datos de productos desde Contentful.
- Exponer una API REST pública para consultar productos (paginar y filtrar).
- Proveer un módulo privado de informes (protegido con JWT) que muestra:
  - Porcentaje de productos eliminados.
  - Porcentaje de productos activos según filtros (precio y rango de fechas).
  - Reporte adicional (distribución por categoría).

## Tecnologías
- **Backend:** NestJS, Node.js
- **Base de datos:** PostgreSQL (accedida mediante TypeORM)
- **Documentación de API:** Swagger (accesible en `/api/docs`)
- **Docker:** Dockerfile y docker-compose
- **Testing:** Jest
- **CI/CD:** GitHub Actions

## Configuración y Variables de Entorno
Configure las  variables de entorno en el archivo `.env`:

Clonar el archivo ```.env.template``` y renombrarlo a
## Recursos

### Endpoints
 - Endpoints públicos:

`GET http://localhost:3000/products`
`DELETE http://localhost:3000/products/:id`
`POST http://localhost:3000/auth/login`

 - Endpoints privados:

`POST http://localhost:3000/products/sync`
`GET http://localhost:3000/reports/deleted-percentage`
`GET http://localhost:3000/reports/active-percentage`
`GET http://localhost:3000/reports/category-distribution`
`GET http://localhost:3000/reports/inventory-by-brand`



 - Ruta del Swagger (local):

 `http://localhost:3000/api/docs`


## Despliegue
1. Para levantar el servicio de la aplicación y la base de datos (postgres) con docker usa el siguiente comando: 
```bash
docker compose up -d
```

Para reforzar la construccion o en el contexto de construccion:
```bash
docker compose up -d --build
```

Eliminación del volumen creado (si se requiere):
```bash
docker-compose down -v
```

1. Para usar los endpoints privados se requiere genera el token JWT:

 - Para generar el Token JWT se tiene que ingresar la misma contraseña y nombre de usuario que está guardada en las variables de entorno (AUTH_USER y AUTH_PASSWORD) del archivo `.env`. Y ejecutar el endpoint `/auth/login`

  - NOTA: Solo por temas de ejemplo se hizo la implementación del login con credenciales harcodeado. En un contexto real se usaría una BD.

 - Copie el valor del token JWT e ingresalo en el campo "value" al hacer click en el botón Authorize del Swagger.

2. Para forzar una actualización de la base de datos por primera vez se ejecuta el siguiente endpoint

 `POST http://localhost:3000/products/sync`

 
 - Opciones: Para registrar al menos un registro en la base de datos:

  - Utiliza TablePlus u otra herramienta para ingresar a la base de datos de Postgres
   Una vez ingresado a la base de datos inserte el script SQL que se encuentra el archivo `db-init\seed.sql`

Opciones:
Otra opción de desplegar es ejecutando el entorno de desarrollo desde la raiz del proyecto:

```bash
npm run start:dev
```

## Ejecutar Unit Testing

### Ejecución de Pruebas Unitarias con Docker
```bash
docker-compose run app npm run test
```

### Ejecución de todas las Pruebas Unitarias desde la raíz del proyecto
```bash
npm run test
```
 Opciones: Ejecución de las Pruebas Unitarias desde la raíz del proyecto de forma explícita 

```bash
npx jest test/product.spec.ts
npx jest test/report.spec.ts
npx jest test/product.controller.spec.ts
npx jest test/report.controller.spec.ts
```

## Validación del código fuente de la aplicación

```bash
docker-compose run app npm run lint
```