const Tag = function ({ tag, cardMode, deleteTagHandler }) {
    const deleteTagWrapper = function () {
        deleteTagHandler(tag);
    };
    return (
        <div>
            <p>{tag}</p>
            {cardMode !== "DISPLAY" && (
                <button onClick={deleteTagWrapper}>x</button>
            )}
        </div>
    );
};

export default Tag;
