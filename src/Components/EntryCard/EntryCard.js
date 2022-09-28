// React
import { useState } from "react";
// Material UI
import { Card, styled } from "@mui/material";
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
    const { uuid, date, text, location, tags = [] } = entryState;
    const revertState = entry;
    const entryDebug = false;

    // Mode management
    const editModeToggle = function () {
        if (localCardMode === "EDIT") setLocalCardMode("DISPLAY");
        if (localCardMode === "DISPLAY") setLocalCardMode("EDIT");
        setEntryState(revertState);
    };
    const cancelHandler = function () {
        if (localCardMode === "CREATE") cancelToggle();
        if (localCardMode === "EDIT") editModeToggle();
    };

    // Field Management
    const handleFieldEdits = function (field, value) {
        setEntryState({
            ...entryState,
            [field]: value
        });
    };

    // Submit Functions
    const submitHandler = function () {
        submitFunction(entryState);
        setLocalCardMode("DISPLAY");
    };
    // Delete
    const deleteHandler =
        localCardMode === "CREATE"
            ? () => {}
            : function () {
                  deleteEntry(uuid);
              };
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
            />
            <EntryCardCollapse
                text={entryState.text}
                expanded={expanded}
                handleFieldEdits={handleFieldEdits}
                cardMode={localCardMode}
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
                <div>
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
                </div>
            )}
        </StyledCard>
    );
};

export default EntryCard;
