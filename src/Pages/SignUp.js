import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Account from "../Components/Account/Account";
import AuthContext from "../Context/AuthContext";
import { authCreateUserFull } from "../Utils/Database";

const SignUp = function () {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const signUpSubmitHandler = function (userData) {
        authCreateUserFull(userData).then((token) => {
            authCtx.sessionInit(token, true);
        });
    };

    useEffect(() => {
        if (authCtx.token) navigate("/home");
    }, [authCtx.token]);

    return (
        <Account
            signUp="true"
            mode="SIGNUP"
            submitHandler={signUpSubmitHandler}
        />
    );
};

export default SignUp;
