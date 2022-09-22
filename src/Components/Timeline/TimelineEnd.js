// React imports
import { useEffect, useContext, useState } from "react";
// Material UI imports
import HelpIcon from "@mui/icons-material/Help";
import {
    TimelineItem,
    TimelineConnector,
    TimelineDot,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineContent
} from "@mui/lab";
import { styled } from "@mui/system";
import EntryCard from "../EntryCard/EntryCard";

const StyledTimelineItem = styled(TimelineItem)(({ theme }) => ({
    maxWidth: "100%",
    "& .MuiTimelineOppositeContent-root": {
        flex: "0 0 0.5vw",
        maxWidth: "50px",
        marginRight: "1vw"
    },
    "& .MuiTimelineSeparator-root": {
        flex: "0 0 8vw"
    },
    "& .MuiTimelineDot-root": {
        alignSelf: "center",
        justifySelf: "center",
        backgroundColor: theme.palette.secondary.main,
        marginLeft: "0vw"
    },
    "& .MuiSvgIcon-root": {
        fontSize: theme.typography.h4.fontSize,
        color: theme.palette.primary.main
    },
    "& .MuiTimelineContent-root": {
        paddingTop: 25,
        paddingBottom: 25,
        flex: "0.75vw 2 auto",
        flexDirection: "row"
    }
}));

// const StyledTimelineEntry = styled(TimelineItem)(({ theme }) => ({
//     maxWidth: "100vw",
//     flex: "0 0 auto",
//     "& .MuiTimelineOppositeContent-root": {
//         flex: "0 0 0.5vw",
//         maxWidth: "50px"
//     }
// }));

const TimelineEnd = function ({
    createEntryHandler,
    createEntryMode,
    createEntryToggle,
    tags
}) {
    // const [expanded, changeExpand] = useState(false);
    // const toggleExpand = function () {
    //     changeExpand(!expanded);
    // };
    // const [createEntryMode, setCreateEntryMode] = useState(false);
    // const createEntryToggle = function () {
    //     setCreateEntryMode(!createEntryMode);
    // };

    return (
        <StyledTimelineItem>
            <TimelineOppositeContent />
            <TimelineSeparator>
                <TimelineConnector />
                <TimelineDot id="end" onClick={createEntryToggle}>
                    <HelpIcon />
                </TimelineDot>
                <TimelineConnector sx={{ opacity: "0%" }} />
            </TimelineSeparator>
            {createEntryMode && (
                <TimelineContent>
                    <EntryCard
                        submitFunction={createEntryHandler}
                        startCardMode={"CREATE"}
                        cancelToggle={createEntryToggle}
                        expanded={true}
                        allTags={tags}
                    />
                </TimelineContent>
            )}
        </StyledTimelineItem>
    );
};

export default TimelineEnd;
