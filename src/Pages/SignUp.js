// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// App files
import Account from "../Components/Account/Account";
import AuthContext from "../Context/AuthContext";
import { authCreateUserFull } from "../Utils/DatabaseUser";

const SignUp = function () {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const signUpSubmitHandler = function (userData) {
        authCreateUserFull(userData).then((token) => {
            authCtx.sessionInit(token, true);
        });
    };
    const [accountInfo, setAccountInfo] = useState({ username: "" });
    const updateAccountInfo = function (field, value) {
        setAccountInfo({
            ...accountInfo,
            [field]: value
        });
    };
    const cancelHandler = function () {
        navigate("/login");
    };

    useEffect(() => {
        if (authCtx.token) navigate("/home");
    }, [authCtx.token]);

    return (
        <Account
            signUp="true"
            mode="SIGNUP"
            editMode="true"
            submitHandler={signUpSubmitHandler}
            updateAccountInfo={updateAccountInfo}
            cancelHandler={cancelHandler}
            accountInfo={accountInfo}
        />
    );
};

export default SignUp;
