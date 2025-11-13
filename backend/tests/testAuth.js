/**
 * Tests for /middleware/auth.js
 * 
 * Usage:
 *  1. Go to testAuth.http and log in; this will return your user_id and token
 *  2. Paste those below and configure the event/user/api endpoint as needed
 *  4. Run this with `node testAuth.js <test_name>`
 *     Example: node testAuth.js test1
 */

const baseUrl = "http://localhost:8080";
const jwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYmQ1NDgzMDMtNjJiNy00NTM1LTliYzEtZjZhN2YzMGFlZTE5IiwiZW1haWwiOiJub3Qtc2FtQHZlcnktcmVhbC1lbWFpbC5jb20iLCJpYXQiOjE3NjI2NjA0MzEsImV4cCI6MTc2MzI2NTIzMX0.n3FPiNU57RFhKpEAcyuxmRJVIA8xRxXHzQ8G2oELzE0";
const userId = "bd548303-62b7-4535-9bc1-f6a7f30aee19";

/**
 * User is registered on event 1 as a Runner.
 * Try to get a runner QR code.
 * ----------------------------
 * Expected: SVG of QR code
 */
function test1() {
    fetch(`${baseUrl}/api/raceday/make-qr?event=1&user=${userId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}
/**
 * User is registered on event 1 as a Runner.
 * Try to start the race.
 * ----------------------------
 * Expected: FAILURE - Only Starting Officials can start races
 */
function test2() {
    fetch(`${baseUrl}/api/raceday/set-start-time?event=1`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}
/**
 * User is registered on event 2 as a Starting Official.
 * Try to start the race.
 * ----------------------------
 * Expected: SUCCESS - Start time recorded successfully
 */
function test3() {
    fetch(`${baseUrl}/api/raceday/set-start-time?event=2`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}
/**
 * User is registered on event 2 as a Starting Official.
 * Try to log a runner's finish time.
 * ----------------------------
 * Expected: Only Finish Line Officials can record finish times
 */
function test4() {

    // Another user registered in event 2 as a Runner 
    const runnerUserId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

    fetch(`${baseUrl}/api/raceday/set-finish-time?event=2&user=${runnerUserId}`, {
        method: "GET", // because the trigger is a QR code scan
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        }
    })
    .then(res => res.text())
    .then(data => console.log(data))
    .catch(err => console.error(err));
}

const availableTests = {
    test1,
    test2,
    test3,
    test4
};

// CLI handler
// eslint-disable-next-line
const testName = process.argv[2];

if (!testName) {
    console.error('Error: Please specify a test to run');
    console.log('Usage: node testAuth.js <test_name>');
    console.log('Available tests: test1');
    // eslint-disable-next-line
    process.exit(1);
}
if (availableTests[testName]) {
    console.log(`Running ${testName}...`);
    availableTests[testName]();

} else {
    console.error(`Error: Test "${testName}" not found`);
    console.log('Available tests:', Object.keys(availableTests).join(', '));
    // eslint-disable-next-line
    process.exit(1);
}