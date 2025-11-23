const baseUrl = "http://localhost:8080";

// list of test accounts
let testAccounts = [
  {email: "test2@email.com", password: "password1", user_id: null, token: null},
  {email: "test3@email.com", password: "password1", user_id: null, token: null},
  {email: "test4@email.com", password: "password1", user_id: null, token: null},
  {email: "test5@email.com", password: "password1", user_id: null, token: null},
  {email: "test6@email.com", password: "password1", user_id: null, token: null}
]

// set up the tests
async function setUpTestAccounts() {
  for (let acc of testAccounts) {
    try {
      const response = await fetch(`${baseUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: acc.email,
          password: acc.password
        })
      })

      const data = await response.json();

      if (response.ok) {
        acc.user_id = data.user.user_id;
        acc.token = data.token;
        // console.log(`Login successful: ${acc.email}, ${acc.user_id}, ${acc.token}`)
        console.log(`Login successful: ${acc.email}`)
      }
      else {
        console.error(`Login went wrong: ${acc.email}`, data.message)
      }
    } catch (error) {
      console.error(`Error logging in with: ${acc.email}`, error.message)
    }
  }
  return null;
}

// unregister from event
async function unregisterUser(eventId = 1, testUserIndex = 0) {
  const acc = testAccounts[testUserIndex];

  try {
    const eventResponse = await fetch(`${baseUrl}/api/events/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${acc.token}`
      }
    })
    const eventData = await eventResponse.json();

    if (eventResponse.ok) {
      try {
        console.log(`Unregistering ${acc.email} from ${eventData.name}`);

        const unregisterResponse = await fetch(`${baseUrl}/api/events/${eventId}/register/${acc.user_id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${acc.token}`
          }
        })

        const unregisterData = await unregisterResponse.json();
        
        if (unregisterResponse.ok) {
          console.log(`Successfully unregistered ${acc.email}`);
          // console.log(`Response: ${unregisterData}`);
          return unregisterData;
        }
        else {
          console.error(`Failed to unregister user`, unregisterData);
          
        }
      } catch (error) {
        console.error(`Error unregistering from event: `, error.message);
      }

    }
    else {
      console.error(`Failed to get event data.`);
    }
  } catch (error) {
    console.error(`Error getting event data: `, error.message);
  }
}

// assign a role to user
async function assignRole(role="Runner", eventId=1, testUserIndex=0) {
  const acc = testAccounts[testUserIndex]
  try {
    console.log(`Assigning ${role} Role: ${acc.email} for event ${eventId}`);

    const response = await fetch(`${baseUrl}/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${acc.token}`
      },
      body: JSON.stringify({
        user_id: acc.user_id,
        role: role
      })
    })
      const data = await response.json();

      if (response.ok) {
        console.log(`Success for ${acc.email}`);
        console.log(`Response: ${data}`);
        return data;
      }
      else if (response.status == 409 || response.status == 400) {
        console.log(`User already registered, updating role to ${role}`)

        const updateResponse = await fetch(`${baseUrl}/api/events/${eventId}/update-role/${acc.user_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${acc.token}`
          },
          body: JSON.stringify({
            user_id: acc.user_id,
            newRole: role
          })
        })

        const updateData = await updateResponse.json();

        if (updateResponse.ok) {
          console.log(`Success update for ${acc.email} role to ${role}`);
          // console.log(`Response: ${updateData}`);
          return updateData;
        }
        else {
          console.error(`Failed to update ${role} role:`, updateData);
        }
      }
      else {
        console.error(`Failed to assign ${role} role:`, data);
        // console.log(`Status: ${response.status}`);
      }

  } catch (error) {
    console.error(`Error assigning ${role} role:`, error.message);
  }
}

// test multiple starting official roles
async function multipleStartingOfficials(eventId = 1, testUserIndex = 1) {

  try {
    console.log(`Trying to assign multiple Starting Official...`);
    const result = await assignRole("Starting Official", eventId, testUserIndex);

    if (result) {
      console.log(`SOMETHING WRONG: It should not have assigned multiple Starting Officials`)
    }
    else {
      console.log(`SUCCESS: Did not assign Starting Offical Role to ${testAccounts[testUserIndex].email}`);

    }
  } catch (error) {
    console.error(`Error during multiple Startin Official role test`, error.message);
  }
}

// get list of volunteers
async function getAllVolunteers(eventId = 1) {
  const response = await fetch(`${baseUrl}/api/events/${eventId}/volunteers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  try {
    if (response.ok) {
      console.log(`Successfully got all volunteers: ${data.count} people`);
      return data;
    }
    else {
      console.error(`Failed to get volunteers for event: ${eventId}`, data);
  
    }
  } catch (error) {
    console.error(`Error getting volunteers: `, error.message);
  }
}

// get list of participants
async function getAllParticipants(eventId = 1) {
  const response = await fetch(`${baseUrl}/api/events/${eventId}/participants`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await response.json();
  try {
    if (response.ok) {
      console.log(`Successfully got all participants: ${data.count} people`);
      return data;
    }
    else {
      console.error(`Failed to get participants for event: ${eventId}`, data);
  
    }
  } catch (error) {
    console.error(`Error getting participants: `, error.message);
  }
}


async function runTests() {
  // set up all the test accounts and get their jwt tokens
  console.log('Running setUpAccount()');
  await setUpTestAccounts();

  // register and assign each user a role for event
  // [Role, eventId, testUserIndex]
  console.log('\nRunning assignRole() for Runner');
  await assignRole("Runner", 3, 0);
  console.log('\nRunning assignRole() for Runner');
  await assignRole("Runner", 3, 1);
  console.log('\nRunning assignRole() for Runner');
  await assignRole("Runner", 3, 2);
  console.log('\nRunning assignRole() for Starting Official');
  await assignRole("Starting Official", 3, 3);
  console.log('\nRunning assignRole() for Finish Line Official');
  await assignRole("Finish Line Official", 3, 4);

  // try assigning multiple Startin Officials
  console.log(`\nRunning multipleStartingOfficials()`);
  await multipleStartingOfficials(3, 2);

  // get total number of volunteers
  console.log('\nRunning getAllVolunteers()');
  await getAllVolunteers(3);

  // get total number of participants
  console.log('\nRunning getAllParticipants()');
  await getAllParticipants(3);

  // unregister all the users from event
  console.log('\nRunning unregisterUser()');
  await unregisterUser(3, 0);
  console.log('\nRunning unregisterUser()');
  await unregisterUser(3, 1);
  console.log('\nRunning unregisterUser()');
  await unregisterUser(3, 2);
  console.log('\nRunning unregisterUser()');
  await unregisterUser(3, 3);
  console.log('\nRunning unregisterUser()');
  await unregisterUser(3, 4);

}

runTests();