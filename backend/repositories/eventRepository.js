import pool from "../server.js";

export const getEventsRepository = async (filters = {}) => {
  const {sortBy, radius, lat, lng, minParticipants, dateFilter, startDate, endDate,
  } = filters;

  const EARTH_RADIUS = 3959; // in miles
  const params = [];
  const conditions = [];

  // base query
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

  // --- 🗓️ Date filtering ---
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

  // Haversine formula for calculating distance between to points
  // Reference URL:  https://stackoverflow.com/questions/27708490/haversine-formula-definition-for-sql

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

  if (minParticipants) {
    params.push(minParticipants);

  }
  
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }


  query += " GROUP BY e.event_id";

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