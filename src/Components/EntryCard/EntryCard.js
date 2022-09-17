import TagDisplay from "../Tags/TagDisplay";
import CardControls from "./CardControls";
import CardDate from "./CardFields/CardDate";
import CardLocation from "./CardFields/CardLocation";
import CardID from "./CardFields/CardID";
import CardText from "./CardFields/CardText";
import { Card } from "@mui/material";
import { useState } from "react";
import { styled } from "@mui/system";
import EntryCardHeader from "./EntryCardHeader";
import EntryCardCollapse from "./EntryCardCollapse";

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

// Expects a mode variable, which can be one of: "display", "edit", and "create"
const EntryCard = function ({
    submitFunction = () => {},
    deleteEntry = () => {
        console.log(`<EntryCard/> -> default deleteEntry() handler function`);
    },
    entry = {},
    cancelToggle = () => {},
    startCardMode = "DISPLAY",
    expanded,
    toggleExpand,
    createEntryHandler
}) {
    // ? Maybe relocate this to the timeline entry?
    // ? It's going to take a lot of finagling to untangle all the state stuff with this
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
        // This should probably be changed so that it doesn't invoke the edit toggle.
        // The expanded variable might need tinkering?
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
