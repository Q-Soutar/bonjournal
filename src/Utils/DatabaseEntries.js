import { DB_URL_BASE, DB_ENTRIES_TLKEY } from "./Config";
// Retrieve entries on app start
export const dbInitEntries = function (userID, token, callback) {
    // Fetch call setup
    const userKey = `/${userID}`;
    const auth = `.json?auth=${token}`;
    const orderBy = `&orderBy="date"`;
    // const startTime = Date.now() - 30 * 24 * 60 * 60;
    // const startAt = `&startAt=${startTime}`;
    const limitToFirst = `&limitToFirst=25`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${auth}${orderBy}${limitToFirst}`;
    // Make fetch call
    fetch(dbCallURL)
        .then((res) => res.json())
        .then((entries) => {
            // Make sure any entries are actually there; apparently falsey wasn't good enough here so I had to get real verbose
            if (
                entries !== {} &&
                entries !== [] &&
                entries !== undefined &&
                entries !== null
            ) {
                // Format and sort the entries
                const newEntries = Object.keys(entries)
                    .map((key) => {
                        return {
                            ...entries[key],
                            uuid: key
                        };
                    })
                    .sort((a, b) => {
                        if (a.date > b.date) return 1;
                        if (a.date < b.date) return -1;
                        return 0;
                    });
                // Execute that call, ie write the entries to the state
                callback(newEntries);
            }
        })
        .catch((err) => console.error(err));
};
// Refactor for updated promise logic
// Write a new entry to the database
export const dbCreateEntry = function (
    entry,
    userID,
    token,
    callback1,
    callback2
) {
    // Set up fetch call
    const { uuid, ...newEntry } = entry;
    const userKey = `/${userID}`;
    const entryKey = `/${uuid}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${entryKey}${auth}`;
    const body = {
        ...newEntry
    };
    // Make fetch call
    fetch(dbCallURL, {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => {
            if (res.ok) return res.json();
            if (!res.ok) throw new Error(res.json());
        })
        .then(() => {
            // Execute callback; ie, refresh the entries state
            if (callback2) callback2(userID, token, callback1);
        })
        .catch((err) => {
            console.error("dbCreateEntry() -- Entry writer error:");
            console.log(err);
        });
};

// Refactor for updated promise logic
// Eventually merge this with the create function since they are basically the exact same thing.
// Write updates to firebase
export const dbUpdateEntry = function (
    entry,
    userID,
    token,
    callback1,
    callback2
) {
    // Set up fetch call
    const { uuid, ...entryUpdates } = entry;
    const userKey = `/${userID}`;
    const entryKey = `/${uuid}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${entryKey}${auth}`;
    const body = {
        ...entryUpdates
    };
    // Make fetch call
    fetch(dbCallURL, {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => {
            if (res.ok) return res.json();
            if (!res.ok) throw new Error(res.json());
        })
        .then(() => {
            // Execute a timeline refresh via the callbacks
            if (callback2) callback2(userID, token, callback1);
        })
        .catch((err) => {
            console.error("dbUpdateEntry() -- Entry writer error:");
            console.log(err);
        });
};

// Delete an entry from firebase
export const dbDeleteEntry = async function (
    entryID,
    userID,
    token,
    callback1,
    callback2
) {
    // Set up fetch call
    const userKey = `/${userID}`;
    const entryKey = `/${entryID}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${entryKey}${auth}`;
    // Make fetch call / return promise
    return fetch(dbCallURL, {
        method: "DELETE"
    })
        .then((res) => {
            if (res.ok) return res.json();
            if (!res.ok) throw new Error(res.json());
        })
        .then((data) => {
            // Update the entries state based on firebase
            if (callback2) callback2(userID, token, callback1);
            return data;
        })
        .catch((err) => {
            console.error(`Entry deletion failed`);
            console.dir(err);
        });
};
