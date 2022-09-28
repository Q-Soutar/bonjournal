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

// For reasons beyond me the flexbox would not align it, so I positioned it more forcibly.
const StyledProfile = styled(Box)(({ theme }) => ({
    display: "flex",
    maxWidth: "40vw",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifySelf: "center",
    margin: "50vh auto 0",
    transform: "translateY(-50%)"
}));

//  ? Maybe changing the profile info line items into components in their own right?

const Profile = function () {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = function () {
        setEditMode(!editMode);
    };
    const [accountInfo, setAccountInfo] = useState({ username: "" });
    const [accountRevert, setAccountRevert] = useState({ username: "" });
    const updateAccountInfo = function (field, value) {
        setAccountInfo({
            ...accountInfo,
            [field]: value
        });
    };
    const cancelHandler = function () {
        setAccountInfo(accountRevert);
    };
    const submitHandler = function (accountInfo) {
        if (accountRevert.userEmail !== accountInfo.userEmail) {
            dbEditUserDataFull(authCtx.userID, authCtx.token, accountInfo)
                .then((newToken) => {
                    authCtx.sessionInit(newToken.token);
                    toggleEditMode();
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            dbEditUserDataPartial(authCtx.userID, authCtx.token, accountInfo)
                .then(() => {
                    accountInit();
                    toggleEditMode();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const accountInit = function () {
        if (authCtx.token) {
            dbGetUserData(authCtx.userID, authCtx.token).then((data) => {
                setAccountInfo(data);
                setAccountRevert(data);
            });
        } else {
            navigate("/login");
        }
    };

    useEffect(accountInit, [authCtx.token]);

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
            />
        </Box>
    );
};

export default Profile;
