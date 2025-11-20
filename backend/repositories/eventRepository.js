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
  //
  //                3) Used AI to help update the query for retrieving sponsor data, volunteer data, and role data from other tables to my existing
  //                    sql query in getEventByIDRepository(). Prompted AI "How do I return list of data in a single object in postgresql"
  //                    AI taught me how to use json_agg() and json_build_obj() to do so and I used the examples to call and join on other tables to get data.                

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
      END AS distance_miles,
      (
        SELECT json_agg(json_build_object('user_id', u.user_id, 'username', u.username))
        FROM registrations reg
        JOIN users u ON reg.user_id = u.user_id
        WHERE reg.event_id = e.event_id AND reg.role = 'Runner'
      ) AS participants
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

export const createEventRepository = async(eventData) => {
  const query = `
    INSERT INTO events (
      creator_user_id,
      name,
      event_datetime,
      latitude,
      longitude,
      description,
      distance,
      elevation,
      difficulty
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const params = [
    eventData.creator_user_id,
    eventData.name,
    eventData.event_datetime,
    eventData.latitude,
    eventData.longitude,
    eventData.description,
    eventData.distance,
    eventData.elevation,
    eventData.difficulty
  ]

  const { rows } = await pool.query(query, params);
  return rows;
}

/**
 * 
 * @param {*} eventId 
 * @param {*} role 
 * @param {*} roleLimit 
 * @returns 
 */
export const getEventIdByNameRepository = async(eventName) => {
  const query = `
    SELECT event_id FROM events WHERE name = $1
  `;

  const params = [eventName];
  const { rows } = await pool.query(query, params);
  return rows[0];
}
/**
 * Sets the roleLimit for a specific role in an event.
 * @param {*} eventId 
 * @param {*} role 
 * @param {*} roleLimit 
 * @returns 
 */
export const createEventRoleRepository = async(eventId, role, roleLimit) => {
  const query = `
    INSERT INTO event_roles (event_id, role, role_limit)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const params = [eventId, role, roleLimit];
  const { rows } = await pool.query(query, params);
  return rows[0];
}


export const updateEventRepository = async (eventId, newData) => {
  // COALESCE allows the code to use new data if it is not null
  const query = `
    UPDATE events
    SET
      creator_user_id = COALESCE($1, creator_user_id),
      name = COALESCE($2, name),
      event_datetime = COALESCE($3, event_datetime),
      latitude = COALESCE($4, latitude),
      longitude = COALESCE($5, longitude),
      description = COALESCE($6, description),
      distance = COALESCE($7, distance),
      elevation = COALESCE($8, elevation),
      difficulty = COALESCE($9, difficulty),
      updated_at = CURRENT_TIMESTAMP
    WHERE event_id = $10
    RETURNING *
  `;

  const params = [
    newData.creator_user_id,
    newData.name,
    newData.event_datetime,
    newData.latitude,
    newData.longitude,
    newData.description,
    newData.distance,
    newData.elevation,
    newData.difficulty,
    eventId
  ];
  
  const { rows } = await pool.query(query, params);
  return rows;
}

export const deleteEventRepository = async (eventId) => {
  const query = `
    DELETE FROM events
    WHERE event_id = $1
    RETURNING *
  `;

  const { rows} = await pool.query(query, [eventId]);
  return rows;
}

