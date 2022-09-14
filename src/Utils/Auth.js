import { Navigate } from "react-router-dom";
import { storeToken, retrieveTokens, clearStoredTokens } from "./Cookies";

const email = "stratton.soutar@gmail.com";
const password = "test123";
const signInBaseURL = "https://identitytoolkit.googleapis.com/v1/";
const refreshBaseURL = "https://securetoken.googleapis.com/v1/";
const signInPath = "accounts:signInWithPassword?key=";
const refreshPath = "token?key=";
const API_KEY = "AIzaSyCHDtn6M4QZ1XbL50d1HDFxK4ZrjvkQWUs";

let refreshTimer;
const restoreSession = function (token, setAuth) {
    console.log(`restoreSession() ----> token: `);
    console.log(token);
    setAuth(token);
    autoRefresh(token, setAuth);
};
const refreshSession = function ({ refreshToken }, setAuth) {
    console.log(`refreshSession() ----> refreshToken: `);
    console.log(refreshToken);
    employRefreshToken(refreshToken).then((token) => {
        startSession(token, setAuth);
    });
};

export const authInit = function (setAuth) {
    console.log(`>=====< authInit() >=====<`);
    console.log(`authInit() ----> beginning auth initialization`);
    console.log(`authInit() ----> Defining restoreSession()`);
    console.log(`authInit() ----> restoreSession() defined:`);
    console.dir(restoreSession);
    console.log(`authInit() ----> Defining refreshSession()`);
    console.log(`authInit() ----> restoreSession() defined:`);
    console.dir(restoreSession);
    // Check storage
    console.log(`authInit() ----> Checking local storage`);
    retrieveTokens()
        .then((storedToken) => {
            // If token present
            console.log(
                `authInit() ----> retrieveTokens().then() ----> checking for existing token`
            );
            return new Promise((resolve, reject) => {
                console.log(
                    `authInit() ----> retrieveTokens().then() ----> checking for existing token`
                );
                console.log(storedToken);
                // Browser can someimtes store undefined as a string, evidently.
                if (
                    storedToken.refreshToken !== undefined &&
                    storedToken.refreshToken !== "undefined"
                ) {
                    console.log(
                        `authInit() ----> retrieveTokens().then() ----> Token found, resolving promise`
                    );
                    console.log(
                        `authInit() ----> retrieveTokens().then() ----> storedToken: `
                    );
                    console.dir(storedToken);
                    resolve(storedToken);
                } else {
                    console.log(
                        `authInit() ----> retrieveTokens().then() ----> No token found, rejecting promise`
                    );
                    reject(null);
                }
            });
        })
        .then(
            (token) => {
                // Check token validity
                console.log(
                    `authInit() ----> retrieveTkens().then().then() ----> isNaN(${isNaN(
                        token.expiry
                    )})`
                );
                const tokenValidity = checkTokenValidity(token);
                console.log(
                    `authInit() ----> retrieveTokens().then().then() ----> tokenValidity: ${tokenValidity}`
                );
                // If valid
                // Set LoggedIn state to true (?)
                // Write authCtx variables
                // Redirect to home page
                console.log(
                    `authInit() ----> retrieveTokens().then().then() ----> token: `
                );
                console.log(token);
                if (tokenValidity) restoreSession(token, setAuth);
                // If invalid
                // Use refresh token
                // Store new token data
                if (!tokenValidity) refreshSession(token, setAuth);
            },
            () => {
                console.log(
                    "authInit() ----> retrieveTokens().then().then() ----> Promise rejected, no token found, defaulting auth state..."
                );
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
        console.log(`checkTokenValidity() ----> expiry: ${expiry}`);
        const curTime = new Date().getTime();
        console.log(`checkTokenValidity() ----> curTime: ${curTime}`);
        // const expTime1 = Date.now() + ttl;
        // console.log(`checkTokenValidity() ----> expTime1: ${expTime1}`);
        // const expTime2 =
        //     typeof new Date(ttl).getTime() + Date.now() === "number"
        //         ? new Date(ttl).getTime() + Date.now()
        //         : 0;
        // console.log(`checkTokenValidity() ----> expTime: ${expTime}`);
        // const ttl = expTime - curTime;
        console.log(`checkTokenValidity() ----> ttl: ${expiry}`);
        // 2 If valid, set token state to this and set the refresh timer
        console.log(`checkTokenValidity() ----> expiry > 10: ${expiry > 10}`);
        console.log(`checkTokenValidity() ----> expiry <= 10: ${expiry <= 10}`);
        console.log(
            `checkTokenValidity() ----> isNaN(expiry): ${isNaN(expiry)}`
        );
        console.log(`Something something why not log`);
        if (expiry > 10000) {
            console.log(
                `checkTokenValidity() ----> ttl is greater than 10s, returning true`
            );
            return true;
        } else if (expiry <= 10000 || isNaN(expiry)) {
            console.log(
                `checkTokenValidity() ----> ttl is less than or equal to 10s, returning false`
            );
            return false;
            // 3 If invalid, set to null (????)
            // 4 Check if refresh token is present
            // 5 If present, use to get a new token
        } else {
            // 6 Failing all of the above, land the user on the login screen
            console.log("Time check failure, throwing error");
            throw new Error("Token expired");
        }
    };
};

export const startSession = function (token, setAuth) {
    setAuth(token);
    storeToken(token);
    // autoRefresh(, setAuth);
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
                console.log(`getNewToken() ----> API call response: `);
                console.log(res);
                return res.json();
            }
            if (!res.ok) throw new Error(res);
        })
        .then((data) => {
            console.log(`getNewToken ----> data: `);
            console.log(data);
            return new Promise(function (resolve, reject) {
                // If valid
                // Return promise true
                // if (res.ok)
                resolve({
                    token: data.idToken,
                    refreshToken: data.refreshToken,
                    expiry: data.expiresIn,
                    userID: data.localId
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
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then((res) => {
            const data = res.json();
            // Check if a valid token was returned
            return new Promise(function (resolve, reject) {
                // autoRefresh(data.refresh_token, data.expiresIn);
                // If valid
                // Return promise true
                if (res.ok)
                    resolve({
                        token: data.idToken,
                        refreshToken: data.refreshToken,
                        expiry: data.expiresIn, // Uncertain longterm about using this but keeping it in the code for now if I do end up strongly needing it
                        userID: data.localId
                    });
                // If invalid
                // Return promise login error
                if (!res.ok) reject(new Error(data));
            });
        })
        .catch((err) => {
            console.log(err);
        });
};
export const autoRefresh = function ({ refreshToken, expiry }, setAuth) {
    console.log(`autoRefresh(refreshToken) -- ${refreshToken}`);
    console.log(`autoRefresh(_,ttl) -- ${expiry}`);
    const timeLeft = expiry / 1000;
    console.log(`autoRefresh() -- timeLeft: ${timeLeft}s`);
    // if (expiry < 1000000) expiry = 1000000;
    refreshTimer = setTimeout(function (refreshToken) {
        console.log("Timeout complete, refreshing session...");
        refreshSession(refreshToken, setAuth);
    }, expiry);
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
            // Redirect to home
            // redirect logic here
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
};
