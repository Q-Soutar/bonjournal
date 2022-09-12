import { storeToken, getStoredTokens, clearTokens } from "./Cookies";

const email = "stratton.soutar@gmail.com";
const password = "test123";
const signInBaseURL = "https://identitytoolkit.googleapis.com/v1/";
const refreshBaseURL = "https://securetoken.googleapis.com/v1/";
const signInPath = "accounts:signInWithPassword?key=";
const refreshPath = "token?key=";
const API_KEY = "AIzaSyCHDtn6M4QZ1XbL50d1HDFxK4ZrjvkQWUs";
const TOKEN_TTL = 3600; // 1 hour, 60*60, per Firebase docs
const MAX_SESSION_LENGTH = 2592000; // 30 days, 60*60*24*30, chosen semi-arbitrarily.

let refreshTimer;

export const getNewToken = function (email, password) {
    console.log("Retrieving Token...");
    return fetch(`${signInBaseURL}${signInPath}${API_KEY}`, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        }),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => {
            const data = res.json();
            console.log("Response received: " + data);
            if (res.ok) return data;
            if (!res.ok) throw new Error(data);
        })
        .then((data) => {
            // It's probably better to move this up into the prior .then() and have the error throw be the reject function instead.
            console.log("Passing on data...");
            return new Promise(function (resolve, reject) {
                // autoRefresh(data.refresh_token, data.expiresIn);
                resolve({
                    token: data.idToken,
                    refreshToken: data.refreshToken,
                    expiry: data.expiresIn, // Uncertain longterm about using this but keeping it in the code for now if I do end up strongly needing it
                    userID: data.localId
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

export const initAuth = function (setToken, setRefreshToken, setUserID) {
    // 1 Check if the token is still valid
    console.log("Initializing session...");
    const tokens = getStoredTokens();
    console.log("Retrieving existing tokens...");
    console.dir(tokens);
    const curTime = new Date().getTime();
    console.log("Calculating remaining session time: ");
    console.log(`Current time: ${curTime}`);
    // if (typeof tokens.expiry === 'number') const expTime = new Date(tokens.expiry).getTime();
    const expTime =
        typeof new Date(tokens.expiry).getTime() === "number"
            ? new Date(tokens.expiry).getTime()
            : 0;
    console.log(`Expiration time: ${expTime}`);
    console.log(tokens.expiry);
    console.log(new Date(tokens.expiry));
    console.log(new Date(tokens.expiry).getTime());
    console.log();
    const ttl = expTime - curTime;
    console.log(`Time To Live: ${ttl}`);
    // 2 If valid, set token state to this and set the refresh timer
    console.log("Refresh token presence: ");
    console.log(!!tokens.refreshToken);
    if (ttl > 10) {
        console.log(`TTL over 10 seconds, resuming prior session...`);
        console.log(`initAuth() -- Seeting token to: ${tokens.token}`);
        console.log(tokens.token);
        setToken(tokens.token);
        setRefreshToken(tokens.refreshToken);
        setUserID(tokens.userID);
        autoRefresh(tokens.refreshToken, ttl);
        return;
    } else if (ttl <= 10 && tokens.refreshToken) {
        // 3 If invalid, set to null (????)
        // 4 Check if refresh token is present
        console.log(`TTL under 10 seconds, refreshing session...`);
        // 5 If present, use to get a new token
        refreshSession(tokens.refreshToken).then((tokenData) =>
            storeToken(tokenData)
        );
    } else {
        // 6 Failing all of the above, land the user on the login screen
        console.log(`User not logged in, clearing session data...`);
        clearTokens();
        setToken(null);
        setRefreshToken(null);
        setUserID(null);
        console.log(`Session data cleared.`);
    }
};

// Need to fix calling itself with the TTL being basically absent
export const refreshSession = function (refreshToken) {
    // Leaving this param here in case I discover why I put it here in the first place
    const refresh = document.cookie
        .split(";")
        .find((cookie) => cookie.startsWith("refresh_token"))
        ?.split("=")[1];

    // To some deeply madness-inducing ends, I learned that fetch() does not have any elegant way of handling form data.
    const body = {
        grant_type: "refresh_token",
        refresh_token: refreshToken
    };
    const formBody = Object.keys(body)
        .map(
            (key) =>
                encodeURIComponent(key) + "=" + encodeURIComponent(body[key])
        )
        .join("&");
    fetch(`${refreshBaseURL}${refreshPath}${API_KEY}`, {
        method: "POST",
        body: formBody,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then((res) => {
            const data = res.json();
            if (res.ok) return data;
            if (!res.ok) throw new Error(data);
        })
        .then((data) => {
            console.log(`Refresh interval: ${data.expiresIn}`);
            return new Promise(function (resolve, reject) {
                autoRefresh(data.refresh_token, data.expiresIn);
                resolve({
                    token: data.idToken,
                    refreshToken: data.refreshToken,
                    expiry: data.expiresIn, // Uncertain longterm about using this but keeping it in the code for now if I do end up strongly needing it
                    userID: data.localId
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

// Still wobbly
export const autoRefresh = function (refreshToken, ttl) {
    console.log(`autoRefresh(refreshToken) -- ${refreshToken}`);
    console.log(`autoRefresh(_,ttl) -- ${ttl}`);
    const timeLeft = ttl * 1000;
    console.log(`autoRefresh() -- timeLeft: ${timeLeft}`);
    if (ttl < 1000000) ttl = 1000000;
    refreshTimer = setTimeout(
        function (refreshToken) {
            console.log("Timeout complete, refreshing session...");
            refreshSession(refreshToken);
        },
        ttl,
        refreshToken
    );
};

// Promisification framework
export const promAuthInit = function (setAuth) {
    console.log(`>=====< promAuthInit() >=====<`);
    console.log(`promAuthInit() ----> beginning auth initialization`);
    console.log(`promAuthInit() ----> Defining restoreSession()`);
    const restoreSession = function (token) {
        promStoreToken(token);
        setAuth(token);
        // promAutoRefresh(token);
    };
    console.log(`promAuthInit() ----> restoreSession() defined:`);
    console.dir(restoreSession);
    console.log(`promAuthInit() ----> Defining refreshSession()`);
    const refreshSession = function ({ refreshToken }) {
        promUseRefreshToken(refreshToken);
    };
    console.log(`promAuthInit() ----> restoreSession() defined:`);
    console.dir(restoreSession);
    // Check storage
    console.log(`promAuthInit() ----> Checking local storage`);
    promRetrieveTokens()
        .then((storedToken) => {
            // If token present
            console.log(
                `promAuthInit() ----> promRetrieveTokens().then() ----> checking for existing token`
            );
            return new Promise((resolve, reject) => {
                console.log(
                    `promAuthInit() ----> promRetrieveTokens().then() ----> checking for existing token`
                );

                if (storedToken.token !== undefined) {
                    console.log(
                        `promAuthInit() ----> promRetrieveTokens().then() ----> Token found, resolving promise`
                    );
                    console.log(
                        `promAuthInit() ----> promRetrieveTokens().then() ----> storedToken: `
                    );
                    console.dir(storedToken);
                    resolve({ token: storedToken });
                } else {
                    console.log(
                        `promAuthInit() ----> promRetrieveTokens().then() ----> No token found, rejecting promise`
                    );
                    reject(null);
                }
            });
        })
        .then(
            (token) => {
                // Check token validity
                const tokenValidity = checkTokenValidity(token);
                // If valid
                // Set LoggedIn state to true (?)
                // Write authCtx variables
                // Redirect to home page
                if (tokenValidity) restoreSession(token);
                // If invalid
                // Use refresh token
                // Store new token data
                if (!tokenValidity) refreshSession(token);
            },
            () => {
                console.log(
                    "promAuthInit() ----> promRetrieveTokens().then().then() ----> Promise rejected, no token found, defaulting auth state..."
                );
                setAuth();
                promClearStoredTokens();
            }
        )
        .catch((err) => {
            console.error(
                `promAuthInit() ----> promRetrieveTokens() ----> Error occured: `,
                err
            );
        });
    // Set loggedIn state to true
    // Write authCtx variables
    // Redirect to home page
    // If token absent
    // Redirect to login
    const checkTokenValidity = function ({ expiry }) {
        const curTime = new Date().getTime();
        const expTime =
            typeof new Date(expiry).getTime() === "number"
                ? new Date(expiry).getTime()
                : 0;
        const ttl = expTime - curTime;
        // 2 If valid, set token state to this and set the refresh timer
        if (ttl > 10) {
            return true;
        } else if (ttl <= 10) {
            return false;
            // 3 If invalid, set to null (????)
            // 4 Check if refresh token is present
            // 5 If present, use to get a new token
        } else {
            // 6 Failing all of the above, land the user on the login screen
            throw new Error("Ruhroh");
        }
    };
};

export const startSession = function (token, setAuth) {
    setAuth(token);
    promStoreToken(token);
};

export const promGetNewToken = function (email, password) {
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
            // Check if a valid token was returned
            const data = res.json();
            return new Promise(function (resolve, reject) {
                // If valid
                // Return promise true
                if (res.ok)
                    resolve({
                        token: data.idToken,
                        refreshToken: data.refreshToken,
                        expiry: data.expiresIn,
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
export const promUseRefreshToken = function (refreshToken) {
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
export const promAutoRefresh = function () {
    // Set timeout
    // After timeout, execute promUseRefresh
    // Then chain autoRefresh onto that
    // = function (refreshToken, ttl) {
    //     console.log(`autoRefresh(refreshToken) -- ${refreshToken}`);
    //     console.log(`autoRefresh(_,ttl) -- ${ttl}`);
    //     const timeLeft = ttl * 1000;
    //     console.log(`autoRefresh() -- timeLeft: ${timeLeft}`);
    //     if (ttl < 1000000) ttl = 1000000;
    //     refreshTimer = setTimeout(
    //         function (refreshToken) {
    //             console.log("Timeout complete, refreshing session...");
    //             refreshSession(refreshToken);
    //         },
    //         ttl,
    //         refreshToken
    //     );
    // };
};

export const promStoreToken = function (tokenData) {
    // Convert token data to cookie strings
    const tokenCookie = `token=${tokenData.token}; max-age=${TOKEN_TTL}; secure`;
    const refreshCookie = `refresh_token=${tokenData.refreshToken}; max-age=${MAX_SESSION_LENGTH}; secure`;
    const expiry = `expiry=${new Date(
        new Date().getTime() + +tokenData.expiry * 1000
    )}; max-age=${TOKEN_TTL}; secure`;
    const userID = `user_id=${tokenData.userID}; max-age=${TOKEN_TTL}; secure`;
    // write strings to cookie storage
    document.cookie = tokenCookie;
    document.cookie = refreshCookie;
    document.cookie = expiry;
    document.cookie = userID;
    return new Promise(function (resolve, reject) {
        resolve(tokenData);
        reject("Error");
    });
};
export const promRetrieveTokens = function () {
    // Get cookies from storage
    // Parse cookies
    const cookies = document.cookie
        .split(";")
        .map((cookie) => cookie.trim())
        .map((cookie) => {
            return cookie.split("=");
        })
        .reduce((allCookies, thisCookie) => {
            const newAllCookies = {
                ...allCookies,
                [thisCookie[0]]: thisCookie[1]
            };
            return newAllCookies;
        }, {});
    // Return promise authCtx object?
    return new Promise(function (resolve, reject) {
        resolve({
            token: cookies.token ? cookies.token : undefined,
            refreshToken: cookies.refresh_token
                ? cookies.refresh_token
                : undefined,
            expiry: cookies.expiry ? cookies.expiry : undefined,
            userID: cookies.user_id ? cookies.user_id : undefined
        });
        reject("Error");
    });
};
export const promClearStoredTokens = function () {
    // Write blank values to cookies
    const tokenCookie = `token=; max-age=-1; secure`;
    const refreshCookie = `refresh_token=; max-age=-1; secure`;
    const expiry = `expiry=; max-age=-1; secure`;
    const userID = `user_id=; max-age=-1; secure`;
    document.cookie = tokenCookie;
    document.cookie = refreshCookie;
    document.cookie = expiry;
    document.cookie = userID;
};

export const promLogin = function (email, password) {
    // Send token request
    promGetNewToken(email, password)
        .then((token) => {
            if (!token) throw new Error("Not token received!");
            // If valid
            // Store token
            // Write authCtx somehow
            // Look into non-chained .then() statements
            return promStoreToken(token);
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
export const promLogout = function () {
    // Clear tokens
    // Redirect to login page
};
