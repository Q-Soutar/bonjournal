// React
import { useContext, useEffect, useState } from "react";
// Material UI
import { Box, styled } from "@mui/material";
// App files
import AuthContext from "../Context/AuthContext";
import {
    dbEditUserDataFull,
    dbGetUserData,
    dbEditUserDataPartial
} from "../Utils/DatabaseUser";
import Account from "../Components/Account/Account";
import { useNavigate } from "react-router-dom";
import validator from "email-validator";

//  ? Maybe changing the profile info line items into components in their own right?

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
    password: true,
    userFirstName: false,
    userLastName: false,
    username: false,
    submitAttempt: false
};
const defaultFormError = true;

// Page to view and edit one's profile
const Profile = function () {
    // State & friends
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const [accountInfo, setAccountInfo] = useState(defaultAccount);
    const [accountRevert, setAccountRevert] = useState(defaultAccount);
    const [formValidity, setFormValidity] = useState(defaultFormValidity);
    const [formError, setFormError] = useState(defaultFormError);

    // Handle changes to the profile fields
    const updateAccountInfo = function (field, value) {
        setAccountInfo({
            ...accountInfo,
            [field]: value
        });
        setFormValidity({
            ...formValidity,
            [field]: checkField(field, value)
        });
    };
    const toggleEditMode = function () {
        setEditMode(!editMode);
    };
    // Reverts the component to a display view
    const cancelHandler = function () {
        // Clears out any changes made while in edit mode
        setAccountInfo(accountRevert);
    };
    // Gets user info from the databse
    const accountInit = function () {
        // Need a validation step to set the default state better
        // Must ignore passwords
        if (authCtx.token) {
            // Call the databse
            dbGetUserData(authCtx.userID, authCtx.token).then((data) => {
                // Write it to state
                setAccountInfo(data);
                // Revert data in case the user cancels an edit
                setAccountRevert(data);
            });
        } else {
            // If the user isn't logged in they're redirected to the login
            navigate("/login");
        }
    };
    // Write any changes to firebase
    const submitHandler = function (accountInfo) {
        if (formError) {
            formSubmitError();
            return;
        }
        // Need to see if the email changed, as this rather significantly alters the process
        if (accountRevert.userEmail !== accountInfo.userEmail) {
            // kicks off a full rewrite process
            dbEditUserDataFull(authCtx.userID, authCtx.token, accountInfo)
                .then((newToken) => {
                    // Has to refresh with a new session since the email was updated
                    authCtx.sessionInit(newToken.token);
                    // Revert to display
                    toggleEditMode();
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            // Simpler version with just one step
            dbEditUserDataPartial(authCtx.userID, authCtx.token, accountInfo)
                .then(() => {
                    // Refresh the account info from the db
                    accountInit();
                    // Revert to display
                    toggleEditMode();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
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
            Validation (if being changed): 
                1. 1 char
                2. 1 num
        */
        if (value.length > 0) {
            const char = /[a-zA-Z]/.test(value);
            const num = /\d/.test(value);
            const length = value.length > 6;
            return char && num && length;
        }
        return true;
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

    // Hook to fire off the init functions when the user arrives on the page.
    // Doubles as a refresh should the full account update happen (new token and all)
    useEffect(accountInit, [authCtx.token]);
    useEffect(checkFormError, [formValidity]);

    return (
        <Box>
            <Account
                submitHandler={submitHandler}
                mode="PROFILE"
                editMode={editMode}
                signUp="false"
                accountInfo={accountInfo}
                updateAccountInfo={updateAccountInfo}
                cancelHandler={cancelHandler}
                toggleEditMode={toggleEditMode}
                formValidity={formValidity}
                password={false}
            />
        </Box>
    );
};

export default Profile;
