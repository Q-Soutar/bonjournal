import { DB_URL_BASE, AUTH_URL_BASE, DB_USERS_TLKEY, API_KEY } from "./Config";

// Retrieve user data from firebase
export const dbGetUserData = function (userID, token) {
    return new Promise((resolve, reject) => {
        // Set up fetch call
        const userKey = `/${userID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_USERS_TLKEY}${userKey}${auth}`;
        // Make the fetch call
        fetch(dbCallURL)
            .then((res) => {
                return res.json();
            })
            .then(
                (data) => {
                    // Resolve with user data
                    if (data.userEmail) resolve(data);
                    // Reject if none is found for some reason
                    if (!data.userEmail) reject(undefined);
                },
                (data) => {
                    reject(undefined);
                }
            )
            .catch((err) => {
                console.error(err);
                reject(undefined);
            });
    });
};

// Edit just non-credential info
export const dbEditUserDataPartial = function (
    userID,
    token,
    { userEmail, userFirstName, userLastName, username }
) {
    // Set up fetch call
    const userKey = `/${userID}`;
    const auth = `.json?auth=${token}`;
    const dbCallURL = `${DB_URL_BASE}${DB_USERS_TLKEY}${userKey}${auth}`;
    const body = JSON.stringify({
        userEmail: userEmail,
        userFirstName: userFirstName,
        userLastName: userLastName,
        username: username
    });
    const headers = {
        "Content-Type": "application/json"
    };
    const params = {
        method: "PATCH",
        body: body,
        headers: headers
    };
    // Make fetch call
    return new Promise((resolve, reject) => {
        fetch(dbCallURL, params)
            .then((res) => res.json())
            .then((data) => {
                // Resolve, affirming success
                resolve(data);
            })
            .catch((err) => {
                console.error(err);
            });
    });
};
// Orchestration of a complete rewrite of user data
export const dbEditUserDataFull = function (userID, token, userData) {
    return new Promise((resolve, reject) => {
        // Update credential info
        authEditEmail(userData.userEmail, token)
            .then(
                (newEmailInfo) => {
                    // Once that is complete, update the non-credential user fields
                    return new Promise((resolve, reject) => {
                        dbEditUserDataPartial(
                            userID,
                            newEmailInfo.token.token,
                            userData
                        )
                            .then(() => {
                                // Resolve with the new token from the credential update
                                resolve(newEmailInfo);
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    });
                },
                (err) => {
                    throw new Error(err);
                }
            )
            .then((data) => {
                // Pass the new token data in the resolve
                resolve(data);
            })
            .catch((err) => {
                console.error(err);
            });
    });
};
// Update the credential fields for the user
export const authEditEmail = function (email, token) {
    return new Promise((resolve, reject) => {
        // Set up fetch call
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
        // Make fetch call
        fetch(authCallURL, params)
            .then((res) => res.json())
            .then(({ email, localId, idToken, refreshToken, expiresIn }) => {
                // Format the new token
                const newEmailInfo = {
                    email: email,
                    token: {
                        userID: localId,
                        token: idToken,
                        refreshToken: refreshToken,
                        expiry: expiresIn
                    }
                };
                // Resolve with the new token
                resolve(newEmailInfo);
            })
            .catch((err) => {
                reject({});
                console.error(err);
            });
    });
};
// Not implemented; need minor overhaul of the profile update flow
export const authEditPassword = function ({ password, token }) {
    return new Promise((resolve, reject) => {
        // Check if a password change was submitted
        if (!password) resolve(token);
        // Set up fetch call
        const auth = `?key=${API_KEY}`;
        const action = ":update";
        const authCallURL = `${AUTH_URL_BASE}${action}${auth}`;
        const body = JSON.stringify({
            idToken: token,
            password: password,
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
        // Make fetch call
        fetch(authCallURL, params)
            .then((res) => res.json())
            .then(({ email, localId, idToken, refreshToken, expiresIn }) => {
                // Format the new token
                const newEmailInfo = {
                    email: email,
                    token: {
                        userID: localId,
                        token: idToken,
                        refreshToken: refreshToken,
                        expiry: expiresIn
                    }
                };
                // Resolve with the new token
                resolve(newEmailInfo);
            })
            .catch((err) => {
                reject({});
                console.error(err);
            });
    });
};

// Needs to mirror the update sequence, with it being called immediately before a DB user update.
// Write the credential fields of a new user to firebase
export const authSignUpPartial = function ({ userEmail, password }) {
    return new Promise((resolve, reject) => {
        // Set up fet h call
        const auth = `?key=${API_KEY}`;
        const action = ":signUp";
        const authCallURL = `${AUTH_URL_BASE}${action}${auth}`;
        const body = JSON.stringify({
            email: userEmail,
            password: password,
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
        // Make fetch call
        fetch(authCallURL, params)
            .then((res) => res.json())
            .then(({ email, localId, idToken, refreshToken, expiresIn }) => {
                // Format the new token received from firebase
                const newEmailInfo = {
                    email: email,
                    token: {
                        userID: localId,
                        token: idToken,
                        refreshToken: refreshToken,
                        expiry: expiresIn
                    }
                };
                // Resolve with the new token
                resolve(newEmailInfo);
            })
            .catch((err) => console.error(err));
    });
};
// Orchestration of new user creation functions
export const authCreateUserFull = function (newUserInfo) {
    return new Promise((resolve, reject) => {
        // Make the main user setup call
        authSignUpPartial(newUserInfo).then((sessionToken) => {
            const token = sessionToken.token;
            // Write the non-credential user fields
            dbEditUserDataPartial(token.userID, token, newUserInfo);
            // Resolve with the token
            resolve(token);
        });
    });
};
