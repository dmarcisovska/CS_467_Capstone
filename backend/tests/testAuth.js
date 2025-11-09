/**
 * Tests for /middleware/auth.js.
 * 
 * Usage:
 *  1. Go to testAuth.http and log in
 *  2. That will return your user_id and token
 *  3. Paste that below and configure the event/user/api endpoint as needed
 *  4. Run this with `node testAuth.js`
 */

const baseUrl = "http://localhost:8080";
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmQ1NDgzMDMtNjJiNy00NTM1LTliYzEtZjZhN2YzMGFlZTE5IiwiZW1haWwiOiJub3Qtc2FtQHZlcnktcmVhbC1lbWFpbC5jb20iLCJpYXQiOjE3NjI2NTIyNDIsImV4cCI6MTc2MzI1NzA0Mn0.7ub_GnkyJlCKbgRitbkbAjLHPYpjre6ZN1y_1ZPL2Yo";
const eventId = "1";
const userId = "bd548303-62b7-4535-9bc1-f6a7f30aee19";

fetch(`${baseUrl}/api/raceday/make-qr?event=${eventId}&user=${userId}`, {
    headers: {
        'Authorization': `Bearer ${jwtToken}`
    }
})
.then(res => res.text())
.then(data => console.log(data))
.catch(err => console.error(err));