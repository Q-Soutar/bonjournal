const DB_URL_BASE = "https://bonjournal-360318-default-rtdb.firebaseio.com";
const AUTH_URL_BASE = "https://identitytoolkit.googleapis.com/v1/accounts";
// TL = "top-level"
const DB_USERS_TLKEY = "/users";
const DB_ENTRIES_TLKEY = "/entries";
const DB_TAGS_TLKEY = "/tags";
const API_KEY = "AIzaSyCHDtn6M4QZ1XbL50d1HDFxK4ZrjvkQWUs";

export const dbInitEntries = function (userID, token, callback) {
    const userKey = `/${userID}`;
    const auth = `.json?auth=${token}`;
    const orderBy = `&orderBy="date"`;
    const startTime = Date.now() - 30 * 24 * 60 * 60;
    // const startAt = `&startAt=${startTime}`;
    const limitToFirst = `&limitToFirst=25`;
    // const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${auth}${orderBy}${startAt}`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${auth}${orderBy}${limitToFirst}`;
    // const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${auth}${orderBy}`;
    fetch(dbCallURL)
        .then((res) => res.json())
        .then((entries) => {
            if (entries !== {} && entries !== [] && entries !== undefined) {
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
                // const newEntriesSorted = newEntries.sort();
                callback(newEntries);
            }
        })
        .catch((err) => console.log(err));
};

export const dbCreateEntry = function (
    entry,
    userID,
    token,
    callback1,
    callback2
) {
    const { uuid, ...newEntry } = entry;
    const userKey = `/${userID}`;
    const entryKey = `/${uuid}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${entryKey}${auth}`;
    const body = {
        ...newEntry
    };
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
            if (callback2) callback2(userID, token, callback1);
        })
        .catch((err) => {
            console.error("dbCreateEntry() -- Entry writer error:");
            console.log(err);
        });
};
// Merge this with the create function since they are basically the exact same thing.
export const dbUpdateEntry = function (
    entry,
    userID,
    token,
    callback1,
    callback2
) {
    const { uuid, ...entryUpdates } = entry;
    const userKey = `/${userID}`;
    const entryKey = `/${uuid}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${entryKey}${auth}`;
    const body = {
        ...entryUpdates
    };
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
            if (callback2) callback2(userID, token, callback1);
        })
        .catch((err) => {
            console.error("dbUpdateEntry() -- Entry writer error:");
            console.log(err);
        });
};

export const dbDeleteEntry = async function (
    userID,
    token,
    entryID,
    callback1,
    callback2
) {
    const userKey = `/${userID}`;
    const entryKey = `/${entryID}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_ENTRIES_TLKEY}${userKey}${entryKey}${auth}`;
    return fetch(dbCallURL, {
        method: "DELETE"
    })
        .then((res) => {
            if (res.ok) return res.json();
            if (!res.ok) throw new Error(res.json());
        })
        .then((data) => {
            if (callback2) callback2(userID, token, callback1);
            return data;
        })
        .catch((err) => {
            console.log(`Entry deletion failed`);
            console.dir(err);
        });
};