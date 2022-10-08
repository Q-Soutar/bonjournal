// Material UI
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, TextField } from "@mui/material";

const Username = function ({ username, editMode, handleTyping, formValidity }) {
    return (
        <Grid2 container xs={12}>
            <Grid2 xs={6}>
                <Typography>Username: </Typography>
            </Grid2>
            <Grid2 xs={6}>
                {editMode ? (
                    <TextField
                        id="username"
                        value={username}
                        onChange={handleTyping}
                        helperText={
                            formValidity.submitAttempt && !formValidity.username
                                ? "Username must contain one letter and one number"
                                : undefined
                        }
                        error={
                            formValidity.submitAttempt && !formValidity.username
                                ? true
                                : undefined
                        }
                    />
                ) : (
                    <Typography>{username}</Typography>
                )}
            </Grid2>
        </Grid2>
    );
};
export default Username;
