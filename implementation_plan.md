# Raffle Service Implementation Plan

Based on the provided flow diagram, here is the plan for the Raffle Service.

## 1. Database Schema (Mongoose)

We will use three main collections to manage the raffle system.

### A. `users` (Student Collection)
Stores information about the students participating in the raffle.
- `studentId`: **String** (Unique, e.g., "12345678")
- `name`: **String** (Optional, based on diagram focus)
- `receivedAward`: **Boolean** (Default: `false`)
- `createdAt`: **Date**

### B. `raffle_items` (Prize Collection)
Stores the items available to be won.
- `name`: **String** (e.g., "iPhone 15")
- `quantity`: **Number** (How many items are available)
- `itemPic`: **String** (Image URL or Path)

### C. `raffle_logs` (Winner Collection)
Stores the history of who won what.
- `studentId`: **String** (Reference to User)
- `itemId`: **String** (Reference to Raffle Item)
- `timestamp`: **Date**

---

## 2. API Endpoints

### 1. Register Student
- **Endpoint**: `POST /regis`
- **Body**: `{ std_id: string }`
- **How it works**:
    1. Receives `std_id`.
    2. **Validation**: Check if `std_id` matches the required format (validate front + back digits).
    3. **Check Existence**: Check if student already registered in `users` DB.
    4. **Action**: Save student to `users` DB.
- **Connection**: `users` DB.

### 2. Get All Students
- **Endpoint**: `GET /students`
- **How it works**:
    1. Queries all students from the `users` DB.
- **Connection**: `users` DB.

### 3. Add Raffle Item
- **Endpoint**: `POST /raffle_items`
- **Body**: `{ name: string, quantity: number, itemPic: string }`
- **How it works**:
    1. Receives item details.
    2. **Action**: Inserts a new record into `raffle_items` DB.
- **Connection**: `raffle_items` DB.

### 4. Get Raffle Items
- **Endpoint**: `GET /raffle_items`
- **How it works**:
    1. Queries all available items from `raffle_items` DB.
- **Connection**: `raffle_items` DB.

### 5. Perform Raffle
- **Endpoint**: `GET /raffle?n=1`
- **How it works**:
    1. Receives `n` (number of winners).
    2. **Random Selection**:
        - Randomly query `n` students from `users` who have NOT won yet (`receivedAward: false`).
        - Randomly query `n` items from `raffle_items` (or 1 item if picking for a specific prize).
    3. **Action**:
        - Mark selected students as `receivedAward: true`.
        - Record the result (student ID + item ID) in `raffle_logs` DB.
    4. **Return**: The result of the raffle.
- **Connection**: `users`, `raffle_items`, `raffle_logs` DB.

### 6. Get Raffle Logs
- **Endpoint**: `GET /logs`
- **How it works**:
    1. Queries all records from `raffle_logs` DB.
- **Connection**: `raffle_logs` DB.

---

## 3. Tech Stack
- **Runtime**: Bun
- **Framework**: ElysiaJS
- **Database**: MongoDB (Mongoose)
- **Validation**: TypeBox (integrated with Elysia)
