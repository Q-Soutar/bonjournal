// React
import { useState } from "react";
// Material UI
import { styled } from "@mui/system";
import {
    TimelineItem,
    TimelineContent,
    TimelineOppositeContent
} from "@mui/lab";
// App files
import { ModifiedSeparator } from "./IndexTimeline";
import { EntryCard } from "../EntryCard/IndexEntryCard";

const StyledTimelineEntry = styled(TimelineItem)(({ theme }) => ({
    maxWidth: "100vw",
    flex: "0 0 auto",
    "& .MuiTimelineOppositeContent-root": {
        flex: "0 0 0.5vw",
        maxWidth: "50px",
        marginRight: "1vw"
    },
    "& .MuiTimelineContent-root": {
        paddingTop: 25,
        paddingBottom: 25,
        flex: "0.75vw 2 auto",
        flexDirection: "row"
    }
}));

// Actualy container for the entries. Arranges the card, along with supporting elements.
const TimelineEntry = function ({ entry, tags, deleteEntry, editEntry }) {
    // State, to control whether the card is in collapsed or expanded state.
    const [expanded, changeExpand] = useState(false);
    const toggleExpand = function () {
        changeExpand(!expanded);
    };
    return (
        <StyledTimelineEntry>
            <TimelineOppositeContent />
            <ModifiedSeparator
                entry={entry}
                expanded={expanded}
                toggleExpand={toggleExpand}
                deleteEntry={deleteEntry}
                uuid={entry.uuid}
            />
            <TimelineContent>
                <EntryCard
                    entry={entry}
                    submitFunction={editEntry}
                    startCardMode={"DISPLAY"}
                    expanded={expanded}
                    toggleExpand={toggleExpand}
                    deleteEntry={deleteEntry}
                    allTags={tags}
                />
            </TimelineContent>
        </StyledTimelineEntry>
    );
};

export default TimelineEntry;
