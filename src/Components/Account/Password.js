// Material UI
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, TextField, Box, Link } from "@mui/material";

const Password = function ({ password, editMode, handleTyping }) {
    return (
        <Grid2 container xs={12}>
            <Grid2 xs={6}>
                <Typography>Password (NOT YET IMPLEMENTED)</Typography>
            </Grid2>
            <Grid2 xs={6}>
                {editMode ? (
                    <TextField
                        id="password"
                        value={password}
                        onChange={handleTyping}
                    />
                ) : (
                    <Link href="#" underline="hover">
                        Reset
                    </Link>
                )}
            </Grid2>
        </Grid2>
    );
};
export default Password;
