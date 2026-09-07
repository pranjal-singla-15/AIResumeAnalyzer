#!/bin/bash

# AI Resume Analyzer - Service Health Check Script

echo "========================================="
echo "AI Resume Analyzer - Service Health Check"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is responding
check_service() {
    local service_name=$1
    local url=$2
    
    echo -n "Checking $service_name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" == "200" ] || [ "$response" == "422" ] || [ "$response" == "405" ]; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed (Status: $response)${NC}"
        return 1
    fi
}

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    
    echo -n "Testing $name... "
    
    if [ "$method" == "POST" ]; then
        response=$(curl -s -X POST "$url" \
            -H "Content-Type: application/json" \
            -d "$data" \
            -w "\n%{http_code}")
    else
        response=$(curl -s "$url" -w "\n%{http_code}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success (HTTP $http_code)${NC}"
        echo "Response: $body" | head -c 100
        echo ""
    elif [ "$http_code" -ge 400 ] && [ "$http_code" -lt 500 ]; then
        echo -e "${YELLOW}⚠ Client Error (HTTP $http_code)${NC}"
        echo "Response: $body" | head -c 100
        echo ""
    else
        echo -e "${RED}✗ Error (HTTP $http_code)${NC}"
        echo "Response: $body" | head -c 100
        echo ""
    fi
}

# Check services
echo "1. Service Availability Check:"
echo "-----------------------------"
check_service "Python AI Service" "http://localhost:8000/"
AI_RESULT=$?

check_service "Java Backend" "http://localhost:8080/"
BACKEND_RESULT=$?

check_service "Frontend" "http://localhost:5173/"
FRONTEND_RESULT=$?

echo ""
echo "2. Endpoint Tests:"
echo "-----------------"

if [ $AI_RESULT -eq 0 ]; then
    test_endpoint "Resume Analysis" "POST" "http://localhost:8000/analyze-resume" \
        '{"resumeText": "Java Spring Boot Docker PostgreSQL"}'
else
    echo -e "${RED}⚠ Skipping resume analysis test (AI service not available)${NC}"
fi

if [ $BACKEND_RESULT -eq 0 ]; then
    test_endpoint "Backend Health" "GET" "http://localhost:8080/"
else
    echo -e "${RED}⚠ Skipping backend tests (Backend not available)${NC}"
fi

echo ""
echo "3. Summary:"
echo "-----------"

if [ $AI_RESULT -eq 0 ] && [ $BACKEND_RESULT -eq 0 ] && [ $FRONTEND_RESULT -eq 0 ]; then
    echo -e "${GREEN}✓ All services are running and healthy!${NC}"
    exit 0
elif [ $AI_RESULT -ne 0 ]; then
    echo -e "${RED}✗ Python AI Service is not running${NC}"
    echo "  - Make sure: docker-compose up is running"
    echo "  - Check: docker logs ai_resume_ai"
    exit 1
elif [ $BACKEND_RESULT -ne 0 ]; then
    echo -e "${RED}✗ Java Backend is not running${NC}"
    echo "  - Make sure: docker-compose up is running"
    echo "  - Check: docker logs ai_resume_backend"
    exit 1
else
    echo -e "${YELLOW}⚠ Some services may have issues. Check logs above.${NC}"
    exit 1
fi
