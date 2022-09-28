// Material UI
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, TextField, Box } from "@mui/material";

const Username = function ({ username, editMode, handleTyping }) {
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
                    />
                ) : (
                    <Typography>{username}</Typography>
                )}
            </Grid2>
        </Grid2>
    );
};
export default Username;
