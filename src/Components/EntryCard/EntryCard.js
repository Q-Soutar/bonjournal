import TagDisplay from "../Tags/TagDisplay";
import CardControls from "./CardControls";
import CardDate from "./CardFields/CardDate";
import CardLocation from "./CardFields/CardLocation";
import CardID from "./CardFields/CardID";
import CardText from "./CardFields/CardText";
import { useState } from "react";

// Expects a mode variable, which can be one of: "display", "edit", and "create"
const EntryCard = function ({
    submitFunction = () => {},
    deleteEntry = () => {},
    entry = {},
    cancelToggle = () => {},
    startCardMode = "DISPLAY"
}) {
    // State setting
    const [localCardMode, setLocalCardMode] = useState(startCardMode);
    const [entryState, setEntryState] = useState(entry);
    const { uuid, date, text, location, tags = [] } = entryState;
    const revertState = entry;

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
        cancelHandler();
    };
    // Delete
    const deleteHandler =
        localCardMode === "create"
            ? () => {}
            : function () {
                  deleteEntry(uuid);
              };

    return (
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
            <CardLocation location={location} cardMode={localCardMode} />
            <CardID uuid={uuid} cardMode={localCardMode} />
            <CardControls
                cardMode={localCardMode}
                deleteHandler={deleteHandler}
                submitHandler={submitHandler}
                editModeToggle={editModeToggle}
                cancelHandler={cancelHandler}
            />
        </div>
    );
};

export default EntryCard;
