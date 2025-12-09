# ToDo Application

## Project Structure

```
ToDo-App/
├── todo-backend/          # NestJS backend API
├── todo-frontend/         # Next.js frontend application
├── docker-compose.yml     # Docker Compose configuration
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** and **Docker Compose**

## Build and Run Instructions

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd ToDo-App
   ```

2. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the backend and frontend Docker images
   - Start PostgreSQL database
   - Start the backend API on port `3000`
   - Start the frontend on port `80`

4. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000

5. **Stop the services**:
   ```bash
   docker-compose down
   ```

6. **Stop and remove volumes** (to clear database data):
   ```bash
   docker-compose down -v
   ```
## API Endpoints

The backend provides the following REST API endpoints:

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PATCH /tasks/:id/complete` - Mark a task as complete
- `DELETE /tasks/:id` - Delete a task


