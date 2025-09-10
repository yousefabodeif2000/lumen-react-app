# Lumen-React Project with Node.js Caching Layer and RBAC

![Build](https://img.shields.io/github/actions/workflow/status/yousefabodeif2000/lumen-react-app)  
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen)  
![License](https://img.shields.io/badge/license-MIT-blue)

A full-stack web application built with **React** (frontend), **Lumen (PHP)** (backend), and **Node.js** as a caching/API layer. It features user authentication, post management, Redis caching, **RBAC (roles & permissions)**, **GraphQL API**, **WebSockets for live updates**, and unit testing.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Setup Lumen Backend](#setup-lumen-backend)  
  - [Setup Node.js Caching Layer](#setup-nodejs-caching-layer)  
  - [Setup React Frontend](#setup-react-frontend)  
- [RBAC Management](#rbac-management)  
- [GraphQL API](#graphql-api)  
- [WebSockets](#websockets)  
- [Running Tests](#running-tests)  
- [Docker Setup](#docker-setup)  
- [Notes](#notes)  
- [License](#license)  

---

## Features

- **User Authentication**: Login and registration with JWT tokens.  
- **Role-Based Access Control (RBAC)**: Users can have roles (admin, editor, user) with specific permissions. Middleware enforces access for protected routes.  
- **Post Management**: Create, view, update, and delete posts based on permissions.  
- **Optimistic UI Updates**: Newly created posts appear instantly without waiting for server response.  
- **Caching**: Posts are cached in **Redis** via Node.js for faster retrieval. Cache expires after 60 seconds.  
- **GraphQL API**: Query posts and users efficiently via GraphQL endpoints.  
- **WebSockets (Socket.io)**: Real-time updates for newly created posts.  
- **Unit Testing**: Backend tested with PHPUnit and Node.js tests.  
- **Docker Support**: Containerized setup for easy deployment.

---

## Tech Stack

| Layer     | Technology                     |
|-----------|--------------------------------|
| Frontend  | React, TypeScript, Axios       |
| Backend   | Lumen (PHP), Node.js           |
| Database  | PostgreSQL / MySQL             |
| Cache     | Redis                          |
| Real-time | WebSockets (Socket.io)         |
| API       | GraphQL                        |
| Testing   | PHPUnit, Jest                  |
| Deployment| Docker, Docker Compose         |

---

## Getting Started

### Prerequisites

- Node.js >= 18  
- PHP >= 8  
- Composer  
- Docker & Docker Compose (optional)  
- Redis server  
- PostgreSQL or MySQL  

---

### Setup Lumen Backend

1. Clone the repository:  
```bash
git clone <https://github.com/yousefabodeif2000/lumen-react-app>
cd backend-lumen
```

2. Install dependencies:
```bash
composer install
```

3. Configure `.env` file:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_db
DB_USERNAME=your_user
DB_PASSWORD=your_pass

CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

JWT_SECRET=your_secret_key
```

4. Run migrations & seeders:
```bash
php artisan migrate --seed
```

5. Start the backend server:
```bash
php -S localhost:8000 -t public
```

---

### Setup Node.js Caching Layer

1. Navigate to Node backend folder:
```bash
cd backend-node
```

2. Install dependencies:
```bash
npm install
```

3. Configure `.env` with API and Redis credentials.

4. Start the Node.js server:
```bash
npm run dev
```

---

### Setup React Frontend

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## RBAC Management

- Admin users can manage roles and permissions via **Admin API endpoints**.  
- **Assign role to user:** `POST /admin/users/{userId}/assign-role`  
- **Remove role from user:** `POST /admin/users/{userId}/remove-role`  
- **Assign permission to role:** `POST /admin/roles/{roleId}/assign-permission`  
- **Remove permission from role:** `POST /admin/roles/{roleId}/remove-permission`  

> Permissions control access to creating, editing, deleting posts, and accessing admin endpoints.

---

## GraphQL API

- Lumen backend exposes a GraphQL endpoint: `/graphql`  
- Example queries:
```graphql
query {
  posts {
    id
    title
    content
    user {
      name
    }
  }
}
```
- Supports filtering, pagination, and relational queries.

---

## WebSockets

- Node.js layer provides **Socket.io** for live updates.  
- When a new post is created, all connected clients receive a real-time event.  
- Frontend subscribes to `post_created` events to update the UI instantly.

---

## Running Tests

### PHPUnit (Lumen backend)
```bash
php artisan test
```

### Node.js tests
```bash
npm test
```

---

## Docker Setup

1. Build and start all services:
```bash
docker-compose up --build
```

### Access services:

- **Frontend**: [http://localhost:5173](http://localhost:5173)  
- **Lumen backend**: [http://localhost:9000](http://localhost:9000)  
- **Node backend**: [http://localhost:3000](http://localhost:3000)  

---

## Notes

- Redis caching reduces database queries and improves response time.  
- RBAC ensures fine-grained access control.  
- WebSockets provide live updates for post creation.  
- GraphQL allows flexible data querying from frontend.  

---

## License

This project is open-source under the MIT License.
