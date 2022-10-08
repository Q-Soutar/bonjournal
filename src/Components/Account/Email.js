import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, TextField } from "@mui/material";

const Email = function ({ userEmail, editMode, handleTyping, formValidity }) {
    return (
        <Grid2 container xs={12}>
            <Grid2 xs={6}>
                <Typography>Email Address: </Typography>
            </Grid2>
            <Grid2 xs={6}>
                {editMode ? (
                    <TextField
                        id="userEmail"
                        value={userEmail}
                        onChange={handleTyping}
                        helperText={
                            formValidity.submitAttempt &&
                            !formValidity.userEmail
                                ? "Must be a valid email address"
                                : undefined
                        }
                        error={
                            formValidity.submitAttempt &&
                            !formValidity.userEmail
                                ? true
                                : undefined
                        }
                    />
                ) : (
                    <Typography>{userEmail}</Typography>
                )}
            </Grid2>
        </Grid2>
    );
};

export default Email;
