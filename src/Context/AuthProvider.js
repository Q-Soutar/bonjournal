// import { ErrorSharp } from "@mui/icons-material";
import { setRef } from "@mui/material";
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import {
    storeToken,
    getStoredTokens,
    clearStoredTokens
} from "../Utils/Cookies";
import {
    getNewToken,
    sessionInit,
    refreshSession,
    autoRefresh,
    authInit,
    startSession,
    logout
} from "../Utils/Auth";

const signInBaseURL = "https://identitytoolkit.googleapis.com/v1/";
const refreshBaseURL = "https://securetoken.googleapis.com/v1/";
const signInPath = "accounts:signInWithPassword?key=";
const refreshPath = "token?key=";
let refreshTimer;

const API_KEY = "AIzaSyCHDtn6M4QZ1XbL50d1HDFxK4ZrjvkQWUs";
const TOKEN_TTL = 3600; // 1 hour, 60*60, per Firebase docs
const MAX_SESSION_LENGTH = 2592000; // 30 days, 60*60*24*30, chosen semi-arbitrarily.

// ? Could be worth adding in a new "response parser" function to handle some of the repeat code. Frankly, need to make sure the promise chain even works at all before making those kinds of changes though.
// ? Might be worth looking into one-to-many promise handlers
// ? Would need to chart that out since bluntly I'm having a bit of trouble following this all just in my head at this point

// * Just gonna wing it from here and see how things go.

const AuthProvider = function (props) {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userID, setUserID] = useState(null);
    const setAuth = function ({
        token = null,
        refreshToken = null,
        userID = null
    }) {
        setToken(token);
        setRefreshToken(refreshToken);
        setUserID(userID);
    };

    useEffect(() => {
        authInit(setAuth);
    }, []);

    const loginHandler = function (email, password) {
        return new Promise((resolve, reject) => {
            console.log(`loginHandler() ----> Retrieving token`);
            getNewToken(email, password)
                .then((token) => {
                    startSession(token, setAuth);
                    resolve(true);
                })
                .catch((err) => {
                    reject(false);
                });
        });
    };
    const logoutHandler = function () {
        logout();
    };

    const sessionInitHandler = function () {
        // sessionInit(setToken, setRefreshToken, setUserID);
    };

    // useEffect(() => {
    //     sessionInit(setToken, setRefreshToken, setUserID);
    //     // sessionInitHandler();
    // }, []);

    useEffect(() => {
        console.log("Token updated: ");
        console.log(token);
    }, [token]);

    const authValue = {
        token: token,
        tokenExpireDate: "",
        // sessionTimeoutDate: "", Implement later
        refreshToken: refreshToken,
        userID: userID,
        signIn: loginHandler,
        signOut: logoutHandler,
        sessionInit: sessionInitHandler
    };

    return (
        <AuthContext.Provider value={authValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
