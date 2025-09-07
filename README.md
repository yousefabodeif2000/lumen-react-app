# Lumen-React Project with Node.js Caching Layer

![Build](https://img.shields.io/github/actions/workflow/status/yousefabodeif2000/lumen-react-app/ci.yml?branch=main) 
![Coverage](https://img.shields.io/badge/coverage-90%25-brightgreen) 
![Docker Pulls](https://img.shields.io/docker/pulls/yousefabodeif/lumen-react-app) 
![License](https://img.shields.io/badge/license-MIT-blue)

A full-stack web application built with **React** for the frontend, **Lumen (PHP)** for the main backend, and **Node.js** as a caching/API layer. The app supports user authentication, post creation, caching, and unit testing.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Setup Lumen Backend](#setup-lumen-backend)  
  - [Setup Node.js Caching Layer](#setup-nodejs-caching-layer)  
  - [Setup React Frontend](#setup-react-frontend)  
- [Running Tests](#running-tests)  
- [Docker Setup](#docker-setup)  
- [Notes](#notes)  
- [License](#license)  

---

## Features

- **User Authentication**: Login and registration with JWT tokens.  
- **Post Management**: Users can create, view, and manage posts.  
- **Optimistic UI Updates**: Newly created posts appear instantly without waiting for server response.  
- **Caching**: Posts are cached in **Redis** via Node.js for faster retrieval.  
- **Unit Testing**: Backend routes and authentication logic are tested with PHPUnit.  
- **Docker Support**: Containerized setup for easy deployment.  

---

## Tech Stack

| Layer     | Technology            |
|-----------|----------------------|
| Frontend  | React, TypeScript, Axios |
| Backend   | Lumen (PHP), Node.js  |
| Database  | PostgreSQL / MySQL    |
| Cache     | Redis                 |
| Testing   | PHPUnit               |
| Deployment| Docker, Docker Compose|

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
   git clone <repo_url>
   cd backend-lumen
2. Install dependencies:
```
composer install
```
3. Configure .env file:
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

4. Run migrations:
```bash
php artisan migrate
```
5. Start the server:
```bash
php -S localhost:8000 -t public
```

### Setup Node.js Caching Layer

1. Navigate to Node backend folder:
```
cd backend-node
```

2. Install dependencies:
```
npm install
```
3. Configure .env with API and Redis credentials.

4. Start server:
```
npm run dev
```

### Setup React Frontend

Navigate to frontend folder:
```
cd frontend
```

1. Install dependencies:
```
npm install
```

2. Start development server:
```
npm run dev
```

3.Open http://localhost:3000 in your browser.

## Running Tests

### PHPUnit (Lumen backend)
```
php artisan test
```

### Node.js tests
```
npm test
```
## Docker Setup

1. Build and start all services:
```
docker-compose up --build
```

### Access services:

**Frontend**: ``` http://localhost:5173 ```

**Lumen backend**: ```http://localhost:9000```

**Node backend**: ```http://localhost:3000```

## Notes

Redis caching is used for the posts endpoint to reduce database queries. Cache expires in **60 seconds**.

After creating a post, the frontend automatically fetches updated posts for real-time display.

JWT authentication is required for protected routes.


## License

This project is open-source and available under the MIT License.
