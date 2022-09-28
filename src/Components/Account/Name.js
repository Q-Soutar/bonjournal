// Material UI
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, TextField, Box } from "@mui/material";

const Name = function ({
    userFirstName,
    userLastName,
    editMode,
    handleTyping
}) {
    return (
        <Grid2 container xs={10}>
            {editMode ? (
                <Grid2 item xs={10}>
                    <TextField
                        id="userFirstName"
                        value={userFirstName}
                        onChange={handleTyping}
                    />
                    <TextField
                        id="userLastName"
                        value={userLastName}
                        onChange={handleTyping}
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
