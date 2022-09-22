import { Navigate } from "react-router-dom";
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
    // Set loggedIn state to true
    // Write authCtx variables
    // Redirect to home page
    // If token absent
    // Redirect to login
    const checkTokenValidity = function ({ expiry }) {
        if (expiry > 10000) {
            return true;
        } else if (expiry <= 10000 || isNaN(expiry)) {
            return false;
        } else {
            console.log("Time check failure, throwing error");
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
        .then(({ idToken, refreshToken, expiresIn, localID }) => {
            return new Promise(function (resolve, reject) {
                // If valid
                // Return promise true
                // if (res.ok)
                resolve({
                    token: idToken,
                    refreshToken: refreshToken,
                    expiry: expiresIn,
                    userID: localID
                });
                // If invalid
                // Return promise login error
                // if (!res.ok) reject(new Error(data));
            });
        })
        .catch((err) => {
            console.log(err);
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
                // autoRefresh(data.refresh_token, data.expiresIn);
                // If valid
                // Return promise true
                // The docs for this actually get the payload completely wrong, sporting not only inaccurate casing, but *inaccurate field names*
                resolve({
                    token: id_token,
                    refreshToken: refresh_token,
                    expiry: expires_in, // Uncertain longterm about using this but keeping it in the code for now if I do end up strongly needing it
                    userID: user_id
                });
                // If invalid
                // Return promise login error
                // if (!res.ok) reject(new Error(data));
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
export const autoRefresh = function (token, setAuth) {
    const expiry = token;
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
            // If valid
            // Store token
            // Write authCtx somehow
            // Look into non-chained .then() statements
            return storeToken(token);
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                resolve(true);
            });
        })
        .catch((err) => {
            // If invalid
            // Redirect to login
            console.log(`Something went wrong! -- ${err}`);
            // Set login error message
            // Redirect logic here
        });
};
export const logout = function () {
    // Clear tokens
    clearStoredTokens();
    // Clear autoRefresh
    if (refreshTimer) clearTimeout(refreshTimer);
    // Redirect to login page
    return new Promise((resolve, reject) => {
        resolve(true);
    });
};
