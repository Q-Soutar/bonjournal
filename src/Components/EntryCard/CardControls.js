const CardControls = function ({
    cardMode = "DISPLAY",
    deleteHandler = () => {},
    submitHandler = () => {},
    editModeToggle = () => {},
    cancelHandler = () => {}
}) {
    return (
        <div>
            {cardMode !== "DISPLAY" && (
                <div>
                    <button onClick={submitHandler}>Save</button>
                    <button onClick={cancelHandler}>Cancel</button>
                </div>
            )}
            {cardMode === "DISPLAY" && (
                <button onClick={editModeToggle}>Edit</button>
            )}
            {cardMode !== "CREATE" && (
                <button onClick={deleteHandler}>Delete</button>
            )}
        </div>
    );
};

export default CardControls;
