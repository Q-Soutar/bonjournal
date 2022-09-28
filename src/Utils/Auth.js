// App files
import { storeToken, retrieveTokens, clearStoredTokens } from "./Cookies";

const signInBaseURL = "https://identitytoolkit.googleapis.com/v1/";
const refreshBaseURL = "https://securetoken.googleapis.com/v1/";
const signInPath = "accounts:signInWithPassword?key=";
const refreshPath = "token?key=";
const API_KEY = "AIzaSyCHDtn6M4QZ1XbL50d1HDFxK4ZrjvkQWUs";

let refreshTimer;
const restoreSession = function (token, setAuth) {
    setAuth(token);
    autoRefresh(token, setAuth);
};
const refreshSession = function ({ refreshToken }, setAuth) {
    employRefreshToken(refreshToken).then((token) => {
        startSession(token, setAuth);
    });
};
export const startSession = function (token, setAuth) {
    setAuth(token);
    storeToken(token);
    autoRefresh(token, setAuth);
};

export const authInit = function (setAuth) {
    // Check storage
    retrieveTokens()
        .then((storedToken) => {
            // If token present
            return new Promise((resolve, reject) => {
                // Browser can someimtes store undefined as a string, evidently.
                if (
                    storedToken.refreshToken !== undefined &&
                    storedToken.refreshToken !== "undefined"
                ) {
                    resolve(storedToken);
                } else {
                    reject(null);
                }
            });
        })
        .then(
            (token) => {
                // Check token validity
                const tokenValidity = checkTokenValidity(token);
                // If valid, restore session
                if (tokenValidity) restoreSession(token, setAuth);
                // If invalid, refresh session
                if (!tokenValidity) refreshSession(token, setAuth);
            },
            () => {
                setAuth();
                clearStoredTokens();
            }
        )
        .catch((err) => {
            console.error(
                `authInit() ----> retrieveTokens() ----> Error occured: `,
                err
            );
        });
    const checkTokenValidity = function ({ expiry }) {
        if (expiry > 10000) {
            return true;
        } else if (expiry <= 10000 || isNaN(expiry)) {
            return false;
        } else {
            console.error("Time check failure, throwing error");
            throw new Error("Token expired");
        }
    };
};

export const getNewToken = function (email, password) {
    // Ready fetch request
    const signInURL = `${signInBaseURL}${signInPath}${API_KEY}`;
    const signInBody = JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
    });
    const signInHeaders = {
        "Content-Type": "application/json"
    };
    // Send fetch request
    return fetch(signInURL, {
        method: "POST",
        body: signInBody,
        headers: signInHeaders
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
            if (!res.ok) throw new Error(res);
        })
        .then(({ idToken, refreshToken, expiresIn, localId }) => {
            console.log();
            return new Promise(function (resolve, reject) {
                resolve({
                    token: idToken,
                    refreshToken: refreshToken,
                    expiry: expiresIn * 1000,
                    userID: localId
                });
            });
        })
        .catch((err) => {
            console.error(err);
        });
};
export const employRefreshToken = function (refreshToken) {
    // Ready fetch request
    const refreshURL = `${refreshBaseURL}${refreshPath}${API_KEY}`;
    const refreshBody = {
        grant_type: "refresh_token",
        refresh_token: refreshToken
    };
    const refreshFormBody = Object.keys(refreshBody)
        .map(
            (key) =>
                encodeURIComponent(key) +
                "=" +
                encodeURIComponent(refreshBody[key])
        )
        .join("&");
    const refreshHeaders = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    // Send fetch request
    return fetch(refreshURL, {
        method: "POST",
        body: refreshFormBody,
        headers: refreshHeaders
    })
        .then((res) => {
            return res.json();
        })
        .then(({ id_token, refresh_token, expires_in, user_id }) => {
            return new Promise(function (resolve, reject) {
                // The docs for this actually get the payload completely wrong, sporting not only inaccurate casing, but *inaccurate field names*
                resolve({
                    token: id_token,
                    refreshToken: refresh_token,
                    expiry: expires_in * 1000,
                    userID: user_id
                });
            });
        })
        .catch((err) => {
            console.error(err);
        });
};
export const autoRefresh = function (token, setAuth) {
    const expiry = token.expiry;
    if (expiry < 1000) {
        console.error("Invalid expiry time, cancelling auto-refresh");
        return;
    }
    refreshTimer = setTimeout(
        function (token) {
            refreshSession(token, setAuth);
        },
        expiry,
        token
    );
};

export const login = function (email, password) {
    // Send token request
    getNewToken(email, password)
        .then((token) => {
            if (!token) throw new Error("Not token received!");
            return storeToken(token);
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        })
        .catch((err) => {
            console.error(`Something went wrong! -- ${err}`);
        });
};
export const logout = function () {
    // Clear tokens
    clearStoredTokens();
    // Clear autoRefresh
    if (refreshTimer) clearTimeout(refreshTimer);
    return new Promise((resolve, reject) => {
        resolve(true);
    });
};
