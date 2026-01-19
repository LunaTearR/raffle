# Raffle Frontend

A minimal, elegant raffle system frontend built with React, TypeScript, and Tailwind CSS.

## Features

- **Registration Page**: Students can register with their 8-digit student ID
- **Waiting Page**: Real-time display of connected students waiting for the raffle
- **Raffle Page (Admin)**: Admin control panel to draw winners and manage inventory
- **Logs Page**: History of all raffle winners with timestamps

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## Setup

### 1. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 2. Configure Environment

The `.env` file is already configured to connect to `http://localhost:3000`.

If your backend runs on a different port, update `.env`:
```
VITE_API_URL=http://localhost:YOUR_PORT
```

### 3. Run Development Server

Using Bun:
```bash
bun run dev
```

Or using npm:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Pages

### Student Flow
1. **/** - Registration page where students enter their 8-digit ID
2. **/waiting** - Waiting room showing connected students count

### Admin Flow
1. **/raffle** - Admin dashboard to draw winners
2. **/logs** - View complete raffle history

## API Endpoints Used

- `POST /regis` - Register a student
- `GET /students` - Get all registered students
- `GET /raffle_items` - Get available raffle items
- `GET /raffle?n=X` - Perform raffle and select X winners
- `GET /logs` - Get raffle history

## Design

The design follows a minimal, elegant aesthetic inspired by modern web applications:
- Clean typography with proper hierarchy
- Subtle animations and transitions
- Responsive layout
- Accessible color contrast
- Professional spacing and alignment

## Build for Production

```bash
bun run build
```

The production build will be in the `dist` folder.

## Preview Production Build

```bash
bun run preview
```
