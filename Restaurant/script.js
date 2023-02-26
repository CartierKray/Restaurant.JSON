// A global variable which we pass into every function that needs it to keep
// them more pure.
const ROOT_URL = "http://localhost:3000/";

const sendRequest = async (method, root_url, url_part = "", body = false) => {
    const url = `${root_url}${url_part}`;
    const options = {
        method,
    };
    if (method !== "GET") {
        options.body = JSON.stringify(body);
        options.header = {
            Authorization: `Bearer this_is_a_secret`,
            "Content-Type": "application/json;charset=utf-8",
        };
    }
    const response = await fetch(url, options);

    let result;
    switch (response.status) {
        case 200:
        case 201:
            result = await response.json();
            break;
        default:
            console.log(`🚨 The backend responded with status ${response.status}.`);
            console.log(`URL: ${url}`);
            console.log(`options:`, options);
            break;
    }
    return result;
};

const showReservations = async root_url => {
    let reservations = await sendRequest("GET", root_url, "reservations");
    console.table(reservations);
};

///////////////////////////////////////////////////////////////////////////////
// Show all reservations
await showReservations(ROOT_URL);

///////////////////////////////////////////////////////////////////////////////
// Create a new reservation.
const kusamaReservation = {
    name: "Yayoi Kusama",
    people: 3,
    date: "05/05/2024",
    time: "20:00",
};
const kusamaReservationResult = await sendRequest(
    "POST",
    ROOT_URL,
    "reservations",
    kusamaReservation
);
if (kusamaReservationResult) {
    console.log(
        `ℹ️ Reservation created for Yayoi Kusama with id ${kusamaReservationResult.id}`
    );
} else {
    console.log("No reservation created.");
}
await showReservations(ROOT_URL);

// Create another new reservation.
const neshatReservation = {
    name: "Shirin Neshat",
    people: 7,
    date: "19/01/2024",
    time: "17:30",
};
const neshatReservationResult = await sendRequest(
    "POST",
    ROOT_URL,
    "reservations",
    neshatReservation
);
if (neshatReservationResult) {
    console.log(
        `ℹ️ Reservation created for Shirin Neshat with id ${neshatReservationResult.id}`
    );
} else {
    console.log("No reservation created.");
}
await showReservations(ROOT_URL);

///////////////////////////////////////////////////////////////////////////////
if (kusamaReservationResult) {
    // Update Yayoi Kusama's reservation.
    // Make a copy of the previous reservation and change two properties using
    // the spread syntax.
    const kusamaReservationUpdated = {
        ...kusamaReservation,
        name: "Ms Yayoi Kusama",
        time: "21:00",
    };

    // Send PUT request to update the reservation.

    await sendRequest(
        "PUT",
        ROOT_URL,
        `reservations/${kusamaReservationResult.id}`,
        kusamaReservationUpdated
    );
    console.log("ℹ️ Reservation for Ms Yayoi Kusama has been updated.");
    await showReservations(ROOT_URL);
}

///////////////////////////////////////////////////////////////////////////////
if (neshatReservationResult) {
    // Update reservation using PATCH

    // We can just send an object with the properties we want to update.
    const neshatReservationPartialUpdate = {
        people: 12,
        time: "20:00",
    };
    await sendRequest(
        "PATCH",
        ROOT_URL,
        `reservations/${neshatReservationResult.id}`,
        neshatReservationPartialUpdate
    );
    console.log("ℹ️ Reservation for Shirin Neshat has been updated.");
    await showReservations(ROOT_URL);
}