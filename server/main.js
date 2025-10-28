const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Create PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',          // change these
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// Test route
app.get('/restaurant', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving restaurants from database');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


// Tasks

//RESTURANTS

// fix restaurant endpoint to filter long/lat

app.get('/restaurants', async (req, res) => {
  const { lat, lng } = req.query; //grabs the query pararmeters


  try {
    let query = 'SELECT * FROM restaurants';
    let params = [];

    if (lat && lng) {  // Add filter if lat/lng provided
      query += ' WHERE latitude = $1 AND longitude = $2'; // the $1 and $2 are supposed to placeholders for the lng/lat
      params = [lat, lng];
    }

    const result = await pool.query(query, params); // Execute query
    res.json(result.rows);                            // Send JSON response
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving restaurants'); // Handle errors
  }
});
// Create another endpoint to get info about a given resturant using resturant ID

app.get('/restaurants/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Restaurant not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving restaurant');
  }
});

//USERS

//Create Users table in PSQL  (DB)
//retaurants table 


// Create endpoint that will create a user in the psql database given the name/email/etc.
// Create endpoint to get user info given a specific user id

// Fulfills all of the above hopefully
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body; 

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [name, email, age]
    );
    res.status(201).json(result.rows[0]); // here it returns the created user
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

// Create endpoint to store users allergies

// Store user's allergies
app.post('/users/:id/allergies', async (req, res) => {
  const { id } = req.params;
  const { allergies } = req.body;  //it will want a array of strings

  try {
    await pool.query('DELETE FROM allergies WHERE user_id = $1', [id]); // Removes the old allergies

    // Will now insert new allergies
    const insertPromises = allergies.map(allergy =>
      pool.query('INSERT INTO allergies (user_id, allergy) VALUES ($1, $2)', [id, allergy])
    );
    await Promise.all(insertPromises);

    res.status(201).send('Allergies updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating allergies');
  }
});