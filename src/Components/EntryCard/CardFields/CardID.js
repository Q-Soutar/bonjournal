import { Box, Typography } from "@mui/material";

const CardID = function ({ uuid, cardMode = "DISPLAY" }) {
    if (cardMode !== "CREATE") {
        return (
            <Box>
                <Typography>Entry ID: </Typography>
                <Typography>{uuid}</Typography>
            </Box>
        );
    }
    return null;
};

export default CardID;
