// Material UI
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, TextField, Link } from "@mui/material";

const Password = function ({ password, editMode, handleTyping, formValidity }) {
    return (
        <Grid2 container xs={12}>
            <Grid2 xs={6}>
                <Typography>
                    Password (PASSWORD UPDATE NOT IMPLEMENTED YET)
                </Typography>
            </Grid2>
            <Grid2 xs={6}>
                {editMode ? (
                    <TextField
                        id="password"
                        value={password}
                        onChange={handleTyping}
                        type="password"
                        helperText={
                            formValidity.submitAttempt && !formValidity.password
                                ? "Password must contain one letter, one number, and be at least 7 characters long"
                                : undefined
                        }
                        error={
                            formValidity.submitAttempt && !formValidity.password
                                ? true
                                : undefined
                        }
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
