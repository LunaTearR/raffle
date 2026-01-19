# Raffle System - Complete Guide

## 🎨 Design Reference

Your raffle system has been built to match the provided design mockups:

1. **Registration Page** - Clean, centered form with 8-digit student ID input
2. **Waiting Page** - Live counter showing connected students with participant list
3. **Raffle/Draw Page** - Admin control panel with inventory sidebar and winner display
4. **History/Logs Page** - Table view of all past winners with timestamps

## 📁 Project Structure

```
raffle/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── modules/         # Route handlers
│   │   ├── services/        # Business logic
│   │   └── main.ts          # Entry point
│   ├── .env                 # MongoDB Atlas config
│   └── test-api.sh          # API testing script
│
└── raffle-frontend/
    ├── src/
    │   ├── pages/           # All 4 pages
    │   │   ├── RegisterPage.tsx
    │   │   ├── WaitingPage.tsx
    │   │   ├── RafflePage.tsx
    │   │   └── LogsPage.tsx
    │   ├── services/        # API integration
    │   │   └── api.ts
    │   ├── App.tsx          # Router setup
    │   ├── main.tsx         # Entry point
    │   └── index.css        # Styles
    ├── .env                 # API URL config
    └── package.json
```

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
bun run dev
```
✅ Backend running on http://localhost:3000

### 2. Start Frontend
```bash
cd raffle-frontend
bun run dev
```
✅ Frontend running on http://localhost:5173

## 🎯 Testing the System

### Test Backend APIs
```bash
cd backend
./test-api.sh
```

### Test Frontend Flow

#### Student Flow:
1. Open http://localhost:5173
2. Enter student ID (e.g., `12345678`)
3. Click REGISTER
4. See waiting page with live count

#### Admin Flow:
1. Open http://localhost:5173/raffle
2. Select an item from inventory
3. Set quantity (number of winners)
4. Click "DRAW WINNERS"
5. View winner result
6. Click "NEXT ROUND" or visit /logs

## 📊 Features Implemented

### ✅ Registration Page
- 8-digit student ID validation
- Auto-format input (numbers only)
- Error handling
- Clean, minimal design
- Redirects to waiting page on success

### ✅ Waiting Page
- Real-time student count (polls every 3 seconds)
- Live participant list
- Shows current user as "YOU"
- Masked student IDs for privacy
- Connection status indicators

### ✅ Raffle Page (Admin)
- Inventory sidebar with item quantities
- Winner selection interface
- Quantity input for multiple winners
- Winner result display with animations
- Share and next round buttons
- Statistics display

### ✅ Logs Page
- Table view of all winners
- Student ID and reward columns
- Timestamp for each entry
- Numbered entries
- Clean, readable layout

## 🎨 Design Highlights

- **Minimal Aesthetic**: Clean lines, ample whitespace
- **Typography**: System fonts with proper hierarchy
- **Animations**: Smooth fade-in and slide-in effects
- **Colors**: Black, white, gray palette with green accent
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper contrast and focus states

## 🔧 Configuration

### Backend (.env)
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/raffle_dev
ALLOWED_ORIGINS=*
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000
```

## 📝 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/regis` | POST | Register student |
| `/students` | GET | Get all students |
| `/raffle_items` | GET | Get available items |
| `/raffle?n=X` | GET | Draw X winners |
| `/logs` | GET | Get raffle history |

## 🎉 You're All Set!

Your raffle system is complete and ready to use. The design matches your mockups, all features are working, and it's connected to MongoDB Atlas.

**Enjoy your raffle! 🎊**
