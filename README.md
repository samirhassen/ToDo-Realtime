# TODO List with Real-Time Sync

A complete monorepo project featuring a simple TODO list application with real-time synchronization capabilities. Built with modern technologies and clean architecture principles.

## 🏗️ Architecture

- **Backend**: ASP.NET Core 8 with Hot Chocolate GraphQL, Entity Framework Core, SQLite/SQL Server
- **Frontend**: React + TypeScript + Vite with Adobe React Spectrum UI components
- **GraphQL Client**: Relay with GraphQL-WS for real-time subscriptions
- **Deployment**: Docker + Docker Compose with Nginx reverse proxy

## 📁 Project Structure

```
todo-list-realtime/
├── server/
│   └── Todo.Api/                 # ASP.NET Core 8 GraphQL API
│       ├── Models/               # Entity models
│       ├── Data/                 # Entity Framework DbContext
│       ├── GraphQL/              # GraphQL types, queries, mutations, subscriptions
│       ├── Dockerfile            # Docker configuration for API
│       └── ...
├── web/
│   └── client/                   # React + TypeScript frontend
│       ├── src/
│       │   ├── components/       # React components (AddTask, TaskList)
│       │   ├── relay/            # Relay GraphQL environment
│       │   └── __generated__/    # Generated Relay artifacts
│       ├── schema.graphql        # GraphQL schema for Relay
│       ├── Dockerfile           # Docker configuration for frontend
│       └── ...
├── docker/
│   ├── compose.yaml             # Docker Compose configuration
│   └── nginx.conf               # Nginx configuration with WebSocket support
├── Makefile                     # Development shortcuts
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/) (optional, for shortcuts)

### Option 1: Development Mode (Recommended)

1. **Clone and setup**:
   ```bash
   git clone <repository-url>
   cd todo-list-realtime
   make setup
   ```

2. **Start development servers**:
   ```bash
   make dev
   ```

   This will start:
   - API server at `http://localhost:5000`
   - React frontend at `http://localhost:5173`
   - GraphQL Playground at `http://localhost:5000/graphql`

3. **Alternative: Start services individually**:
   ```bash
   # Terminal 1 - API
   make api
   
   # Terminal 2 - Frontend
   make web
   ```

### Option 2: Docker Compose (Production-like)

```bash
make compose
```

This will start all services using Docker:
- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
- SQL Server: `localhost:1433`

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `make setup` | Install all dependencies |
| `make dev` | Run both API and frontend in parallel |
| `make api` | Run ASP.NET Core API only |
| `make web` | Run React frontend only |
| `make compose` | Run with Docker Compose |
| `make build` | Build Docker containers |
| `make clean` | Clean up Docker resources |
| `make relay` | Generate Relay GraphQL artifacts |
| `make logs` | Show Docker Compose logs |
| `make stop` | Stop Docker services |

## 📊 Features

### Backend (ASP.NET Core 8 + Hot Chocolate GraphQL)

- **GraphQL Schema**:
  ```graphql
  type TaskType {
    id: Int!
    title: String!
    description: String!
    status: TaskStatus!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  
  enum TaskStatus {
    PENDING
    COMPLETED
  }
  ```

- **Queries**:
  - `getAllTasks`: Retrieve all tasks

- **Mutations**:
  - `createTask(input: CreateTaskInput!)`: Create a new task
  - `updateTaskStatus(input: UpdateTaskStatusInput!)`: Update task status

- **Subscriptions**:
  - `onTaskChanged`: Real-time updates when tasks change

### Frontend (React + TypeScript + Relay)

- **Components**:
  - `AddTask`: Form to create new tasks
  - `TaskList`: Display and manage tasks with real-time updates

- **Features**:
  - Real-time synchronization across multiple browser tabs
  - Clean, modern UI with Adobe React Spectrum
  - Type-safe GraphQL operations with Relay
  - Responsive design

## 🔧 Technical Details

### Database

- **Development**: SQLite (`todo.db`)
- **Production**: SQL Server (via Docker)

### Real-time Communication

- **WebSockets**: GraphQL subscriptions over WebSocket (GraphQL-WS protocol)
- **Auto-reconnection**: Client automatically reconnects on connection loss

### GraphQL Client (Relay)

- **Automatic code generation**: Type-safe operations from GraphQL schema
- **Optimistic updates**: Immediate UI updates with server reconciliation
- **Caching**: Intelligent data caching and normalization

### Docker Configuration

- **Multi-stage builds**: Optimized container sizes
- **Health checks**: Service dependency management
- **Nginx reverse proxy**: WebSocket support for GraphQL subscriptions
- **Persistent storage**: SQL Server data persistence

## 🧑‍💻 AI Development Notes

This project is designed to be AI-friendly for development and maintenance:

### Code Organization
- Clear separation of concerns
- Consistent naming conventions
- Well-documented GraphQL schema
- Type-safe throughout (C# + TypeScript)

### Development Workflow
```bash
# 1. Start development environment
make setup && make dev

# 2. Make changes to GraphQL schema
# Edit: server/Todo.Api/GraphQL/ files
# Edit: web/client/schema.graphql

# 3. Regenerate Relay artifacts
make relay

# 4. Test changes
# API: http://localhost:5000/graphql
# Frontend: http://localhost:5173

# 5. Build and deploy
make build-prod
make compose
```

### Common Development Tasks

1. **Add new GraphQL field**:
   - Update C# types in `server/Todo.Api/GraphQL/`
   - Update `web/client/schema.graphql`
   - Run `make relay`
   - Update React components

2. **Add new component**:
   - Create in `web/client/src/components/`
   - Use Adobe React Spectrum components
   - Follow Relay patterns for GraphQL operations

3. **Database changes**:
   - Update Entity models in `server/Todo.Api/Models/`
   - Update DbContext in `server/Todo.Api/Data/`
   - Database will auto-migrate in development

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check what's running on ports
   lsof -i :5000  # API
   lsof -i :5173  # Frontend
   lsof -i :3000  # Docker frontend
   ```

2. **Relay compilation errors**:
   ```bash
   # Regenerate Relay artifacts
   cd web/client
   npm run relay
   ```

3. **Database issues**:
   ```bash
   # Reset development database
   cd server/Todo.Api
   rm todo.db
   dotnet run  # Will recreate database
   ```

4. **Docker issues**:
   ```bash
   # Clean up and rebuild
   make clean
   make build
   make compose
   ```

### Development vs Docker

| Aspect | Development Mode | Docker Mode |
|--------|------------------|-------------|
| **Database** | SQLite (file-based) | SQL Server (container) |
| **Hot Reload** | ✅ Full hot reload | ❌ Requires rebuild |
| **Debugging** | ✅ Native debugger | ⚠️ Container debugging |
| **Performance** | ⚡ Native speed | 🐌 Container overhead |
| **Environment** | ✅ Local tools | 🐳 Containerized |

**Recommendation**: Use development mode for active development, Docker for testing deployment scenarios.

## 📝 License

This project is provided as-is for educational and development purposes.

## 🤝 Contributing

This is a template project. Feel free to fork and customize for your needs.

---

**Happy Coding!** 🎉

For questions or issues, check the troubleshooting section above or review the individual component documentation in their respective directories.
