import { TOKEN_TTL, MAX_SESSION_LENGTH } from "./Config";

// Store received token in browser cookies
export const storeToken = function (tokenData) {
    const { token, refreshToken, expiry, userID } = tokenData;
    // Convert token data to cookie strings
    const tokenCookie = `token=${token}; max-age=${TOKEN_TTL}; secure`;
    const refreshCookie = `refresh_token=${refreshToken}; max-age=${MAX_SESSION_LENGTH}; secure`;
    const expiryCookie = `expiry=${new Date(
        expiry + Date.now()
    )}; max-age=${TOKEN_TTL}; secure`;
    const userIDCookie = `user_id=${userID}; max-age=${TOKEN_TTL}; secure`;
    // write strings to cookie storage
    document.cookie = tokenCookie;
    document.cookie = refreshCookie;
    document.cookie = expiryCookie;
    document.cookie = userIDCookie;
    return new Promise(function (resolve, reject) {
        // Reoslve promise, pass along the token data
        resolve(tokenData);
    });
};
// Get any tokens from the browser storage
export const retrieveTokens = function () {
    // Pull the cookies out, split them apart into constitutent cookies / fields
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
    // Merge tokens into a coherent token object
    const storedToken = {
        token: cookies.token ? cookies.token : undefined,
        expiry: new Date(cookies.expiry).getTime() - Date.now(),
        refreshToken: cookies.refresh_token ? cookies.refresh_token : undefined,
        userID: cookies.user_id ? cookies.user_id : undefined
    };
    return new Promise(function (resolve, reject) {
        // Resolve with the retrieved token
        resolve(storedToken);
    });
};
// Clear any tokens stored in the browser
export const clearStoredTokens = function () {
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
