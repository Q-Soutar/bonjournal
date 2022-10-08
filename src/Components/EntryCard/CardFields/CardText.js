// Material UI
import { Box, TextField, Typography } from "@mui/material";

// Default validity so formValidity isn't undefined on mount
const defaultFormValidity = {
    textField: false,
    tagsField: false,
    formError: false,
    submitAttempt: false
};

const CardText = function ({
    text,
    cardMode,
    handleFieldEdits,
    formValidity = defaultFormValidity
}) {
    // Pass field data up into state
    const textFieldTypingHandler = function (e) {
        handleFieldEdits("text", e.target.value);
    };
    console.log(text);
    const charLimit = "25-500";
    const currentChars = text ? text.length : 0;
    return (
        <Box>
            {cardMode === "DISPLAY" && (
                <Typography paragraph>{text}</Typography>
            )}
            {cardMode !== "DISPLAY" && (
                <TextField
                    value={text}
                    onChange={textFieldTypingHandler}
                    helperText={`${currentChars} / ${charLimit}`}
                    error={
                        formValidity.submitAttempt && !formValidity.textField
                            ? "error"
                            : undefined
                    }
                />
            )}
        </Box>
    );
};

export default CardText;
