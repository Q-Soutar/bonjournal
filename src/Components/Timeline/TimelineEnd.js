// Material UI
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
// App files
import { EntryCard } from "../EntryCard/IndexEntryCard";

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

// Not sure why I retained this, but because I have a keen interest in not losing any CSS work I've done, I am going to keep it for reference purposes in case this code may come in handy in the future / if I need to do something similar again.
// const StyledTimelineEntry = styled(TimelineItem)(({ theme }) => ({
//     maxWidth: "100vw",
//     flex: "0 0 auto",
//     "& .MuiTimelineOppositeContent-root": {
//         flex: "0 0 0.5vw",
//         maxWidth: "50px"
//     }
// }));

// Bottom of the timeline. Also acts as the spot where new entries are created.
const TimelineEnd = function ({
    createEntryHandler,
    createEntryMode,
    createEntryToggle,
    tags
}) {
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
