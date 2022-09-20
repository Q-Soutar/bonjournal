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
    // console.log(`Database.js -> dbInitEntries() -> userID: ${userID}`);
    // console.log(`Database.js -> dbInitEntries() -> token: ${token}`);
    // console.log(`Database.js -> dbInitEntries() -> callback: ${callback}`);
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
    // console.log(`Database.js -> dbDeleteEntry() -> function called`);
    // console.log(`Database.js -> dbDeleteEntry() -> userID: ${userID}`);
    // console.log(`Database.js -> dbDeleteEntry() -> token: ${token}`);
    // console.log(`Database.js -> dbDeleteEntry() -> entryID: ${entryID}`);
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
            // console.log(`Entry ${entryKey} deleted.`);
            // console.dir(data);
            return data;
        })
        .catch((err) => {
            console.log(`Entry deletion failed`);
            console.dir(err);
        });
};

// User functions
export const dbGetUserData = function (userID, token) {
    return new Promise((resolve, reject) => {
        const userKey = `/${userID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_USERS_TLKEY}${userKey}${auth}`;
        fetch(dbCallURL)
            .then((res) => {
                console.log(`Database.js -> dbGetUserData() -> res: `);
                console.log(res);
                return res.json();
            })
            .then(
                (data) => {
                    console.log(`Database.js -> dbGetUserData() -> data: `);
                    console.log(data);
                    if (data.userEmail) resolve(data);
                    if (!data.userEmail) reject(undefined);
                },
                (data) => {
                    reject(undefined);
                }
            )
            .catch((err) => {
                console.log(err);
                reject(undefined);
            });
    });
};

export const dbEditUserDataPartial = function (userID, token, userData) {
    const userKey = `/${userID}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_USERS_TLKEY}${userKey}${auth}`;
    const body = JSON.stringify({
        userEmail: userData.userEmail,
        userFirstName: userData.userFirstName,
        userLastName: userData.userLastName,
        username: userData.username
    });
    const headers = {
        "Content-Type": "application/json"
    };
    const params = {
        method: "PATCH",
        body: body,
        headers: headers
    };
    return new Promise((resolve, reject) => {
        fetch(dbCallURL, params)
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

export const dbEditUserDataFull = function (userID, token, userData) {
    return new Promise((resolve, reject) => {
        authEditEmail(token, userData.userEmail)
            .then(
                (newEmailInfo) => {
                    return new Promise((resolve, reject) => {
                        dbEditUserDataPartial(
                            userID,
                            newEmailInfo.token.token,
                            userData
                        )
                            .then((data) => {
                                resolve(newEmailInfo);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    });
                },
                (err) => {
                    throw new Error(err);
                }
            )
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

export const authEditEmail = function (token, email) {
    return new Promise((resolve, reject) => {
        const auth = `?key=${API_KEY}`;
        const action = ":update";
        const authCallURL = `${AUTH_URL_BASE}${action}${auth}`;
        const body = JSON.stringify({
            idToken: token,
            email: email,
            returnSecureToken: true
        });
        const headers = {
            "Content-Type": "application/json"
        };
        const params = {
            method: "POST",
            body: body,
            headers: headers
        };
        fetch(authCallURL, params)
            .then((res) => res.json())
            .then((data) => {
                const newEmailInfo = {
                    email: data.email,
                    token: {
                        userID: data.localId,
                        token: data.idToken,
                        refreshToken: data.refreshToken,
                        expiry: data.expiresIn
                    }
                };
                resolve(newEmailInfo);
            })
            .catch((err) => {
                reject({});
                console.error(err);
            });
    });
};
// Needs to mirror the update sequence, with it being called immediately before a DB user update.
export const authSignUpPartial = function (newUserInfo) {
    return new Promise((resolve, reject) => {
        const auth = `?key=${API_KEY}`;
        const action = ":signUp";
        const authCallURL = `${AUTH_URL_BASE}${action}${auth}`;
        const body = JSON.stringify({
            email: newUserInfo.userEmail,
            password: newUserInfo.password,
            returnSecureToken: true
        });
        const headers = {
            "Content-Type": "application/json"
        };
        const params = {
            method: "POST",
            body: body,
            headers: headers
        };
        fetch(authCallURL, params)
            .then((res) => res.json())
            .then((sessionToken) => {
                const newEmailInfo = {
                    email: sessionToken.email,
                    token: {
                        userID: sessionToken.localId,
                        token: sessionToken.idToken,
                        refreshToken: sessionToken.refreshToken,
                        expiry: sessionToken.expiresIn
                    }
                };
                resolve(newEmailInfo);
            })
            .catch((err) => console.error(err));
    });
};

export const authCreateUserFull = function (newUserInfo) {
    return new Promise((resolve, reject) => {
        authSignUpPartial(newUserInfo).then((sessionToken) => {
            const token = sessionToken.token;
            dbEditUserDataPartial(token.userID, token, newUserInfo);
            resolve(token);
            // start a user session
        });
    });
};

// Tags calls
export const dbGetTags = function (token, userID) {
    return new Promise((resolve, reject) => {
        const userKey = `/${userID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_TAGS_TLKEY}${userKey}${auth}`;
        fetch(dbCallURL)
            .then((res) => {
                return res.json;
            })
            .then((tags) => {
                resolve(tags);
            })
            .catch((err) => {
                console.error(err);
            });
    });
};
