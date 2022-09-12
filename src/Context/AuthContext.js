import { createContext } from "react";

const AuthContext = createContext({
    token: "",
    tokenExpireDate: "",
    sessionTimeoutDate: "",
    refreshToken: "",
    userID: "",
    signIn: () => {},
    signOut: () => {},
    sessionInit: () => {}
});

export default AuthContext;
