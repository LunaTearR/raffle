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
