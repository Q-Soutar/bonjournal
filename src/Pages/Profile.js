import {
    Card,
    Box,
    Typography,
    styled,
    CardContent,
    Link,
    IconButton,
    TextField
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../Context/AuthContext";
import {
    dbEditUserDataFull,
    dbGetUserData,
    dbEditUserDataPartial
} from "../Utils/DatabaseUser";
import { startSession } from "../Utils/Auth";

// For reasons beyond me the flexbox would not align it, so I hijacked
const StyledProfile = styled(Box)(({ theme }) => ({
    display: "flex",
    maxWidth: "40vw",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifySelf: "center",
    margin: "50vh auto 0",
    transform: "translateY(-50%)"
    // margin: "25vh",
    // width: "100%"
}));

//  ? Maybe changing the profile info line items into components in their own right?

const testData = {
    name: "Quinn Soutar",
    username: "qsoutar1",
    email: "stratton.soutar@gmail.com"
};

const Profile = function () {
    const authCtx = useContext(AuthContext);
    const [signUpMode, setSignUpMode] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const toggleEditMode = function () {
        setEditMode(!editMode);
    };
    const [profileInfo, setProfileInfo] = useState({ username: "" });
    const [profileRevert, setProfileRevert] = useState({ username: "" });
    const updateProfileInfo = function (field, value) {
        setProfileInfo({
            ...profileInfo,
            [field]: value
        });
    };
    const cancelHandler = function () {
        toggleEditMode();
        setProfileInfo(profileRevert);
    };
    const submitHandler = function () {
        console.log("Pretend this does something");
        // if the email changes, do a full edit
        // If the email is unchanged, do a partial edit
        // Pass in complete user info object
        // If full, also update context
        console.log(
            `<Profile/> -> submitHandler() -> profileRevert.userEmail: ${profileRevert.userEmail}`
        );
        console.log(
            `<Profile/> -> submitHandler() -> profileInfo.userEmail: ${profileInfo.userEmail}`
        );
        console.log(
            `<Profile/> -> submitHandler() -> profileRevert.userEmail !== profileInfo.userEmail: ${
                profileRevert.userEmail !== profileInfo.userEmail
            }`
        );
        if (profileRevert.userEmail !== profileInfo.userEmail) {
            console.log(
                `<Profile/> -> submitHandler() -> emails don't match, executing complete update`
            );
            dbEditUserDataFull(authCtx.userID, authCtx.token, profileInfo)
                .then((newToken) => {
                    console.log(
                        `<Profile/> -> submitHandler() -> dbEditUserDataFull.then() -> newToken: `
                    );
                    console.log(newToken);
                    authCtx.sessionInit(newToken.token);
                    toggleEditMode();
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            console.log(
                `<Profile/> -> submitHandler() -> emails match, executing partial update`
            );
            dbEditUserDataPartial(authCtx.userID, authCtx.token, profileInfo)
                .then(() => {
                    profileInit();
                    toggleEditMode();
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
    const handleTypingUsername = function (e) {
        console.log(e.target);
        updateProfileInfo("username", e.target.value);
    };
    const handleTypingFirstName = function (e) {
        updateProfileInfo("userFirstName", e.target.value);
    };
    const handleTypingLastName = function (e) {
        updateProfileInfo("userLastName", e.target.value);
    };
    // const handleTypingName = function(e) {
    //     updateProfileInfo(username, e.target.value);
    // }
    const handleTypingUserEmail = function (e) {
        updateProfileInfo("userEmail", e.target.value);
    };

    const profileInit = function () {
        if (authCtx.token) {
            dbGetUserData(authCtx.userID, authCtx.token).then((data) => {
                setProfileInfo(data);
                setProfileRevert(data);
            });
        }
        // else if (props.signUp) {
        //     // ???
        //     console.log(`Registration mode`);
        //     setProfileInfo({
        //         userFirstName: "",
        //         userLastName: "",
        //         userEmail: "",
        //         username: "",
        //         password: ""
        //     });
        //     setSignUpMode(true);
        // }
    };

    useEffect(profileInit, [authCtx.token]);

    return (
        <StyledProfile>
            <Box display="flex">
                <Card>
                    <CardContent
                        sx={{
                            margin: "50px",
                            width: "50vw"
                        }}
                    >
                        {profileInfo.username && (
                            <Grid2 container spacing={2}>
                                <Grid2 xs={10}>
                                    {editMode ? (
                                        <Box>
                                            <TextField
                                                value={
                                                    profileInfo.userFirstName
                                                }
                                                onChange={handleTypingFirstName}
                                            />
                                            <TextField
                                                value={profileInfo.userLastName}
                                                onChange={handleTypingLastName}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography variant="h4">
                                            {`${profileInfo.userFirstName} ${profileInfo.userLastName}`}
                                        </Typography>
                                    )}
                                </Grid2>
                                <Grid2 xs={1}>
                                    {editMode && (
                                        <IconButton onClick={submitHandler}>
                                            <SaveIcon />
                                        </IconButton>
                                    )}
                                </Grid2>
                                <Grid2 xs={1}>
                                    {!editMode && (
                                        <IconButton onClick={toggleEditMode}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {editMode && (
                                        <IconButton onClick={cancelHandler}>
                                            <CloseIcon />
                                        </IconButton>
                                    )}
                                </Grid2>
                                <Grid2 xs={12}>
                                    <Typography variant="h5">
                                        Account Details
                                    </Typography>
                                </Grid2>
                                <Grid2 xs={6}>
                                    <Typography>Username: </Typography>
                                </Grid2>
                                <Grid2 xs={6}>
                                    {editMode ? (
                                        <TextField
                                            id="usernameField"
                                            value={profileInfo.username}
                                            onChange={handleTypingUsername}
                                        />
                                    ) : (
                                        <Typography>
                                            {profileInfo.username}
                                        </Typography>
                                    )}
                                </Grid2>
                                <Grid2 xs={6}>
                                    <Typography>Email Address: </Typography>
                                </Grid2>
                                <Grid2 xs={6}>
                                    {editMode ? (
                                        <TextField
                                            value={profileInfo.userEmail}
                                            onChange={handleTypingUserEmail}
                                        />
                                    ) : (
                                        <Typography>
                                            {profileInfo.userEmail}
                                        </Typography>
                                    )}
                                </Grid2>
                                <Grid2 xs={6}>
                                    <Typography>
                                        Password (NOT YET IMPLEMENTED)
                                    </Typography>
                                </Grid2>
                                <Grid2 xs={6}>
                                    <Link href="#" underline="hover">
                                        Reset
                                    </Link>
                                </Grid2>
                            </Grid2>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </StyledProfile>
    );
};

export default Profile;
