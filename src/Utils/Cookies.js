const TOKEN_TTL = 3600; // 1 hour, 60*60, per Firebase docs
const MAX_SESSION_LENGTH = 2592000; // 30 days, 60*60*24*30, chosen semi-arbitrarily.

export const storeToken = function (tokenData) {
    // Convert token data to cookie strings
    // console.log(`storeToken() ----> storing token in browser cookies...`);
    const tokenCookie = `token=${tokenData.token}; max-age=${TOKEN_TTL}; secure`;
    const refreshCookie = `refresh_token=${tokenData.refreshToken}; max-age=${MAX_SESSION_LENGTH}; secure`;
    const expiry = `expiry=${new Date(
        tokenData.expiry * 1000 + Date.now()
    )}; max-age=${TOKEN_TTL}; secure`;
    const userID = `user_id=${tokenData.userID}; max-age=${TOKEN_TTL}; secure`;
    // console.log(
    //     `storeToke() ----> Trying to get the dates to work. I hate everything.`
    // );
    // console.log(`Expiry: ${expiry}`);
    // write strings to cookie storage
    document.cookie = tokenCookie;
    document.cookie = refreshCookie;
    document.cookie = expiry;
    document.cookie = userID;
    return new Promise(function (resolve, reject) {
        resolve(tokenData);
        // reject("Error");
    });
};

export const retrieveTokens = function () {
    // Get cookies from storage
    // Parse cookies
    // console.log(`retrieveTokens ----> Retrieving and parsing cookies`);
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
    // console.log(
    //     `retrieveTokens ----> cookies parsed: ${JSON.stringify(cookies)}`
    // );
    // console.log(`retrieveTokens() ----> cookies.expiry: ${cookies.expiry}`);
    const expiryNewDateGetTime = new Date(cookies.expiry).getTime();
    const expiryInMiliseconds = expiryNewDateGetTime - Date.now();
    const expiryInMiliseconds2 =
        new Date(cookies.expiry).getTime() - Date.now();
    // console.log(
    //     `retrieveTokens() ----> Token good for ${
    //         expiryInMiliseconds / 1000 / 60
    //     } minutes`
    // );
    // console.log(
    //     `retrieveTokens() ----> isNaN(cookies.expiry): ${isNaN(cookies.expiry)}`
    // );
    // console.log(
    //     `retrieveTokens() ----> expiryInMiliseconds: ${expiryInMiliseconds}`
    // );
    // console.log(
    //     `retrieveTokens() ----> expiryInMiliseconds2: ${expiryInMiliseconds2}`
    // );
    // console.log(
    //     `retrieveTokens() ----> cookies.refresh_token: ${cookies.refresh_token}`
    // );
    const storedToken = {
        token: cookies.token ? cookies.token : undefined,
        expiry: new Date(cookies.expiry).getTime() - Date.now(),
        refreshToken: cookies.refresh_token ? cookies.refresh_token : undefined,
        userID: cookies.user_id ? cookies.user_id : undefined
    };
    // console.log(`retrieveTokens() ----> storedToken: `);
    // console.log(storedToken);
    // Return promise authCtx object?
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
