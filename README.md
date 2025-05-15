# Travel Tales

This is the Node.js/Express backend for TravelTales. It provides:

- JWT-based authentication (register / login / profile / logout)
- Blog post CRUD with:
    - Image uploads (via `multipart/form-data`)
    - Search, filtering, sorting, pagination
    - Personal feed (posts by users you follow)
- Like/dislike voting
- Commenting
- Follow/unfollow social features
- SQLite persistence

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started](#getting-started)
3. [Docker](#docker)
4. [API Reference](#api-reference)

---

## Prerequisites

- Node.js 18+
- npm or yarn
- (optional) Docker & Docker Compose

---

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/w1867422-Advanced-Server-Side/w1867422-traveltales.git
   cd w1867422-traveltales

2. **Install dependencies**
    ```bash
    npm install
   
3. **Start the Application**
    ```bash
    npm start

## Docker
**A Dockerfile is included for containerization.**

1. **Build the image**

    ```bash
   docker build -t traveltales-backend .

## Api Reference
1. **Import openapi.yaml into a Swagger UI instance or view it via:**
    ```bash
   http://localhost:3000/api-docs