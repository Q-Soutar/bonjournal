import { Box, Typography } from "@mui/material";

const CardDate = function ({ date, cardMode = "DISPLAY" }) {
    if (cardMode !== "CREATE") {
        return (
            <Box>
                <Typography>Date: </Typography>
                <Typography>{new Date(date).toDateString()}</Typography>
            </Box>
        );
    }
    return null;
};

export default CardDate;
