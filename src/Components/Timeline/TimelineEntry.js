import EntryCard from "../EntryCard/EntryCard";
import { styled } from "@mui/system";
import { useState } from "react";
import {
    TimelineItem,
    TimelineContent,
    TimelineOppositeContent
} from "@mui/lab";
import ModifiedSeparator from "./ModifiedSeparator";

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

const TimelineEntry = function ({ entry, deleteEntry, editEntry, tags }) {
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
