const TOKEN_TTL = 3600; // 1 hour, 60*60, per Firebase docs
const MAX_SESSION_LENGTH = 2592000; // 30 days, 60*60*24*30, chosen semi-arbitrarily.

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
        resolve(tokenData);
    });
};

export const retrieveTokens = function () {
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
    const storedToken = {
        token: cookies.token ? cookies.token : undefined,
        expiry: new Date(cookies.expiry).getTime() - Date.now(),
        refreshToken: cookies.refresh_token ? cookies.refresh_token : undefined,
        userID: cookies.user_id ? cookies.user_id : undefined
    };
    return new Promise(function (resolve, reject) {
        resolve(storedToken);
    });
};

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
