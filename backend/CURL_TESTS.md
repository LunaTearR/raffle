# 🧪 API Testing with cURL

## Base URL
```bash
BASE_URL="http://localhost:3000"
```

---

## 1️⃣ **Registration API**

### Register a Student (Self-Registration)
```bash
# Register student with ID
curl -X POST http://localhost:3000/regis \
  -H "Content-Type: application/json" \
  -d '{"std_id": "12345678"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student registered successfully.",
  "data": {
    "_id": "...",
    "studentId": "12345678",
    "name": "Student_12345678",
    "receivedAward": false
  },
  "statusCode": 201
}
```

---

## 2️⃣ **Students API**

### Get All Students
```bash
curl -X GET http://localhost:3000/students
```

### Create Student (Admin)
```bash
# Create student with custom name
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "87654321",
    "name": "John Doe"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Student created successfully.",
  "data": {
    "_id": "...",
    "studentId": "87654321",
    "name": "John Doe",
    "receivedAward": false
  },
  "statusCode": 201
}
```

---

## 3️⃣ **Raffle Items API**

### Get All Raffle Items
```bash
curl -X GET http://localhost:3000/raffle_items
```

### Create Raffle Item
```bash
# Add a prize item
curl -X POST http://localhost:3000/raffle_items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "quantity": 5,
    "itemPic": "https://example.com/laptop.jpg"
  }'
```

```bash
# Add another prize
curl -X POST http://localhost:3000/raffle_items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Headphones",
    "quantity": 10,
    "itemPic": "https://example.com/headphones.jpg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Raffle item created successfully.",
  "data": {
    "_id": "...",
    "name": "Laptop",
    "quantity": 5,
    "itemPic": "https://example.com/laptop.jpg"
  },
  "statusCode": 201
}
```

---

## 4️⃣ **Raffle API (Pick Winners)**

### Pick 1 Winner
```bash
curl -X GET "http://localhost:3000/raffle?n=1"
```

### Pick 3 Winners
```bash
curl -X GET "http://localhost:3000/raffle?n=3"
```

### Pick 10 Winners
```bash
curl -X GET "http://localhost:3000/raffle?n=10"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Raffle completed successfully. 3 winner(s) selected.",
  "data": [
    {
      "studentId": "12345678",
      "name": "Student_12345678",
      "item": {
        "_id": "...",
        "name": "Laptop",
        "itemPic": "https://example.com/laptop.jpg"
      }
    },
    {
      "studentId": "87654321",
      "name": "John Doe",
      "item": {
        "_id": "...",
        "name": "Headphones",
        "itemPic": "https://example.com/headphones.jpg"
      }
    }
  ],
  "statusCode": 200
}
```

---

## 5️⃣ **Logs API**

### Get All Raffle Logs
```bash
curl -X GET http://localhost:3000/logs
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Raffle logs retrieved successfully.",
  "data": [
    {
      "studentId": "12345678",
      "item": {
        "_id": "...",
        "name": "Laptop",
        "itemPic": "https://example.com/laptop.jpg"
      },
      "timestamp": "2026-01-18T10:08:41.000Z"
    }
  ],
  "statusCode": 200
}
```

---

## 🚀 Complete Testing Flow

Run these commands in order to test the entire system:

```bash
# 1. Register some students
curl -X POST http://localhost:3000/regis \
  -H "Content-Type: application/json" \
  -d '{"std_id": "11111111"}'

curl -X POST http://localhost:3000/regis \
  -H "Content-Type: application/json" \
  -d '{"std_id": "22222222"}'

curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"studentId": "33333333", "name": "Alice"}'

curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"studentId": "44444444", "name": "Bob"}'

# 2. Check all students
curl -X GET http://localhost:3000/students

# 3. Add raffle items
curl -X POST http://localhost:3000/raffle_items \
  -H "Content-Type: application/json" \
  -d '{"name": "MacBook Pro", "quantity": 2, "itemPic": "https://example.com/macbook.jpg"}'

curl -X POST http://localhost:3000/raffle_items \
  -H "Content-Type: application/json" \
  -d '{"name": "iPad", "quantity": 3, "itemPic": "https://example.com/ipad.jpg"}'

curl -X POST http://localhost:3000/raffle_items \
  -H "Content-Type: application/json" \
  -d '{"name": "AirPods", "quantity": 5, "itemPic": "https://example.com/airpods.jpg"}'

# 4. Check all items
curl -X GET http://localhost:3000/raffle_items

# 5. Perform raffle (pick 2 winners)
curl -X GET "http://localhost:3000/raffle?n=2"

# 6. Check logs
curl -X GET http://localhost:3000/logs

# 7. Check students again (should see receivedAward: true for winners)
curl -X GET http://localhost:3000/students

# 8. Check items again (should see decreased quantity)
curl -X GET http://localhost:3000/raffle_items
```

---

## 📝 Tips & Tricks

### Pretty Print JSON (requires jq)
```bash
curl -X GET http://localhost:3000/students | jq
```

### Verbose Mode (see headers)
```bash
curl -v -X GET http://localhost:3000/students
```

### Save Response to File
```bash
curl -X GET http://localhost:3000/students -o students.json
```

### Test with Different Ports
```bash
curl -X GET http://localhost:3001/students
```

---

## 🐛 Common Issues

### Issue: Connection Refused
```
curl: (7) Failed to connect to localhost port 3000: Connection refused
```
**Solution**: Make sure your server is running with `bun run dev`

### Issue: 404 Not Found
```json
{"statusCode": 404, "message": "Not Found"}
```
**Solution**: Check the endpoint URL and method (GET/POST)

### Issue: 400 Bad Request
```json
{"success": false, "message": "Validation error"}
```
**Solution**: Check your request body format and required fields

### Issue: 500 Internal Server Error
```json
{"success": false, "message": "Error creating student"}
```
**Solution**: Check server logs and database connection

---

## 📊 Quick Test Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"

echo "🧪 Testing Raffle API..."
echo ""

echo "1️⃣ Registering students..."
curl -s -X POST $BASE_URL/regis -H "Content-Type: application/json" -d '{"std_id": "11111111"}' | jq
curl -s -X POST $BASE_URL/regis -H "Content-Type: application/json" -d '{"std_id": "22222222"}' | jq

echo ""
echo "2️⃣ Getting all students..."
curl -s -X GET $BASE_URL/students | jq

echo ""
echo "3️⃣ Adding raffle items..."
curl -s -X POST $BASE_URL/raffle_items -H "Content-Type: application/json" -d '{"name": "Laptop", "quantity": 2}' | jq
curl -s -X POST $BASE_URL/raffle_items -H "Content-Type: application/json" -d '{"name": "Mouse", "quantity": 5}' | jq

echo ""
echo "4️⃣ Getting all items..."
curl -s -X GET $BASE_URL/raffle_items | jq

echo ""
echo "5️⃣ Performing raffle..."
curl -s -X GET "$BASE_URL/raffle?n=1" | jq

echo ""
echo "6️⃣ Getting logs..."
curl -s -X GET $BASE_URL/logs | jq

echo ""
echo "✅ Testing complete!"
```

Run with:
```bash
chmod +x test-api.sh
./test-api.sh
```
