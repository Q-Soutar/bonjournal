// React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// App files
import AuthContext from "./AuthContext";
import { getNewToken, authInit, startSession, logout } from "../Utils/Auth";

const AuthProvider = function (props) {
    const [token, setToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userID, setUserID] = useState(null);
    const navigate = useNavigate();
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

    useEffect(() => {
        authInit(setAuth);
    }, []);

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
    const logoutHandler = function () {
        setAuth();
        logout().then((tokensCleared) => {
            if (tokensCleared) navigate("/");
        });
    };

    const sessionInitHandler = function (newToken) {
        startSession(newToken, setAuth);
    };

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
