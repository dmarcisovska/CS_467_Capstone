
  // References: 1) "This SQL query for getEventsRepository function was generated using the help of chat-gpt to help create a dynamic script.
  //               "This transcript: "I want a postgresql query that uses a base query to retrieve all rows in the
  //                events table, use the Haversine formula to calculate the distance in miles between
  //                the input user latitude and longitude as lat and lng. Include support to this query by
  //                 adding optional req queries radius, lat, lng, dateFilter of [upcoming, week, month or based on event_datetime],
  //                startDate, endDate for custom date filtering, and support for sorting: sortBy=distance, participants, date.
  //                "
  //                I had to change the base sql query to include participants information since chatgpt did not know how to
  //                find how many participants are part of an event.
  
  //                2) // Haversine formula for calculating distance between to points
  //                Reference URL:  https://stackoverflow.com/questions/27708490/haversine-formula-definition-for-sql

import pool from "../server.js";

export const getEventsRepository = async (filters = {}) => {
  const {sortBy, radius, lat, lng, minParticipants, dateFilter, startDate, endDate,
  } = filters;

  const EARTH_RADIUS = 3959; // in miles
  const params = [];
  const conditions = [];

  // base query + I added in participant_count by joining registrations table event_id on the events tables event_id column
  let query = `
    SELECT
      e.*,
      COUNT(r.user_id) AS participant_count,
      CASE
        WHEN $1::float IS NOT NULL AND $2::float IS NOT NULL THEN (
          ${EARTH_RADIUS} * acos(
            cos(radians($1)) * cos(radians(e.latitude)) *
            cos(radians(e.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(e.latitude))
          )
        )
        ELSE NULL
      END AS distance_miles
    FROM events e
    LEFT JOIN registrations r ON e.event_id = r.event_id
  `;

  // enforce lat and long indexs
  params.push(lat ?? null, lng ?? null);

  if (dateFilter === "upcoming") {
    conditions.push("e.event_datetime >= NOW()");
  } else if (dateFilter === "week") {
    conditions.push("e.event_datetime BETWEEN NOW() AND NOW() + INTERVAL '7 days'");
  } else if (dateFilter === "month") {
    conditions.push("e.event_datetime BETWEEN NOW() AND NOW() + INTERVAL '1 month'");
  } else if (startDate && endDate) {

    const startIndex = params.length + 1;
    params.push(startDate);
    const endIndex = params.length + 1;
    params.push(endDate);
    conditions.push(
      `e.event_datetime BETWEEN $${startIndex}::timestamptz AND $${endIndex}::timestamptz`
    );
  }

  // if radius, lat, lng exists user wants to find events within distance
  if (radius && lat && lng) {
    const radiusIndex = params.length + 1;
    params.push(radius);
    conditions.push(`
      (${EARTH_RADIUS} * acos(
        cos(radians($1)) * cos(radians(e.latitude)) *
        cos(radians(e.longitude) - radians($2)) +
        sin(radians($1)) * sin(radians(e.latitude))
      )) <= $${radiusIndex}
    `);
  }

// added by Brian Can, ensures only events with participants registered >= the minimum participants is returned.
  if (minParticipants) {
    params.push(minParticipants);

  }
  
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }


  query += " GROUP BY e.event_id";


  // added by Brian Can, ensures only events with participants registered >= the minimum participants is returned.
  if (minParticipants) {
    query += ` HAVING COUNT(r.user_id) >= $${params.length}`;
  }

  // sort
  if (sortBy === "distance" && lat && lng) {
    query += " ORDER BY distance_miles ASC";
  } else if (sortBy === "participants") {
    query += " ORDER BY participant_count DESC";
  } else if (sortBy === "date") {
    query += " ORDER BY e.event_datetime ASC";
  }

  const { rows } = await pool.query(query, params);
  return rows;
};


export const getFeaturedEventsRepository = async () => {
    const query = `SELECT e.*, COUNT(r.user_id) as participantCount
              FROM events e
              LEFT JOIN registrations r on e.event_id = r.event_id
              GROUP BY e.event_id
              ORDER BY participantCount DESC
              LIMIT 3;`

    const { rows } = await pool.query(query);
    return rows;
}


export const registerForEventRepository = async (eventId, userId, role) => {
  const query = `
  INSERT INTO registrations (event_id, user_id, role)
  VALUES ($1, $2, $3)
  RETURNING *;`
  
  const { rows } = await pool.query(query, [eventId, userId, role]);
  return rows[0];
}


export const unregisterForEventRepository = async (eventId, userId) => {
  const query = `
  DELETE FROM registrations
  WHERE event_id = $1 AND user_id = $2
  RETURNING *`;
  
  const { rows } = await pool.query(query, [eventId, userId]);
  return rows[0];
}
