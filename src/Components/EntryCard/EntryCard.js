// React
import { useEffect, useState } from "react";
// Material UI
import { Box, Card, styled, Typography } from "@mui/material";
// App files
import { TagDisplay } from "../Tags/IndexTags";
import {
    CardControls,
    CardDate,
    CardLocation,
    CardID,
    CardText,
    EntryCardHeader,
    EntryCardCollapse
} from "../EntryCard/IndexEntryCard";

const StyledCard = styled(Card)(({ theme, expanded }) => ({
    maxWidth: expanded ? "50vw" : "40vw",
    marginLeft: expanded ? "10vw" : "0vw",
    transitionProperty: "margin-left, max-width",
    transitionDuration: "0.15s",
    transitionTimingFunction: "ease-in",
    outline: expanded ? `${theme.palette.primary.main} solid 5px` : "",
    [":hover"]: {
        maxWidth: "50vw",
        marginLeft: "10vw",
        outline: `${theme.palette.secondary.main} solid 5px`,
        transition: "outline 0.25s, margin-left 0.15s, max-width 0.15s"
    }
}));
// Default state for formValidity
const defaultFormValidity = {
    textField: false,
    tagsField: false,
    submitAttempt: false
};

// General use display for entry data. Doubles as a form for creating and editing entries.
// Expects a mode variable, which can be one of: "DISPLAY", "EDIT", and "CREATE"
const EntryCard = function ({
    entry = {},
    allTags,
    startCardMode = "DISPLAY",
    expanded,
    toggleExpand,
    createEntryHandler = () => {},
    submitFunction = () => {},
    deleteEntry = () => {},
    cancelToggle = () => {}
}) {
    // State setting
    const [localCardMode, setLocalCardMode] = useState(startCardMode);
    const [entryState, setEntryState] = useState(entry);
    const [formValidity, setFormValidity] = useState(defaultFormValidity);
    const { uuid, date, text, location, tags = [] } = entryState;
    const revertState = entry;
    const entryDebug = false;

    // Mode management. Toggles between display mode and form modes.
    const editModeToggle = function () {
        if (localCardMode === "EDIT") setLocalCardMode("DISPLAY");
        if (localCardMode === "DISPLAY") setLocalCardMode("EDIT");
        setEntryState(revertState);
    };
    const cancelHandler = function () {
        if (localCardMode === "CREATE") cancelToggle();
        if (localCardMode === "EDIT") editModeToggle();
    };

    // Field change management and state updating
    const handleFieldEdits = function (field, value) {
        setEntryState({
            ...entryState,
            [field]: value
        });
    };

    // Submit Function
    const submitHandler = function () {
        if (formValidity.tagsField && formValidity.textField) {
            submitFunction(entryState);
            // setFormData(defaultForm);
            // setFormValidity(defaultFormValidity);
            setLocalCardMode("DISPLAY");
            return;
        }
        setFormValidity({ ...formValidity, submitAttempt: true });
    };
    // Delete
    const deleteHandler =
        localCardMode === "CREATE"
            ? () => {}
            : function () {
                  deleteEntry(uuid);
              };

    // Form validation functions
    const checkTagsValidity = function () {
        if (entryState.tags) {
            if (entryState.tags.length > 0 && entryState.tags.length <= 3) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
    const checkTextValidity = function () {
        if (entryState.text) {
            if (entryState.text.length >= 25) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
        // if (entryState.text.length < 25) {
        // }
    };
    // const submitHandler = function (e) {
    //     e.preventDefault();
    //     if (formValidity.tagsField && formValidity.textField) {
    //         // entriesCtx.createEntry(formData);
    //         dbCreateEntry(formData);
    //         setFormData(defaultForm);
    //         setFormValidity(defaultFormValidity);
    //         props.modalClose();
    //         return;
    //     }
    //     setFormValidity({ ...formValidity, submitAttempt: true });
    // };

    // Validate form
    useEffect(() => {
        const textValid = checkTextValidity();
        const tagsValid = checkTagsValidity();
        setFormValidity({
            ...formValidity,
            textField: textValid,
            tagsField: tagsValid
        });
    }, [entryState]);

    return (
        <StyledCard
            expanded={expanded}
            variant="outlined"
            onClick={localCardMode === "DISPLAY" ? toggleExpand : undefined}
        >
            <EntryCardHeader
                entry={entryState}
                expanded={expanded}
                cardMode={localCardMode}
                handleEntryEdits={handleFieldEdits}
                allTags={allTags}
                formValidity={formValidity}
            />
            <EntryCardCollapse
                text={entryState.text}
                expanded={expanded}
                handleFieldEdits={handleFieldEdits}
                cardMode={localCardMode}
                formValidity={formValidity}
                controls={
                    <CardControls
                        cardMode={localCardMode}
                        deleteHandler={deleteHandler}
                        submitHandler={submitHandler}
                        editModeToggle={editModeToggle}
                        cancelHandler={cancelHandler}
                        createEntryHandler={createEntryHandler}
                    />
                }
            />
            {entryDebug && (
                <Box>
                    <Typography>Form Validity:</Typography>
                    <Typography
                        sx={{ color: formValidity.textField ? "green" : "red" }}
                    >
                        textField: {JSON.stringify(formValidity.textField)}
                    </Typography>
                    <Typography
                        sx={{ color: formValidity.tagsField ? "green" : "red" }}
                    >
                        tagsField: {JSON.stringify(formValidity.tagsField)}
                    </Typography>
                    <Typography
                        sx={{ color: formValidity.formError ? "green" : "red" }}
                    >
                        formError: {JSON.stringify(formValidity.formError)}
                    </Typography>
                    <Typography
                        sx={{
                            color: formValidity.submitAttempt ? "green" : "red"
                        }}
                    >
                        submitAttempt:{" "}
                        {JSON.stringify(formValidity.submitAttempt)}
                    </Typography>
                    <CardDate date={date} cardMode={localCardMode} />
                    <CardText
                        text={text}
                        cardMode={localCardMode}
                        handleFieldEdits={handleFieldEdits}
                    />
                    <TagDisplay
                        tags={tags}
                        cardMode={localCardMode}
                        handleEntryEdits={handleFieldEdits}
                    />
                    <CardLocation
                        location={location}
                        cardMode={localCardMode}
                    />
                    <CardID uuid={uuid} cardMode={localCardMode} />
                </Box>
            )}
        </StyledCard>
    );
};

export default EntryCard;
