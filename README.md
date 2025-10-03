## What It Does
- Gives users recommendations for resutrants based on dietary restricitions 
---

## MVP Features
1. Google sign in
2. Allergy profile setup 
3. Map with all nearby resturants
4. Recommendations with filtering 

---
## Extra Features
- Pulling live data from menus
- Using NPL 2 SQL ai for search optimizations
- Hosting/AWS



## DB Schema

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

```

---

## Key API Endpoints


---


## MVP Timeline

**Oct**
- Set up GitHub repo
- Create database schema
- Create Front and backend and connect

**Nov**
- Restaurant data entry (manually add 20-30 restaurants)
- Use maps api to display resturants nearby
- page/tab to view an individual resturant details

**Dec**
- Oauth2.0 integration
- Profile settings tab

**Jan**
- Recommendations tab
- 

---

## Getting Started Guide 

### Backend

### Frontend
