### Fase 1: Core de productos e infraestructura.
En esta etapa inicial, establecimos lo cimientos del sistema utilizando un enfoque monolito modular, preparando el terreno para la futura migración a microservicios.

- **Contenerización:** Orquestación de base de datos PostgreSQL mediante Docker para asegurar entornos de desarrollo idénticos.
- **Modelado de datos (Prisma 6):** Implementación de esquemas robustos para User y Product utilizando UUIDs para garantizar la escalabilidad y evitar colisiones de IDs en sistemas distribuidos.
- **Arquitectura modular:** Creación de módulos independientes en NestJS (Product, Prism), siguiendo el principio de responsabilidad única.
- **Integridad de Datos:** Uso de class-validator y class-transformer para sanitizar y validar las entrada de la API.
- **Estandarización de respuestas:** Implementación de un ResponseInterceptor global para aseguarar que el frontend reciba estructuras JSON consistentes.
- **Seed System:** Automatización de la carga de datos de prueba agilizar el desarrollo.

### Fase 2: Migración a microservicios y segregación de datos.
Se transformo el monilito en un sistema distribuido, desacoplando la lógica de negocio y persistencia.

**-Arquitectura de monorepo:** Implementación de NestJS monorepo gestionando múltiples aplicaciones en apps/:
    * Auth-services: Corazón de la identidad y seguridad.
    * Products-service: Gestión del catálogo de productos.
    * api-gateway: Punto de entrada único (proxy) que rutea el tráfico externo.
**-Segregación logica de base de datos (database per service):** Configuración de esquemas independientes en postgresSQL para evitar acoplamiento. Esquema Auth (Exclusivo para usuarios) y Esquema products (Exclusivo para el catálogo).
Clientes prisma localizados, cada microservicio genera su propio cliente ./client, garantizando que el auth-service no tennga acceso accidental a las tablas de productos (y viceversa).
**-Comunicación inter-servicios e infraestructura:**
    * Hybrid Auth Guard: Implementación de una libreria compartida para que el servicio de productos valide tokens JWT consultando al servicio de Auth vía HTTP.
    * Aislamiento de entorno: Uso el dotenv-cli para cargar archivos .env específicos por servicio, evitando conflictos de puertos y credenciales.
    * Scripts centralzidos: automatización de migraciones y seeds quirúrgicos desde la raíz del proyecto.

## Pasos de ejecución:
(1) Levantar DB: docker-compose up -d
(2) Configurar entornos: Cada servicio dene tener su archivo .enb
(3) Migraciones y generación de clientes: Scripsts 
Para el servicio de Auth
    npm run prisma:auth:mig -- --name init
    npm run prisma:auth:gen
Para el servicio de Inventario
    npm run prisma:prod:mig -- --name init
    npm run prisma:prod:gen
(4) Carga de datos (seeds): pruebo las db de forma independiente.
    npm run seed:auth  # Crea usuario Ciro
    npm run seed:prod  # Crea catálogo Apple
(5) Iniciar sistema:
    nest start api-gateway --watch
    nest start auth-service --watch
    nest start inventory-service --watch