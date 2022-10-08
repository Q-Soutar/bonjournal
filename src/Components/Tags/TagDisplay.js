// Is this file a mess? Yes. Do I intend to do anything about it? Not any time soon.

// React
import { useState } from "react";
// Material UI
import {
    Autocomplete,
    List,
    ListItem,
    ListItemText,
    TextField,
    Box
} from "@mui/material";
// App files
import { Tag } from "./IndexTags";
import { ENTER_KEY_CODE } from "../../Utils/Config";
// NPM
import { nanoid } from "nanoid";

// Started this before noticing the autocomplete component Material has. Retaining this though, since I ran into some issues actually using it.
// Deferred for reasons noted elsewhere.
// const suggestionsDropdown = function ({ suggestions }) {
//     return suggestions.map((suggestion) => {
//         return (
//             <List>
//                 <ListItem>
//                     <ListItemText primary={suggestion} />
//                 </ListItem>
//             </List>
//         );
//     });
// };

// Default validity so formValidity isn't undefined on mount
const defaultFormValidity = {
    textField: false,
    tagsField: false,
    formError: false,
    submitAttempt: false
};

// Component for display of an entry's tags
const TagDisplay = function ({
    tags,
    allTags,
    cardMode,
    handleEntryEdits,
    formValidity = defaultFormValidity
}) {
    // State
    const tagsExist = tags.length > 0;
    // Creates a local version of the tags to prevent the parent state from being altered until desired.
    const localTags = tags;
    const [tagField, changeTagField] = useState("");
    const [tagSuggestions, setTagSuggestions] = useState([]);
    // A bizarre workaround relating to the autocomplete component in Material UI. Couldn't tell ya what's up, but basically you manually change the key which forces a re-render, ie forces it back to the default state. It's dumb, but it works.
    const [forceClear, setForceClear] = useState(false);
    const tagNum = localTags ? localTags.length : 0;
    // Part of that strange workaround for material <Autocomplete/>
    const toggleForceClear = function () {
        setForceClear(!forceClear);
    };
    // Update state based on typing in felds. Also prevents use of uppercase or spaces, for later validation purposes.
    const handleTyping = function (e) {
        // Add in character limit on this
        const chars = e.target.value.toLowerCase().trim();
        changeTagField(chars);
        // Related to deferred autocompletion
        if (chars.length > 1) searchTags(chars);
    };
    // Clear the tag field after submission
    const clearField = function () {
        changeTagField("");
    };
    // For adding new tags to the state
    const newTagHandler = function (tag) {
        // Modify the new tag to have appropriate uuid
        const newTag = {
            text: tag,
            uuid: nanoid()
        };
        const newTags = localTags.concat(newTag);
        // Pushes the new tag state up to the parent component's state
        handleEntryEdits("tags", newTags);
    };
    // Removes a tag
    const deleteTagHandler = function (tag) {
        const newTags = localTags.filter((existingTag) => existingTag !== tag);
        handleEntryEdits("tags", newTags);
    };
    // const tagEditHandler = function () {};
    // Initiates addition of a new tag upon enter keystroke; must ignore all other keystrokes
    const addTag = function (e) {
        // Filter out all keystrokes not "enter"
        if (e.keyCode !== ENTER_KEY_CODE) return;
        // Filter out any empty field values
        if (!e.target.value) {
            return;
        }
        newTagHandler(e.target.value);
        clearField();
        toggleForceClear();
        e.preventDefault();
        // Inject the new tag into the form state's array, and clear the input
        // if (props.formData.tags.length < 3) {
        //     const updatedTags = props.formData.tags.concat([e.target.value]);
        //     props.updateForm({ name: "tags", value: updatedTags });
        //     clearField();
        // } else {
        //     // In the event more than three are entered
        //     console.error("Tag limit exceeded");
        // }
        // Stops it from doing a form submit on enter. Tried putting it at the top, but this prevented any typing from happening.
    };
    // Deferred search functionality.
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
    // Contains a but of deferred autocomplete code to be revisited at a later date.
    return (
        <Box>
            {cardMode !== "DISPLAY" && (
                /* <Autocomplete
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
                />*/
                <TextField
                    label="Tags"
                    value={tagField}
                    onKeyDown={addTag}
                    onChange={handleTyping}
                    helperText={`${tagNum} / 1-3`}
                    error={
                        formValidity.submitAttempt && !formValidity.tagsField
                            ? "error"
                            : undefined
                    }
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
