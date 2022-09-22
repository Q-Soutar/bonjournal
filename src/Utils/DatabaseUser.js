const DB_URL_BASE = "https://bonjournal-360318-default-rtdb.firebaseio.com";
const AUTH_URL_BASE = "https://identitytoolkit.googleapis.com/v1/accounts";
// TL = "top-level"
const DB_USERS_TLKEY = "/users";
const DB_ENTRIES_TLKEY = "/entries";
const DB_TAGS_TLKEY = "/tags";
const API_KEY = "AIzaSyCHDtn6M4QZ1XbL50d1HDFxK4ZrjvkQWUs";

// User functions
export const dbGetUserData = function (userID, token) {
    return new Promise((resolve, reject) => {
        const userKey = `/${userID}`;
        const auth = `.json?auth=${token}`;
        const dbCallURL = `${DB_URL_BASE}${DB_USERS_TLKEY}${userKey}${auth}`;
        fetch(dbCallURL)
            .then((res) => {
                return res.json();
            })
            .then(
                (data) => {
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