export const registerForEventRepository = async (eventId, userId, role) => {
  const query = `
    INSERT INTO registrations (event_id, user_id, role)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const params = [eventId, userId, role];
  
  // Create a formatted version with actual values
  const formattedQuery = query.replace(/\$(\d+)/g, (match, index) => {
    const value = params[index - 1];
    return typeof value === 'string' ? `'${value}'` : value;
  });
  
  console.log('Full query:', formattedQuery);
  
  const { rows } = await pool.query(query, params);
  return rows[0];
};


export const unregisterForEventRepository = async (eventId, userId) => {
  const query = `
  DELETE FROM registrations
  WHERE event_id = $1 AND user_id = $2
  RETURNING *`;
  
  const { rows } = await pool.query(query, [eventId, userId]);
  return rows[0];
}

export const getEventByIdRepository = async (eventId) => {
  try {
  const query = `SELECT e.*,

              (
                SELECT json_agg(
                  json_build_object(
                    'role', t.role,
                    'role_limit', t.role_limit,
                    'current_count', t.current_count
                  )
                )
                FROM (
                  SELECT 
                    er.role,
                    er.role_limit,
                    COUNT(r.user_id) AS current_count
                  FROM event_roles er
                  LEFT JOIN registrations r
                    ON r.event_id = er.event_id
                   AND r.role = er.role
                  WHERE er.event_id = e.event_id
                  GROUP BY er.role, er.role_limit
                  ORDER BY er.role
                ) t
              ) AS roles,
              
              (SELECT json_agg(json_build_object('id', es.id, 'sponsor', es.sponsor, 'prize', es.prize))
              FROM event_sponsors es
              WHERE es.event_id = e.event_id
              ) AS sponsors,
               
              (SELECT json_agg(json_build_object(
                'user_id', u.user_id,
                'username', u.username,
                'email', u.email,
                'avatar_url', u.avatar_url,
                'role', r.role
                  )
                )
                FROM registrations r
                JOIN users u
                  ON r.user_id = u.user_id
                WHERE r.event_id = e.event_id
                AND r.role <> 'Runner'
                ) AS volunteers,
                
              (SELECT json_agg(json_build_object(
                'user_id', u.user_id,
                'username', u.username,
                'email', u.email,
                'avatar_url', u.avatar_url
                  )
                )
                FROM registrations r
                JOIN users u
                  ON r.user_id = u.user_id
                WHERE r.event_id = e.event_id
                AND r.role = 'Runner'
                ) AS participants
                
                FROM events e
                WHERE e.event_id = $1`;
  
  const result = await pool.query(query, [eventId]);

  return result.rows[0] || null;

} catch(error) {
  console.error("Error in event repository", error.message);
  throw error;
  }
}

export const getVolunteerList = async (eventId) => {
  const query = `SELECT r.event_id, r.user_id, r.role, u.username, u.email 
            FROM registrations r
            JOIN users u
            ON r.user_id = u.user_id
            
            WHERE r.event_id = $1 AND r.role != $2`;

  const values = [eventId, 'Runner'];
  const { rows } = await pool.query(query, values)
  return rows
}

export const getFinalistListRepository = async (eventId) => {
  const query = `
    SELECT
      r.event_id,
      r.user_id,
      r.role,
      r.start_time,
      r.finish_time,
      r.elapsed_time,
      u.username,
      u.email
    FROM registrations r
    LEFT JOIN users u
      ON r.user_id = u.user_id
    WHERE r.event_id = $1
      AND r.role = 'Runner'
      AND r.finish_time IS NOT NULL
    ORDER BY r.elapsed_time ASC;
  `;
  const values = [eventId]
  const { rows } = await pool.query(query, values)

  return rows
}

export const getRunnersListRepository = async (eventId) => {
  const query = `SELECT
      r.event_id,
      r.user_id,
      r.role,
      r.start_time,
      r.finish_time,
      r.elapsed_time,
      u.username,
      u.email
    FROM registrations r
    LEFT JOIN users u
      ON r.user_id = u.user_id
    WHERE r.event_id = $1
      AND r.role = 'Runner'
    ORDER BY r.elapsed_time ASC;
  `;

  const values = [eventId]
  const { rows } = await pool.query(query, values)

  return rows
}


export const getParticipantsRepository = async (eventId) => {

  const query = `SELECT r.event_id, r.user_id, r.role, u.username, u.email
                FROM registrations r
                LEFT JOIN users u
                  ON r.user_id = u.user_id
                WHERE r.event_id = $1
                ORDER BY r.role, u.username`;

  const values = [eventId]
  const { rows } = await pool.query(query, values)
  return rows
}