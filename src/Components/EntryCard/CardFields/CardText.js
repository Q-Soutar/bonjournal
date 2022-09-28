// Material UI
import { Typography } from "@mui/material";

const CardText = function ({ text, cardMode, handleFieldEdits }) {
    const textFieldTypingHandler = function (e) {
        handleFieldEdits("text", e.target.value);
    };
    return (
        <div>
            {cardMode === "DISPLAY" && (
                <Typography paragraph>{text}</Typography>
            )}
            {cardMode !== "DISPLAY" && (
                <input value={text} onChange={textFieldTypingHandler} />
            )}
        </div>
    );
};

export default CardText;
