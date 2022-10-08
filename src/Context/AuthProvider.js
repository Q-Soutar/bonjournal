// React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// App files
import AuthContext from "./AuthContext";
import { getNewToken, authInit, startSession, logout } from "../Utils/Auth";

// App-wide auth state
const AuthProvider = function (props) {
    // State & friends
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userID, setUserID] = useState(null);
    const navigate = useNavigate();
    // Update current authnetication info based on a token param
    const setAuth = function (tokenData) {
        if (tokenData) {
            const { token, refreshToken, userID } = tokenData;
            setToken(token);
            setRefreshToken(refreshToken);
            setUserID(userID);
            return;
        }
        setToken(null);
        setRefreshToken(null);
        setUserID(null);
    };

    // Receive credentials and use those to call firebase authentication functions
    const loginHandler = function (email, password) {
        return new Promise((resolve, reject) => {
            getNewToken(email, password)
                .then((token) => {
                    startSession(token, setAuth);
                    resolve(true);
                    navigate("/home");
                })
                .catch((err) => {
                    reject(false);
                    console.error(err);
                });
        });
    };
    // Logs the user out, wipes the tokens, "ends" the session (unless they're a lunatic backed those cookies up somewhere and manually replace them)
    const logoutHandler = function () {
        setAuth();
        logout().then((tokensCleared) => {
            if (tokensCleared) navigate("/");
        });
    };

    // Wrapper for initiating new user sessions based on received credentials.
    const sessionInitHandler = function (newToken) {
        startSession(newToken, setAuth);
    };

    // Hook to kick off auth state from the page load
    useEffect(() => {
        authInit(setAuth);
    }, []);

    const authValue = {
        token: token,
        tokenExpireDate: "",
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
