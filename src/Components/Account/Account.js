// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Material UI
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
import { EditIcon, SaveIcon, CloseIcon } from "../../Utils/IndexIcons";
import Email from "./Email";
import Name from "./Name";
import Username from "./Username";
import Password from "./Password";
import AccountControls from "./AccountControls";

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

// Expects mode, one of: "DISPLAY", "EDIT", "SIGNUP"
const Account = function ({
    submitHandler,
    updateAccountInfo,
    cancelHandler,
    accountInfo,
    editMode,
    toggleEditMode = () => {}
}) {
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
                                <Name
                                    userFirstName={accountInfo.userFirstName}
                                    userLastName={accountInfo.userLastName}
                                    editMode={editMode}
                                    handleTyping={handleTyping}
                                />
                                <AccountControls
                                    editMode={editMode}
                                    toggleEditMode={toggleEditMode}
                                    submitHandlerWrapper={submitHandlerWrapper}
                                    cancelHandler={cancelHandler}
                                />
                                <Grid2 xs={12}>
                                    <Typography variant="h5">
                                        Account Details
                                    </Typography>
                                </Grid2>
                                <Username
                                    username={accountInfo.username}
                                    editMode={editMode}
                                    handleTyping={handleTyping}
                                />
                                <Email
                                    userEmail={accountInfo.userEmail}
                                    handleTyping={handleTyping}
                                    editMode={editMode}
                                />
                                <Password
                                    password={accountInfo.password}
                                    editMode={editMode}
                                    handleTyping={handleTyping}
                                />
                            </Grid2>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </StyledProfile>
    );
};

export default Account;
