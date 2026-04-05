##Fase 1: Core de productos e infraestructura.
En esta etapa inicial, establecimos lo cimientos del sistema utilizando un enfoque monolito modular, preparando el terreno para la futura migración a microservicios.

Hasta ahora:
- **Contenerización:** Orquestación de base de datos PostgreSQL mediante Docker para asegurar entornos de desarrollo idénticos.
- **Modelado de datos (Prisma 6):** Implementación de esquemas robustos para User y Product utilizando UUIDs para garantizar la escalabilidad y evitar colisiones de IDs en sistemas distribuidos.
- **Arquitectura modular:** Creación de módulos independientes en NestJS (Product, Prism), siguiendo el principio de responsabilidad única.
- **Integridad de Datos:** Uso de class-validator y class-transformer para sanitizar y validar las entrada de la API.
- **Estandarización de respuestas:** Implementación de un ResponseInterceptor global para aseguarar que el frontend reciba estructuras JSON consistentes.
- **Seed System:** Automatización de la carga de datos de prueba agilizar el desarrollo.

##Pasos de ejecución:
(1) Levantar DB: docker-compose up -d
(2) Generar Cliente: npx prisma@6.19.2 generate
(3) Migrar y Seed: npx prisma migrate dev && npx prisma db seed
