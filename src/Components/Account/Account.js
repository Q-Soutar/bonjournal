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
import { useNavigate } from "react-router-dom";

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

const Account = function ({ mode, submitHandler }) {
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(mode === "SIGNUP" ? true : false);
    console.log(`<Account/> -> editMode at start: ${editMode}`);
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
        toggleEditMode();
        setAccountInfo(accountRevert);
        if (mode === "SIGNUP") navigate("/login");
    };

    const handleTyping = function (e) {
        updateAccountInfo(e.target.id, e.target.value);
    };

    const submitHandlerWrapper = function (e) {
        submitHandler(accountInfo);
    };

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
                        {accountInfo.username !== undefined && (
                            <Grid2 container spacing={2}>
                                <Grid2 xs={10}>
                                    {editMode ? (
                                        <Box>
                                            <TextField
                                                id="userFirstName"
                                                value={
                                                    accountInfo.userFirstName
                                                }
                                                onChange={handleTyping}
                                            />
                                            <TextField
                                                id="userLastName"
                                                value={accountInfo.userLastName}
                                                onChange={handleTyping}
                                            />
                                        </Box>
                                    ) : (
                                        <Typography variant="h4">
                                            {`${accountInfo.userFirstName} ${accountInfo.userLastName}`}
                                        </Typography>
                                    )}
                                </Grid2>
                                <Grid2 xs={1}>
                                    {editMode && (
                                        <IconButton
                                            onClick={submitHandlerWrapper}
                                        >
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
                                            id="username"
                                            value={accountInfo.username}
                                            onChange={handleTyping}
                                        />
                                    ) : (
                                        <Typography>
                                            {accountInfo.username}
                                        </Typography>
                                    )}
                                </Grid2>
                                <Grid2 xs={6}>
                                    <Typography>Email Address: </Typography>
                                </Grid2>
                                <Grid2 xs={6}>
                                    {editMode ? (
                                        <TextField
                                            id="userEmail"
                                            value={accountInfo.userEmail}
                                            onChange={handleTyping}
                                        />
                                    ) : (
                                        <Typography>
                                            {accountInfo.userEmail}
                                        </Typography>
                                    )}
                                </Grid2>
                                <Grid2 xs={6}>
                                    <Typography>
                                        Password (NOT YET IMPLEMENTED)
                                    </Typography>
                                </Grid2>
                                <Grid2 xs={6}>
                                    {editMode ? (
                                        <TextField
                                            id="password"
                                            value={accountInfo.password}
                                            onChange={handleTyping}
                                        />
                                    ) : (
                                        <Link href="#" underline="hover">
                                            Reset
                                        </Link>
                                    )}
                                </Grid2>
                            </Grid2>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </StyledProfile>
    );
};

export default Account;
