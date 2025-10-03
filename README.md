## MVP Features
1. User sign in (through google fb etc)
2. Allergy profile setup 
3. Display map with all nearby resturants
4. Recommendations with filtering 

---
## Extra Features
- Pulling live data from menus
- Using NPL 2 SQL ai for search optimizations
- Hosting/AWS

--
## Frontend
- Tabs
  - User settings
  - Map
  - Recommendations

## Timeline

**Oct**
- Set up GitHub repo
- Create database schema for resturants and menu items
- Create basic Front and backend
- Restaurant data entry (manually add 20-30 restaurants)
- Display resturant info on frontend. 
  - Front end sends request to backend
  - backend sends request to db
  - Db returns data to backend and backend gives it to frontend
  - Frontend can display the info

**Nov**
- Use maps api to display resturants nearby
- page/tab to view an individual resturant details

**Dec**
- Oauth2.0 integration
- Profile settings tab

**Jan**
- Recommendations tab
- SQL queries to get resturant data based on user filtering

**Feb**
- NLP2SQL

**March**
- Hosting

---


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


## Getting Started Guide 

### Backend

### Frontend
