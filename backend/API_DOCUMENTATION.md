# Raffle Service API Documentation

## Overview
This is the backend service for the raffle system, built with **Bun**, **ElysiaJS**, and **MongoDB**.

## File Structure

```
backend/
├── src/
│   ├── models/              # Database schemas (Mongoose)
│   │   ├── user.ts          # User/Student model
│   │   ├── raffle-item.ts   # Raffle item/prize model
│   │   └── raffle-log.ts    # Winner history model
│   ├── modules/             # API modules
│   │   ├── regis/           # Student registration
│   │   │   ├── index.ts     # POST /regis endpoint
│   │   │   ├── service.ts   # Registration logic
│   │   │   └── model.ts     # Validation schemas
│   │   ├── users/           # Student management
│   │   │   ├── index.ts     # GET/POST /students endpoints
│   │   │   ├── service.ts   # User CRUD operations
│   │   │   └── model.ts     # Validation schemas
│   │   ├── rewards/         # Raffle items management
│   │   │   ├── index.ts     # GET/POST /raffle_items endpoints
│   │   │   ├── service.ts   # Item CRUD + raffle logic
│   │   │   └── model.ts     # Validation schemas
│   │   ├── raffle/          # Raffle execution
│   │   │   └── index.ts     # GET /raffle endpoint
│   │   └── logs/            # Winner history
│   │       └── index.ts     # GET /logs endpoint
│   ├── types/               # TypeScript types
│   ├── plugins/             # Elysia plugins (OpenAPI, etc.)
│   ├── env.ts               # Environment configuration
│   └── main.ts              # Application entry point
```

## Database Schema

### 1. `users` Collection
Stores student information.

```typescript
{
  studentId: string;      // Unique student ID (8 digits)
  name: string;           // Student name
  receivedAward: boolean; // Whether student has won
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. `raffle_items` Collection
Stores available prizes.

```typescript
{
  _id: ObjectId;
  name: string;           // Item name (e.g., "iPhone 15")
  quantity: number;       // Available quantity
  itemPic: string;        // Image URL/path (optional)
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. `raffle_logs` Collection
Stores winner history.

```typescript
{
  studentId: string;      // Reference to student
  itemId: ObjectId;       // Reference to raffle item
  timestamp: Date;        // When they won
}
```

## API Endpoints

### 1. **POST /regis** - Register Student
Register a new student with ID validation.

**Request:**
```json
{
  "std_id": "12345678"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Student registered successfully.",
  "data": {
    "studentId": "12345678",
    "name": "Student 12345678"
  }
}
```

**Database Connection:** `users`

**Logic:**
1. Validates student ID format (8 digits)
2. Checks if student already exists
3. Creates new student record

---

### 2. **GET /students** - Get All Students
Retrieve all registered students.

**Response (200):**
```json
{
  "success": true,
  "message": "Get all users successfully.",
  "data": [
    {
      "studentId": "12345678",
      "name": "Student 12345678",
      "receivedAward": false
    }
  ]
}
```

**Database Connection:** `users`

---

### 3. **POST /students** - Create Student (Admin)
Manually create a student with name.

**Request:**
```json
{
  "studentId": "12345678",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully.",
  "data": {
    "studentId": "12345678",
    "name": "John Doe"
  }
}
```

**Database Connection:** `users`

---

### 4. **POST /raffle_items** - Add Raffle Item
Add a new prize to the system.

**Request:**
```json
{
  "name": "iPhone 15",
  "quantity": 5,
  "itemPic": "https://example.com/iphone.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Raffle item created successfully.",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "iPhone 15",
    "quantity": 5,
    "itemPic": "https://example.com/iphone.jpg"
  }
}
```

**Database Connection:** `raffle_items`

---

### 5. **GET /raffle_items** - Get All Items
Retrieve all available prizes.

**Response (200):**
```json
{
  "success": true,
  "message": "Get all raffle items successfully.",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "iPhone 15",
      "quantity": 5,
      "itemPic": "https://example.com/iphone.jpg"
    }
  ]
}
```

**Database Connection:** `raffle_items`

---

### 6. **GET /raffle?n=1** - Perform Raffle
Randomly select `n` winners from available students.

**Query Parameters:**
- `n` (optional): Number of winners to select (default: 1)

**Response (200):**
```json
{
  "success": true,
  "message": "Raffle completed successfully. 1 winner(s) selected.",
  "data": [
    {
      "studentId": "12345678",
      "name": "Student 12345678",
      "item": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "iPhone 15",
        "itemPic": "https://example.com/iphone.jpg"
      }
    }
  ]
}
```

**Database Connection:** `users`, `raffle_items`, `raffle_logs`

**Logic:**
1. Queries students who haven't won (`receivedAward: false`)
2. Queries items with available quantity (`quantity > 0`)
3. Randomly selects `n` students
4. Randomly assigns items to winners
5. Updates student's `receivedAward` to `true`
6. Decreases item quantity
7. Creates log entry in `raffle_logs`

---

### 7. **GET /logs** - Get Raffle Logs
Retrieve all winner history.

**Response (200):**
```json
{
  "success": true,
  "message": "Get all raffle logs successfully.",
  "data": [
    {
      "studentId": "12345678",
      "item": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "iPhone 15",
        "itemPic": "https://example.com/iphone.jpg"
      },
      "timestamp": "2024-01-18T07:20:00.000Z"
    }
  ]
}
```

**Database Connection:** `raffle_logs` (with population of `itemId`)

---

## Tech Stack
- **Runtime:** Bun
- **Framework:** ElysiaJS
- **Database:** MongoDB (Mongoose ODM)
- **Validation:** TypeBox (via Elysia)
- **API Documentation:** OpenAPI/Swagger

## Running the Server

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# The server will start at http://0.0.0.0:3000
```

## API Documentation
Once the server is running, visit:
- **Swagger UI:** `http://localhost:3000/swagger`

## Environment Variables
Create a `.env` file:

```env
DATABASE_URL=mongodb://localhost:27017/raffle
PORT=3000
```
