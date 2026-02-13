#!/bin/bash

API_URL="http://localhost:5000/api/auth"
EMAIL="test$(date +%s)@example.com"
PASSWORD="password123"

echo "1. Registering user..."
curl -s -X POST "$API_URL/register" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Test User\", \"email\": \"$EMAIL\", \"password\": \"$PASSWORD\", \"role\": \"user\"}" | python3 -m json.tool

echo -e "\n\n2. Logging in..."
LOGIN_RES=$(curl -s -X POST "$API_URL/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

echo "$LOGIN_RES" | python3 -m json.tool

TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo -e "\n\nToken received successfully."
    exit 0
else
    echo -e "\n\nNo token received!"
    exit 1
fi
