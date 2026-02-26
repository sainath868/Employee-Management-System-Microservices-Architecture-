# Employee Management System - Microservices Architecture

Projects:
- `eureka-server` (8761)
- `api-gateway` (8080)
- `auth-service` (8082)
- `employee-service` (8081)
- `frontend` (static HTML/CSS/JS)

## Default credentials flow
1. Register user: `POST /auth/register`
2. Login: `POST /auth/login`
3. Use `Bearer <token>` via API Gateway.

## Employee APIs
- `POST /employees`
- `GET /employees`
- `DELETE /employees/{id}`
- `POST /employees/{id}/photo` (multipart)
- `GET /files/{fileName}`
