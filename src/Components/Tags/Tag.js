import { Chip, Tooltip, styled, Zoom } from "@mui/material";

const StyledChip = styled(Chip)({
    margin: "3px",
    maxWidth: "10vw",
    overflow: "hidden"
});

const Tag = function ({ tag, cardMode, deleteTagHandler }) {
    const deleteTagWrapper = function () {
        deleteTagHandler(tag);
    };
    // const deleteTag = function () {
    //     checkTagsValidity();
    //     const newTags = tags.filter((_el, index) => {
    //         return tags[index] !== tag;
    //     });
    //     updateForm({ name: "tags", value: newTags });
    // };

    return (
        <div>
            {/* <p>{tag}</p>
            {cardMode !== "DISPLAY" && (
                <button onClick={deleteTagWrapper}>x</button>
            )} */}
            <Tooltip title={tag} TransitionComponent={Zoom}>
                <StyledChip
                    label={tag}
                    onDelete={
                        cardMode !== "DISPLAY" ? deleteTagWrapper : undefined
                    }
                />
            </Tooltip>
        </div>
    );
};

export default Tag;
