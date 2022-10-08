import { Box, Typography } from "@mui/material";

const CardLocation = function ({ location, cardMode = "DISPLAY" }) {
    if (cardMode !== "CREATE") {
        return (
            <Box>
                <Typography>Location: </Typography>
                <Typography>{JSON.stringify(location)}</Typography>
            </Box>
        );
    }
    return null;
};

export default CardLocation;
