// React
import { Card, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// App files
import Account from "../Components/Account/Account";
import AuthContext from "../Context/AuthContext";
import { authCreateUserFull } from "../Utils/DatabaseUser";
import validator from "email-validator";

// Default state for the account
const defaultAccount = {
    userFirstName: "",
    userLastName: "",
    userEmail: "",
    username: "",
    password: ""
};

// Default state for formValidity
const defaultFormValidity = {
    userEmail: false,
    password: false,
    userFirstName: false,
    userLastName: false,
    username: false,
    submitAttempt: false
};
const defaultFormError = true;

// Form for creating a new account
const SignUp = function () {
    // State & friends
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    // Create a new user from form data
    const signUpSubmitHandler = function (userData) {
        // Validate
        if (formError) {
            formSubmitError();
            return;
        }
        //  Firebase call
        authCreateUserFull(userData).then((token) => {
            // State a new session with that info
            authCtx.sessionInit(token, true);
        });
    };
    const [accountInfo, setAccountInfo] = useState(defaultAccount);
    const [formValidity, setFormValidity] = useState(defaultFormValidity);
    const [formError, setFormError] = useState(defaultFormError);

    // Update form state from field changes
    const updateAccountInfo = function (field, value) {
        console.log();
        setAccountInfo({
            ...accountInfo,
            [field]: value
        });
        setFormValidity({
            ...formValidity,
            [field]: checkField(field, value)
        });
    };
    // Cancel signup process
    const cancelHandler = function () {
        // Back to login
        navigate("/login");
    };

    const checkField = function (field, value) {
        switch (field) {
            case "userEmail":
                return checkEmail(value);
            case "password":
                return checkPassword(value);
            case "userFirstName":
                return checkUserFirstName(value);
            case "userLastName":
                return checkUserLastName(value);
            case "username":
                return checkUsername(value);
        }
    };
    const checkEmail = function (value) {
        return validator.validate(value);
    };
    const checkPassword = function (value) {
        /*
            Validation: 
                1. 1 char
                2. 1 num
                3. Min length 7
        */
        const char = /[a-zA-Z]/.test(value);
        const num = /\d/.test(value);
        const length = value.length > 6;
        return char && num && length;
    };
    const checkUserFirstName = function (value) {
        /*
            Validation: 
                1. length > 0
        */
        return value.length > 0;
    };
    const checkUserLastName = function (value) {
        /*
            Validation: 
                1. length > 0
        */
        return value.length > 0;
    };
    const checkUsername = function (value) {
        /*
            Validation: 
                1. length > 0
                2. 1 num
                3. 1 char
        */
        const char = /[a-zA-Z]/.test(value);
        const num = /\d/.test(value);
        const length = value.length > 6;
        return char && num && length;
    };
    const checkFormError = function () {
        const errors = Object.values(formValidity).every(
            (value) => value === true
        );
        setFormError(!errors);
    };
    const formSubmitError = function () {
        setFormValidity({
            ...formValidity,
            submitAttempt: true
        });
    };

    // Basically here to make sure logged in users don't end up on this page
    useEffect(() => {
        if (authCtx.token) navigate("/home");
    }, [authCtx.token]);

    useEffect(checkFormError, [formValidity]);

    return (
        <Card>
            <Account
                signUp="true"
                mode="SIGNUP"
                editMode="true"
                submitHandler={signUpSubmitHandler}
                updateAccountInfo={updateAccountInfo}
                cancelHandler={cancelHandler}
                accountInfo={accountInfo}
                formValidity={formValidity}
                formError={formError}
                password={true}
            />
        </Card>
    );
};

export default SignUp;
