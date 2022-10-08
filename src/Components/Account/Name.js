// Material UI
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, TextField } from "@mui/material";

const Name = function ({
    userFirstName,
    userLastName,
    editMode,
    handleTyping,
    formValidity
}) {
    return (
        <Grid2 container xs={10}>
            {editMode ? (
                <Grid2 item xs={10}>
                    <TextField
                        id="userFirstName"
                        value={userFirstName}
                        onChange={handleTyping}
                        helperText={
                            formValidity.submitAttempt &&
                            !formValidity.userFirstName
                                ? "Please enter your first name"
                                : undefined
                        }
                        error={
                            formValidity.submitAttempt &&
                            !formValidity.userFirstName
                                ? true
                                : undefined
                        }
                    />
                    <TextField
                        id="userLastName"
                        value={userLastName}
                        onChange={handleTyping}
                        helperText={
                            formValidity.submitAttempt &&
                            !formValidity.userLastName
                                ? "Please enter your last name"
                                : undefined
                        }
                        error={
                            formValidity.submitAttempt &&
                            !formValidity.userLastName
                                ? true
                                : undefined
                        }
                    />
                </Grid2>
            ) : (
                <Typography variant="h4">
                    {`${userFirstName} ${userLastName}`}
                </Typography>
            )}
        </Grid2>
    );
};

export default Name;
