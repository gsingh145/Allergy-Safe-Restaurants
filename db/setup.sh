CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,       -- auto-incrementing ID
    name TEXT NOT NULL,          -- restaurant name
    latitude DOUBLE PRECISION,   -- latitude coordinate
    longitude DOUBLE PRECISION   -- longitude coordinate
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    age INT
);


CREATE TABLE allergies (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    allergy VARCHAR(100)
);