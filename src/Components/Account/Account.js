// Material UI
import { Card, Box, Typography, styled, CardContent } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
// App files
import Email from "./Email";
import Name from "./Name";
import Username from "./Username";
import Password from "./Password";
import AccountControls from "./AccountControls";
import { DisabledByDefault } from "@mui/icons-material";

const StyledProfile = styled(Box)(({ theme }) => ({
    display: "flex",
    maxWidth: "40vw",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifySelf: "center",
    margin: "50vh auto 0",
    transform: "translateY(-50%)"
    // paddingTop: "20vh"
    // margin: "25vh",
    // width: "100%"
}));

// Account component, "extended" by the signup and profile components. Utilizes field child components.
const Account = function ({
    submitHandler,
    updateAccountInfo,
    cancelHandler,
    accountInfo,
    editMode,
    formValidity,
    formError,
    password = false,
    toggleEditMode = () => {}
}) {
    // Update state with type event data
    const handleTyping = function (e) {
        updateAccountInfo(e.target.id, e.target.value);
    };
    // Wrapper to pass the correct info into the submit; I should probably do this where the state lives instead, but eh.
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
                                    formValidity={formValidity}
                                />
                                <AccountControls
                                    editMode={editMode}
                                    toggleEditMode={toggleEditMode}
                                    submitHandlerWrapper={submitHandlerWrapper}
                                    cancelHandler={cancelHandler}
                                    formValidity={formValidity}
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
                                    formValidity={formValidity}
                                />
                                <Email
                                    userEmail={accountInfo.userEmail}
                                    handleTyping={handleTyping}
                                    editMode={editMode}
                                    formValidity={formValidity}
                                />
                                <Password
                                    password={accountInfo.password}
                                    editMode={editMode}
                                    handleTyping={handleTyping}
                                    formValidity={formValidity}
                                    disabled={!password}
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
