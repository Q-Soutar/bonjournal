const CardText = function ({ handleFieldEdits, text, cardMode }) {
    const textFieldTypingHandler = function (e) {
        handleFieldEdits("text", e.target.value);
    };
    return (
        <div>
            <h3>Text: </h3>
            {cardMode === "DISPLAY" && <p>{text}</p>}
            {cardMode !== "DISPLAY" && (
                <input value={text} onChange={textFieldTypingHandler} />
            )}
        </div>
    );
};

export default CardText;
