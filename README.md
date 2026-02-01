# The Application

This is an adapted online version to the social deduction game - Secret Hitler. It is similar to some other social deduction games such as Mafia. Since this is a social deduction game, it should only be played with people you can physically see and communicate with, and not with other people online. The point of this application is to provide a virtual game board if you don't possess a physical one. The application can also be used in combination with a physical board, as a fast and safe role distributor.

🔗 https://www.secret-h-sdg.com

---

## Overview

This project is a full-stack, production-oriented application designed to demonstrate real-time communication, containerized deployment, and cloud-native infrastructure. It supports multiple concurrent users, live state synchronization, and zero-downtime deployments. It is built with Next.js

The repository serves as a **portfolio representation**.

---

## How to Play (Youtube Visualizer)

🔗 https://www.youtube.com/watch?v=APiugylcAJw

---

## Live Demo

[![Demo Video](./assets/live-demo.png)](https://github.com/user-attachments/assets/e5ed9aa9-9364-4638-9703-deb9b63addd1)

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
- Framer Motion
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

## Future Improvements (in that order)

- Additional refactoring of code, as well as better documentation for better readability
- AI bot players, which default to one of several custom behavioral algorithms once AI token quota is reached
- Using Kubernetes and AWS EKS for better scalability

---

## Author

**Liad Lahm**  
Full Stack Developer

- GitHub: https://github.com/comfortzone89
- LinkedIn: https://www.linkedin.com/in/liad-lahm-318947315/
