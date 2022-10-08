// App files
import { storeToken, retrieveTokens, clearStoredTokens } from "./Cookies";
import {
    SIGN_IN_BASE_URL,
    SIGN_IN_PATH,
    REFRESH_BASE_URL,
    REFRESH_PATH,
    API_KEY
} from "./Config";

let refreshTimer;
// Start up a brand new session
export const startSession = function (token, setAuth) {
    // Update auth context
    setAuth(token);
    // Write the new tokens to the browser cookies
    storeToken(token);
    // Set the automatic token refresh
    autoRefresh(token, setAuth);
};
// Pick an existing session but up where it left off
const restoreSession = function (token, setAuth) {
    // Update auth context
    setAuth(token);
    // Set the automatic token refresh
    autoRefresh(token, setAuth);
};
// Utilize a refresh token for a new session
const refreshSession = function ({ refreshToken }, setAuth) {
    // Make refresh token call
    employRefreshToken(refreshToken).then((token) => {
        // Start a new session with the received token
        startSession(token, setAuth);
    });
};
// Fuction to set up an automatic refresh of the token on its expiry
export const autoRefresh = function (token, setAuth) {
    // Semi-redundant line. The timeout was throwing a tantrum if I used the expiry on the token itself, so I wrote it as a dedicated variable.
    const expiry = token.expiry;
    if (expiry < 1000) {
        // Again, semi-redundant, but I need some kind of guard to prevent 0ms timeouts spamming firebase auth
        console.error("Invalid expiry time, cancelling auto-refresh");
        return;
    }
    // Set up the timeout
    refreshTimer = setTimeout(
        function (token) {
            // Use the refresh token on expiration
            refreshSession(token, setAuth);
        },
        expiry,
        token
    );
};
// Set up auth on app start
export const authInit = function (setAuth) {
    // Check storage
    retrieveTokens()
        .then((storedToken) => {
            return new Promise((resolve, reject) => {
                // Browser can someimtes store undefined as a string, evidently.
                if (
                    storedToken.refreshToken !== undefined &&
                    storedToken.refreshToken !== "undefined"
                ) {
                    // If token is present, resolve promise with the stored token
                    resolve(storedToken);
                } else {
                    // If the token is absent, reject the promise
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
                // Set auth as null
                setAuth();
                // Clear any stored tokens
                clearStoredTokens();
            }
        )
        .catch((err) => {
            console.error(
                `authInit() ----> retrieveTokens() ----> Error occured: `,
                err
            );
        });
};

// Retrieve a new token with credentials
export const getNewToken = function (email, password) {
    // Ready fetch request
    const signInURL = `${SIGN_IN_BASE_URL}${SIGN_IN_PATH}${API_KEY}`;
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
            // Resolve promise with the new token
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
// Get a new token with the refresh token
export const employRefreshToken = function (refreshToken) {
    // Ready fetch request
    const refreshURL = `${REFRESH_BASE_URL}${REFRESH_PATH}${API_KEY}`;
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
            // Resolve the promise with the received token
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

// Function to orchestrate relevant functions for logging in
export const login = function (email, password) {
    // Send token request
    getNewToken(email, password)
        .then((token) => {
            if (!token) throw new Error("Not token received!");
            // Token to storage
            return storeToken(token);
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                // Affirm successful login
                resolve(true);
            });
        })
        .catch((err) => {
            console.error(`Something went wrong! -- ${err}`);
        });
};
// Logout the user
export const logout = function () {
    // Clear tokens
    clearStoredTokens();
    // Clear autoRefresh
    if (refreshTimer) clearTimeout(refreshTimer);
    return new Promise((resolve, reject) => {
        // Affirm completion
        resolve(true);
    });
};

// Check if a stored token is still valid
const checkTokenValidity = function ({ expiry }) {
    // Check for a minimum of 10s ttl
    if (expiry > 10000) {
        return true;
    } else if (expiry <= 10000 || isNaN(expiry)) {
        return false;
    } else {
        console.error("Time check failure, throwing error");
        throw new Error("Token expired");
    }
};
