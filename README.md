# The Application

This is an adapted online version to the social deduction game - Secret Hitler. It is similar to some other social deduction games such as Mafia. Since this is a social deduction game, it should only be played with people you can physically see and communicate with, and not with other people online. The point of this application is to provide a virtual game board if you don't possess a physical one. The application can also be used in combination with a physical board, as a fast and safe role distributor.

---

# Tech Stacks

A real-time multiplayer web application built with Next.js, Socket.IO, and Zustand, deployed via AWS ECS Fargate, focusing on scalability, reliability, and clean deployment workflows.

---

## Overview

This project is a full-stack, production-oriented application designed to demonstrate real-time communication, containerized deployment, and cloud-native infrastructure. It supports multiple concurrent users, live state synchronization, and zero-downtime deployments. It is built with Next.js

The repository serves as a **portfolio representation** of the system’s current state.

---

## Live Demo

🔗 https://your-production-url.com  
🎥 (Optional) Demo video

---

## Architecture Overview

Client (Next.js)
│
│ WebSocket (Socket.IO)
▼
Realtime Server (Node.js)
│
│ Internal Events / APIs
▼
Application Services
│
▼
AWS ECS Fargate
│
├─ Nginx (reverse proxy)
├─ Next.js (frontend container)
└─ Socket server (realtime container)

---


The system is fully containerized and deployed using AWS ECS Fargate, removing the need for server-level management.

---

## CI/CD Pipeline

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yaml`) that automates the full deployment lifecycle:

1. Builds Docker images for all services
2. Tags images using the Git commit SHA
3. Pushes images to Amazon ECR
4. Registers a new ECS task definition revision
5. Forces an ECS service deployment with zero downtime

The workflow is triggered on pushes to the `master` branch.

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Zustand
- Tailwind CSS

### Backend / Realtime
- Node.js
- Socket.IO
- TypeScript

### Infrastructure
- AWS ECS Fargate
- Amazon ECR
- Application Load Balancer
- Nginx

### CI/CD & Tooling
- GitHub Actions
- Docker
- AWS CLI

---

## Key Technical Decisions

### Container-Based Architecture
All application components are deployed as containers, enabling consistent environments across development and production.

### ECS Fargate
Fargate was chosen to eliminate EC2 management and allow deployments to scale based on task definitions rather than instance provisioning.

### Immutable Deployments
Each deployment references Docker images tagged with the Git commit SHA, ensuring traceability and reproducibility.

### Task Definition Revisioning
Deployments update only container image references while preserving task configuration, reducing the risk of configuration drift.

### Real-Time State Handling
Socket lifecycle events are explicitly handled to manage disconnects, reconnects, and session cleanup without corrupting application state.

---

## Core Features

- Real-time multiplayer communication
- Session-based state synchronization
- Containerized frontend and backend services
- Automated CI/CD pipeline
- Zero-downtime deployments

---

## Security & Reliability

- All secrets are stored in GitHub Actions Secrets
- No credentials committed to source control
- CI/CD restricted to protected branches
- ECS deployments use immutable image references

---

## Future Improvements

- Horizontal autoscaling based on WebSocket load
- Observability via CloudWatch metrics and dashboards
- Distributed tracing for realtime events
- Rate limiting and abuse protection
- Improved fault tolerance for partial network failures

---

## Author

**Liad Lahm**  
Full Stack Developer  

- GitHub: https://github.com/your-username  
- LinkedIn: https://linkedin.com/in/your-profile

# The Application

This is an adapted online version to the social deduction game - Secret Hitler. It is similar to some other social deduction games such as Mafia. Since this is a social deduction game, it should only be played with people you can physically see and communicate with, and not with other people online. The point of this application is to provide a virtual game board if you don't possess a physical one. The application can also be used in combination with a physical board, as a fast and safe role distributor.

---

# Tech Stacks

A real-time multiplayer web application built with Next.js, Socket.IO, and Zustand, deployed via AWS ECS Fargate, focusing on scalability, reliability, and clean deployment workflows.

---

## Overview

This project is a full-stack, production-oriented application designed to demonstrate real-time communication, containerized deployment, and cloud-native infrastructure. It supports multiple concurrent users, live state synchronization, and zero-downtime deployments. It is built with Next.js

The repository serves as a **portfolio representation** of the system’s current state.

---

## Live Demo

🔗 https://your-production-url.com  
🎥 (Optional) Demo video

---

## Architecture Overview

Client (Next.js)
│
│ WebSocket (Socket.IO)
▼
Realtime Server (Node.js)
│
│ Internal Events / APIs
▼
Application Services
│
▼
AWS ECS Fargate
│
├─ Nginx (reverse proxy)
├─ Next.js (frontend container)
└─ Socket server (realtime container)

---


The system is fully containerized and deployed using AWS ECS Fargate, removing the need for server-level management.

---

## CI/CD Pipeline

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yaml`) that automates the full deployment lifecycle:

1. Builds Docker images for all services
2. Tags images using the Git commit SHA
3. Pushes images to Amazon ECR
4. Registers a new ECS task definition revision
5. Forces an ECS service deployment with zero downtime

The workflow is triggered on pushes to the `master` branch.

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Zustand
- Tailwind CSS

### Backend / Realtime
- Node.js
- Socket.IO
- TypeScript

### Infrastructure
- AWS ECS Fargate
- Amazon ECR
- Application Load Balancer
- Nginx

### CI/CD & Tooling
- GitHub Actions
- Docker
- AWS CLI

---

## Key Technical Decisions

### Container-Based Architecture
All application components are deployed as containers, enabling consistent environments across development and production.

### ECS Fargate
Fargate was chosen to eliminate EC2 management and allow deployments to scale based on task definitions rather than instance provisioning.

### Immutable Deployments
Each deployment references Docker images tagged with the Git commit SHA, ensuring traceability and reproducibility.

### Task Definition Revisioning
Deployments update only container image references while preserving task configuration, reducing the risk of configuration drift.

### Real-Time State Handling
Socket lifecycle events are explicitly handled to manage disconnects, reconnects, and session cleanup without corrupting application state.

---

## Core Features

- Real-time multiplayer communication
- Session-based state synchronization
- Containerized frontend and backend services
- Automated CI/CD pipeline
- Zero-downtime deployments

---

## Security & Reliability

- All secrets are stored in GitHub Actions Secrets
- No credentials committed to source control
- CI/CD restricted to protected branches
- ECS deployments use immutable image references

---

## Future Improvements

- Horizontal autoscaling based on WebSocket load
- Observability via CloudWatch metrics and dashboards
- Distributed tracing for realtime events
- Rate limiting and abuse protection
- Improved fault tolerance for partial network failures

---

## Author

**Liad Lahm**  
Full Stack Developer  

- GitHub: https://github.com/your-username  
- LinkedIn: https://linkedin.com/in/your-profile

