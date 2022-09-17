import Tag from "./Tag";
import { useState } from "react";
import { Box } from "@mui/system";

const ENTER_KEY_CODE = 13;

const TagDisplay = function ({ tags, handleEntryEdits, cardMode }) {
    const tagsExist = tags.length > 0;
    const [tagField, changeTagField] = useState("");

    const handleTyping = function (e) {
        changeTagField(e.target.value);
    };
    const clearField = function () {
        changeTagField("");
    };

    const localTags = tags;
    const tagEditHandler = function () {};
    const newTagHandler = function (tag) {
        const newTags = localTags.concat(tag);
        handleEntryEdits("tags", newTags);
    };
    const deleteTagHandler = function (tag) {
        const newTags = localTags.filter((existingTag) => existingTag !== tag);
        handleEntryEdits("tags", newTags);
    };

    const addTag = function (e) {
        // * Filter out all keystrokes not "enter"
        if (e.keyCode !== ENTER_KEY_CODE) return;
        // * Filter out any empty field values
        if (!e.target.value) {
            return;
        }
        newTagHandler(e.target.value);
        clearField();
        e.preventDefault();
        // * Inject the new tag into the form state's array, and clear the input
        // if (props.formData.tags.length < 3) {
        //     const updatedTags = props.formData.tags.concat([e.target.value]);
        //     props.updateForm({ name: "tags", value: updatedTags });
        //     clearField();
        // } else {
        //     // * In the event more than three are entered
        //     console.error("Tag limit exceeded");
        // }
        // * Stops it from doing a form submit on enter. Tried putting it at the top, but this prevented any typing from happening.
    };
    return (
        <Box>
            {cardMode !== "DISPLAY" && (
                <input
                    value={tagField}
                    onChange={handleTyping}
                    onKeyDown={addTag}
                />
            )}
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                {tagsExist &&
                    localTags.map((tag) => {
                        return (
                            <Tag
                                tag={tag}
                                key={tag}
                                cardMode={cardMode}
                                deleteTagHandler={deleteTagHandler}
                            />
                        );
                    })}
            </Box>
        </Box>
    );
};

export default TagDisplay;
