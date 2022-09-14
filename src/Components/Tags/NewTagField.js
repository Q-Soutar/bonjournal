// React imports
import React, { useState } from "react";
// Material UI imports
import { TextField } from "@mui/material";
// Config import
import { ENTER_KEY_CODE } from "../../Config";

const JFTagField = function (props) {
    const [tagField, changeTagField] = useState("");

    const handleTyping = function (e) {
        changeTagField(e.target.value);
    };
    const clearField = function () {
        changeTagField("");
    };

    const addTag = function (e) {
        // * Filter out all keystrokes not "enter"
        if (e.keyCode !== ENTER_KEY_CODE) return;
        // * Filter out any empty field values
        if (!e.target.value) {
            return;
        }
        // * Inject the new tag into the form state's array, and clear the input
        if (props.formData.tags.length < 3) {
            const updatedTags = props.formData.tags.concat([e.target.value]);
            props.updateForm({ name: "tags", value: updatedTags });
            clearField();
        } else {
            // * In the event more than three are entered
            console.error("Tag limit exceeded");
        }
        // * Stops it from doing a form submit on enter. Tried putting it at the top, but this prevented any typing from happening.
        e.preventDefault();
    };

    // Decide whether to do this here or inline
    const fieldError =
        props.formValidity.submitAttempt && !props.formValidity.tagsField
            ? "error"
            : undefined;

    return (
        <TextField
            variant="outlined"
            label="Enter your tags"
            id="jf-tag-field"
            onKeyDown={addTag}
            onChange={handleTyping}
            value={tagField}
            fullWidth
            error={
                props.formValidity.submitAttempt &&
                !props.formValidity.tagsField
                    ? "error"
                    : undefined
            }
        />
    );
};

export default JFTagField;
