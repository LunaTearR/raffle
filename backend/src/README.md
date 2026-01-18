# Backend Source Code Structure

This directory contains the backend source code organized for clarity and maintainability.

## Directory Structure

```
src/
├── models/              # Database Models (Mongoose Schemas)
│   ├── user.model.ts
│   ├── raffle-item.model.ts
│   └── raffle-log.model.ts
│
├── services/            # Business Logic Layer
│   ├── user.service.ts
│   ├── raffle-item.service.ts
│   └── registration.service.ts
│
├── modules/             # API Routes (Controllers)
│   ├── users/
│   │   ├── user.routes.ts
│   │   └── user.validation.ts
│   ├── raffle-items/
│   │   ├── raffle-item.routes.ts
│   │   └── raffle-item.validation.ts
│   ├── registration/
│   │   ├── registration.routes.ts
│   │   └── registration.validation.ts
│   ├── raffle/
│   │   └── raffle.routes.ts
│   └── logs/
│       └── logs.routes.ts
│
├── utils/               # Utility Functions
│   └── validation.ts
│
├── plugins/             # Elysia Plugins
│   └── open-api.ts
│
├── env.ts              # Environment Configuration
└── main.ts             # Application Entry Point
```

## Layer Responsibilities

### 1. Models (`models/`)
- **Purpose**: Define database schemas using Mongoose
- **Contains**: Schema definitions and type exports
- **Naming**: `*.model.ts`
- **Example**: `user.model.ts` contains the User schema and TUser type

### 2. Services (`services/`)
- **Purpose**: Business logic and data manipulation
- **Contains**: Service classes with static methods
- **Naming**: `*.service.ts`
- **Example**: `user.service.ts` handles user creation, retrieval, etc.
- **Note**: Services interact with models and contain no HTTP-specific code

### 3. Modules (`modules/`)
- **Purpose**: HTTP route handlers (controllers)
- **Contains**: 
  - Route definitions (`*.routes.ts`)
  - Request validation schemas (`*.validation.ts`)
- **Example**: `users/user.routes.ts` defines `/students` endpoints
- **Note**: Routes call services and handle HTTP request/response

### 4. Utils (`utils/`)
- **Purpose**: Reusable utility functions
- **Contains**: Helper functions, validators, formatters
- **Example**: `validation.ts` contains student ID validation

## Data Flow

```
HTTP Request
    ↓
Route Handler (modules/*.routes.ts)
    ↓
Service Layer (services/*.service.ts)
    ↓
Model Layer (models/*.model.ts)
    ↓
Database (MongoDB)
```

## Naming Conventions

- **Files**: Use kebab-case (e.g., `raffle-item.service.ts`)
- **Classes**: Use PascalCase (e.g., `UserService`)
- **Functions**: Use camelCase (e.g., `getAllUsers`)
- **Types**: Prefix with `T` (e.g., `TUser`, `TRaffleItem`)

## Import Paths

Use the `@/` alias for imports:

```typescript
import { User } from "@/models/user.model";
import { UserService } from "@/services/user.service";
import { validateStudentId } from "@/utils/validation";
```

## Adding New Features

1. **Create Model** (if needed): Define schema in `models/`
2. **Create Service**: Add business logic in `services/`
3. **Create Routes**: Add HTTP handlers in `modules/`
4. **Add Validation**: Define request schemas in module's validation file
5. **Register Routes**: Import and use in `main.ts`

## Example: Adding a New Feature

To add a "comments" feature:

1. Create `models/comment.model.ts`
2. Create `services/comment.service.ts`
3. Create `modules/comments/comment.routes.ts`
4. Create `modules/comments/comment.validation.ts`
5. Import in `main.ts`: `import { comments } from "@/modules/comments/comment.routes"`
