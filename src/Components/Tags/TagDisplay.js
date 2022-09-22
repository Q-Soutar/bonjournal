import Tag from "./Tag";
import { useState } from "react";
import { Box } from "@mui/system";
// import { v4 as uuid } from "uuid";
import { nanoid as uuid } from "nanoid";
import {
    Autocomplete,
    List,
    ListItem,
    ListItemText,
    TextField
} from "@mui/material";
const ENTER_KEY_CODE = 13;

/* 
    Handling tags: 
        - Creating a tag:
            > Check for a tag
*/

const suggestionsDropdown = function ({ suggestions }) {
    return suggestions.map((suggestion) => {
        return (
            <List>
                <ListItem>
                    <ListItemText primary={suggestion} />
                </ListItem>
            </List>
        );
    });
};

const TagDisplay = function ({ tags, handleEntryEdits, cardMode, allTags }) {
    const tagsExist = tags.length > 0;
    const [tagField, changeTagField] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState([]);
    // A bizarre workaround relating to the autocomplete component in Material UI. Couldn't tell ya what's up, but basically you manually change the key which forces a re-render, ie forces it back to the default state. It's dumb, but it works.
    const [forceClear, setForceClear] = useState(false);
    const toggleForceClear = function () {
        setForceClear(!forceClear);
    };

    const handleTyping = function (e) {
        // Add in character limit on this
        const chars = e.target.value.toLowerCase().trim();
        changeTagField(chars);
        if (chars.length > 1) searchTags(chars);
    };
    const clearField = function () {
        changeTagField("");
    };
    const searchTags = function (text) {
        console.log(`Tag suggestions`);
        console.log(`Text: ${text}`);
        const matches = allTags.filter((tag) => {
            console.log(`Tag in question: `);
            console.dir(tag);
            console.log(tag.text.includes(text));
            return tag.text.includes(text);
        });
        setTagSuggestions(matches);
        console.dir(matches);
    };

    const localTags = tags;
    const tagEditHandler = function () {};
    const newTagHandler = function (tag) {
        const newTag = {
            text: tag,
            uuid: uuid()
        };
        const newTags = localTags.concat(newTag);
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
        toggleForceClear();
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
                <Autocomplete
                    fullWidth
                    key={forceClear}
                    options={tagSuggestions}
                    freeSolo
                    onKeyDown={addTag}
                    onInputChange={handleTyping}
                    inputValue={tagField}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tag"
                            sx={{
                                width: "100%",
                                "& .MuiBox-root": {
                                    width: "25vw"
                                }
                            }}
                        />
                    )}
                />
            )}
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                {tagsExist &&
                    localTags.map((tag) => {
                        return (
                            <Tag
                                tag={tag}
                                key={tag.uuid}
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
