# AllergyEats - MVP System Design

## What It Does
AllergyEats helps people with food allergies find safe restaurants. Users enter their allergies once, and the app shows them nearby restaurants that are safe for them to eat at.

---

## MVP Features (What We're Building First)

1. **Sign in with Google** - Quick and secure login
2. **Set up allergy profile** - Select your allergies (nuts, gluten, dairy, etc.)
3. **Find safe restaurants nearby** - Search "pizza near me" and get filtered results
4. **View restaurant details** - See menus with allergen warnings
5. **Leave reviews** - Rate how well restaurants handled your allergies

---

## How It Works

### User Flow Example
1. Sarah has a peanut allergy
2. She signs in with Google and selects "Peanuts" in her profile
3. She searches "Italian restaurants near me"
4. App shows only restaurants without peanut dishes
5. She picks one, sees the safe menu items, and makes a reservation

---

## System Architecture

```
┌─────────────┐
│  Mobile App │ (iOS/Android)
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────┐
│ API Gateway │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│  Backend Services    │
│  (Docker containers) │
│                      │
│  • Auth Service      │
│  • User Service      │
│  • Restaurant Service│
│  • Search Service    │
└──────┬───────────────┘
       │
       ▼
┌──────────────┐
│  PostgreSQL  │ (Restaurant & user data)
│  Redis Cache │ (Fast search results)
└──────────────┘
```

---

## Database Schema

```sql
-- Users and their allergies
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    google_sub TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    allergies JSONB DEFAULT '[]',  -- ["nuts","gluten","dairy"]
    created_at TIMESTAMP DEFAULT NOW()
);

-- Restaurants and their allergen info
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    cuisine_type TEXT,
    allergen_tags JSONB DEFAULT '[]',  -- ["nuts","shellfish"]
    rating DECIMAL(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Menu items with allergen tags
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    name TEXT NOT NULL,
    price DECIMAL(10, 2),
    allergen_tags JSONB DEFAULT '[]',  -- ["gluten","dairy"]
    created_at TIMESTAMP DEFAULT NOW()
);

-- User reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    was_safe BOOLEAN,
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Key API Endpoints

### Authentication
```
POST /api/auth/google
Body: { "code": "google_oauth_code" }
Response: { "token": "jwt_token", "user": {...} }
```

### User Profile
```
GET /api/users/:id
Response: { "id": 123, "allergies": ["nuts", "gluten"] }

PATCH /api/users/:id/allergies
Body: { "allergies": ["nuts", "dairy"] }
Response: { "success": true }
```

### Restaurant Search
```
GET /api/restaurants/search?query=pizza&lat=40.7&lng=-74.0
Response: {
  "results": [
    {
      "id": 456,
      "name": "Safe Pizza Place",
      "distance_miles": 0.8,
      "rating": 4.5,
      "safe_items_count": 12
    }
  ]
}
```

### Reviews
```
POST /api/reviews
Body: {
  "restaurant_id": 456,
  "rating": 5,
  "was_safe": true,
  "comment": "Great experience!"
}
```

---

## How Search Works

1. User searches "pizza near me"
2. App gets user's allergies from database: `["nuts", "gluten"]`
3. Query restaurants within 10 miles
4. **Filter out** restaurants that have nuts or gluten in their menu
5. Sort remaining restaurants by rating and distance
6. Return safe restaurants to user

**SQL Logic:**
```sql
SELECT * FROM restaurants
WHERE latitude BETWEEN :min_lat AND :max_lat
  AND longitude BETWEEN :min_lng AND :max_lng
  AND NOT (allergen_tags ?| ARRAY['nuts', 'gluten'])
ORDER BY rating DESC, distance ASC
LIMIT 20;
```

---

## Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- PostgreSQL 15

### Quick Start
```bash
# Clone repo
git clone https://github.com/yourteam/allergyeats.git
cd allergyeats

# Set up environment variables
cp .env.example .env
# Edit .env with your Google OAuth credentials

# Start all services
docker-compose up

# Services will be available at:
# - Auth Service: http://localhost:3001
# - User Service: http://localhost:3002
# - Restaurant Service: http://localhost:3003
# - Search Service: http://localhost:3004
```

### Docker Compose File
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: allergyeats
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  auth-service:
    build: ./services/auth
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://admin:password123@postgres:5432/allergyeats
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
    depends_on:
      - postgres

  user-service:
    build: ./services/user
    ports:
      - "3002:3002"
    environment:
      DATABASE_URL: postgresql://admin:password123@postgres:5432/allergyeats
    depends_on:
      - postgres

  restaurant-service:
    build: ./services/restaurant
    ports:
      - "3003:3003"
    environment:
      DATABASE_URL: postgresql://admin:password123@postgres:5432/allergyeats
    depends_on:
      - postgres

  search-service:
    build: ./services/search
    ports:
      - "3004:3004"
    environment:
      DATABASE_URL: postgresql://admin:password123@postgres:5432/allergyeats
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
```

---

## Tech Stack

**Mobile Apps:**
- iOS: Swift + SwiftUI
- Android: Kotlin + Jetpack Compose

**Backend:**
- Node.js + Express
- PostgreSQL (database)
- Redis (caching)
- Docker (containerization)

**Authentication:**
- Google OAuth 2.0
- JWT tokens

**Deployment (Later):**
- AWS ECS Fargate
- RDS PostgreSQL
- ElastiCache Redis

---

## MVP Timeline

**Week 1-2: Setup**
- Set up GitHub repo
- Create database schema
- Set up Docker containers
- Google OAuth integration

**Week 3-4: Core Features**
- User profile management
- Restaurant data entry (manually add 20-30 restaurants)
- Basic search functionality

**Week 5-6: Mobile App**
- iOS app with login, search, restaurant details
- Android app (same features)

**Week 7-8: Testing & Launch**
- Bug fixes
- Add more restaurant data
- Beta testing with 10-20 users
- Launch MVP!

---

## What's NOT in the MVP

❌ AI/ML recommendations (just simple filtering)
❌ Live menu scraping (manual data entry for now)
❌ Social features (following users, sharing)
❌ Restaurant partnerships
❌ Real-time menu updates
❌ Photo uploads

These come later! MVP = Simple and functional.

---

## Success Metrics

We'll know the MVP is working if:
- Users can sign up in under 30 seconds
- Search returns results in under 2 seconds
- Users leave at least 1 review per week
- 80% of users return within 7 days

---

## Getting Started as a Developer

1. **Pick a service to work on:**
   - Auth Service: Handle Google login
   - User Service: Manage user profiles
   - Restaurant Service: CRUD for restaurants
   - Search Service: Filter and rank restaurants

2. **Run locally:**
   ```bash
   docker-compose up
   ```

3. **Make changes and test:**
   ```bash
   # Run tests
   npm test

   # Check your service
   curl http://localhost:3001/health
   ```

4. **Submit PR when ready!**

---

## Questions?

- Check the `/docs` folder for detailed API documentation
- Join our Slack channel: #allergyeats-dev
- Email: dev@allergyeats.com
