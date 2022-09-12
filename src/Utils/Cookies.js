const TOKEN_TTL = 3600; // 1 hour, 60*60, per Firebase docs
const MAX_SESSION_LENGTH = 2592000; // 30 days, 60*60*24*30, chosen semi-arbitrarily.

export const storeToken = function (tokenData) {
    // For educational purposes, will continue developng this version until the logic works; then, move it over to a package for safety reasons.
    const tokenCookie = `token=${tokenData.token}; max-age=${TOKEN_TTL}; secure`;
    const refreshCookie = `refresh_token=${tokenData.refreshToken}; max-age=${MAX_SESSION_LENGTH}; secure`;
    const expiry = `expiry=${new Date(
        new Date().getTime() + +tokenData.expiry * 1000
    )}; max-age=${TOKEN_TTL}; secure`;
    const userID = `user_id=${tokenData.userID}; max-age=${TOKEN_TTL}; secure`;
    document.cookie = tokenCookie;
    document.cookie = refreshCookie;
    document.cookie = expiry;
    document.cookie = userID;
    return new Promise(function (resolve, reject) {
        resolve(tokenData);
    });
};

export const getStoredTokens = function () {
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
    return {
        token: cookies.token ? cookies.token : undefined,
        refreshToken: cookies.refresh_token ? cookies.refresh_token : undefined,
        expiry: cookies.expiry ? cookies.expiry : undefined,
        userID: cookies.user_id ? cookies.user_id : undefined
    };
};

export const clearTokens = function () {
    const tokenCookie = `token=; max-age=-1; secure`;
    const refreshCookie = `refresh_token=; max-age=-1; secure`;
    const expiry = `expiry=; max-age=-1; secure`;
    const userID = `user_id=; max-age=-1; secure`;
    document.cookie = tokenCookie;
    document.cookie = refreshCookie;
    document.cookie = expiry;
    document.cookie = userID;
};
