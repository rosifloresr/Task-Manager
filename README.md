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

- **Arquitectura de monorepo:** Implementación de NestJS monorepo gestionando múltiples aplicaciones en apps/:
    * Auth-services: Corazón de la identidad y seguridad.
    * Products-service: Gestión del catálogo de productos.
    * api-gateway: Punto de entrada único (proxy) que rutea el tráfico externo.
- **Segregación logica de base de datos (database per service):** Configuración de esquemas independientes en postgresSQL para evitar acoplamiento. Esquema Auth (Exclusivo para usuarios) y Esquema products (Exclusivo para el catálogo).
Clientes prisma localizados, cada microservicio genera su propio cliente ./client, garantizando que el auth-service no tennga acceso accidental a las tablas de productos (y viceversa).
- **Comunicación inter-servicios e infraestructura:**
    * Hybrid Auth Guard: Implementación de una libreria compartida para que el servicio de productos valide tokens JWT consultando al servicio de Auth vía HTTP.
    * Aislamiento de entorno: Uso el dotenv-cli para cargar archivos .env específicos por servicio, evitando conflictos de puertos y credenciales.
    * Scripts centralzidos: automatización de migraciones y seeds quirúrgicos desde la raíz del proyecto.

### Fase 3: Comunicación asícrona y patrones de Resilencia (Saga).
En esta etapa, se implemento un sistema de mensajería par desacoplar los servicios y manejar transacciones distribuidas, permitiendo que el sistema sea más reactivo y escalable.
- **Infraestructura de mensajería (RabbitMQ):**: 
    * Integracón de RabbitMQ como Message Broker para la comunicación entre servicios.
    * Implementación de colas específicas (orders_queue, products_queue) para garantizar la entrega de mensajes.
- **Microservicios de órdenes (orders-service):**
    * Creación de un nuevo servicio especializado en el ciclo de vida de la compra.
    * Persistencia de independencia en PostgreSQL con estados de orden evolucionados (PENDING, PAID, COMPLETED, CANCELLED).
- **Patrón saga:** 
    * Flujo de éxito: Al crear una orden, se emite un evento order_created que el servicio de productos procesa para descontar stock y responder con order_confirmed.
    * Lógica de Compensación (Fallo): Implementación de respuestas ante falta de stock mediante el evento order_failed, permitiendo que el servicio de ordenes cancele automáticamente transacciones fallidas sin intervención humana.
- **Optimización del API Gateway:**
    * Configuración de ClientProxy pata transformar peticiones HTTP externas en comandos internos de microservicios mediante MessagePattern.
    * Implementación de rutas de consulta directa (view-orders) para centralizar la visibilidad del estado de las transacciones.

## Pasos de ejecución:
(1) Levantar DB: 

    docker-compose up -d

(2) Configurar entornos: Cada servicio dene tener su archivo .env

(3) Migraciones y generación de clientes: Scripsts 

    npm run prisma:prod:mig -- --name init
    npm run prisma:auth:mig -- --name init
    npm run prisma:orders:mig -- --name init

    npm run prisma:auth:gen
    npm run prisma:prod:gen
    npm run prisma:orders:gen

(4) Carga de datos (seeds): pruebo las db de forma independiente.

    npm run seed:auth  # Crea usuario Ciro
    npm run seed:prod  # Crea catálogo Apple

(5) Iniciar sistema:

    npm run dev

