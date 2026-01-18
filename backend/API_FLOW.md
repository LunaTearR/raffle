# API Flow Summary

## Quick Reference Table

| Endpoint | Method | Purpose | DB Collections Used | Key Logic |
|----------|--------|---------|-------------------|-----------|
| `/regis` | POST | Register student | `users` | Validate ID → Check duplicate → Save |
| `/students` | GET | List all students | `users` | Query all |
| `/students` | POST | Create student (admin) | `users` | Validate → Check duplicate → Save |
| `/raffle_items` | POST | Add prize | `raffle_items` | Save item with quantity |
| `/raffle_items` | GET | List all prizes | `raffle_items` | Query all |
| `/raffle?n=1` | GET | Pick winners | `users`, `raffle_items`, `raffle_logs` | Random select → Update status → Log |
| `/logs` | GET | View winner history | `raffle_logs` | Query logs with item details |

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        RAFFLE SERVICE                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  POST /regis │  ──────────────────────────────┐
└──────────────┘                                 │
     Body: { std_id }                            │
     ↓                                           ↓
     Validate ID (8 digits)              ┌──────────────┐
     Check if exists                     │    users     │
     Save student                        │  Collection  │
                                         └──────────────┘
┌──────────────────┐                            ↑
│ GET /students    │  ──────────────────────────┤
└──────────────────┘                            │
     Returns all students                       │
                                                │
┌──────────────────┐                            │
│ POST /students   │  ──────────────────────────┘
└──────────────────┘
     Body: { studentId, name }
     Create student with name


┌──────────────────────┐
│ POST /raffle_items   │  ────────────────────┐
└──────────────────────┘                      │
     Body: { name, quantity, itemPic }        │
     ↓                                        ↓
     Save item                         ┌──────────────┐
                                       │raffle_items  │
┌──────────────────────┐               │  Collection  │
│ GET /raffle_items    │  ────────────▶└──────────────┘
└──────────────────────┘                      ↑
     Returns all items                        │
                                              │
                                              │
┌──────────────────┐                          │
│ GET /raffle?n=1  │  ────────────────────────┴────────┐
└──────────────────┘                                   │
     Query param: n (number of winners)                │
     ↓                                                  │
     1. Get students (receivedAward: false)  ──────────┤
     2. Get items (quantity > 0)  ──────────────────────┘
     3. Random select n students
     4. Random assign items
     5. Update student.receivedAward = true
     6. Decrease item.quantity
     7. Create log entry  ──────────────────────┐
                                                │
                                                ↓
┌──────────────┐                        ┌──────────────┐
│  GET /logs   │  ─────────────────────▶│ raffle_logs  │
└──────────────┘                        │  Collection  │
     Returns winner history             └──────────────┘
     (with item details populated)
```

## Module Organization

```
modules/
├── regis/          → Handles POST /regis
│   ├── index.ts    → Route handler
│   ├── service.ts  → Business logic (validation, registration)
│   └── model.ts    → Request validation schema
│
├── users/          → Handles /students endpoints
│   ├── index.ts    → Route handlers (GET, POST)
│   ├── service.ts  → User CRUD operations
│   └── model.ts    → Request validation schema
│
├── rewards/        → Handles /raffle_items + raffle logic
│   ├── index.ts    → Route handlers (GET, POST /raffle_items)
│   ├── service.ts  → Item CRUD + performRaffle() logic
│   └── model.ts    → Request validation schema
│
├── raffle/         → Handles GET /raffle
│   └── index.ts    → Route handler (calls rewards/service)
│
└── logs/           → Handles GET /logs
    └── index.ts    → Route handler (calls rewards/service)
```

## Database Collections

```
MongoDB Database: raffle
│
├── users
│   └── { studentId, name, receivedAward, createdAt, updatedAt }
│
├── raffle_items
│   └── { _id, name, quantity, itemPic, createdAt, updatedAt }
│
└── raffle_logs
    └── { studentId, itemId (ref), timestamp }
```
