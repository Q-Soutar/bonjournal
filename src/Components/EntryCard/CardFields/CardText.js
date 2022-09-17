import { Typography } from "@mui/material";

const CardText = function ({ handleFieldEdits, text, cardMode }) {
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
