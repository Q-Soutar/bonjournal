// Material UI imports
import { CardHeader, Typography, Box } from "@mui/material";
import { styled } from "@mui/material";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import PublicIcon from "@mui/icons-material/Public";
// App file imports
import TagDisplay from "../Tags/TagDisplay";
// This is not the best way to go about typography styling, but whatever it works well enough. I can circle back to merge it with the rest of the header styling.
const StyledDate = styled(Typography)({
    fontWeight: "bold",
    fontSize: "large"
});
const StyledAddress = styled(Typography)({
    marginLeft: "auto",
    marginRight: "5px",
    fontSize: "small"
});

const StyledCardHeader = styled(CardHeader)(({ expanded }) => ({
    [":hover"]: {
        backgroundColor: "#E5E4E2"
    },
    backgroundColor: expanded ? "#E5E4E2" : "white",
    "& .MuiBox-root": {
        display: "flex"
    },
    "& .MuiSvgIcon-root": {
        fontSize: "large"
    }
}));

const EntryCardHeader = function ({
    entry,
    expanded,
    cardMode,
    handleEntryEdits,
    allTags
}) {
    const { location, date, tags } = entry;
    const formattedDate = new Date(date).toDateString();
    // Nested ternary due to unidentified inconsistencies in the location objects passed in (I know, I hate it too)
    const formattedAddress =
        location === undefined
            ? "Parts Unknown"
            : location.formattedAddress === undefined
            ? "Parts Unknown"
            : location.formattedAddress;
    return (
        <StyledCardHeader
            title={
                <Box>
                    <StyledDate>
                        {cardMode === "CREATE"
                            ? new Date(Date.now()).toDateString()
                            : formattedDate}
                    </StyledDate>
                    <StyledAddress>
                        {/* {location.formattedAddress || "Parts Unknown"} */}
                        {cardMode === "CREATE" ? "" : formattedAddress}
                    </StyledAddress>
                    <PublicIcon></PublicIcon>
                </Box>
            }
            titleTypographyProps={{ variant: "body1" }}
            action={expanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            subheader={
                <TagDisplay
                    tags={!tags ? [] : tags}
                    allTags={allTags}
                    cardMode={cardMode}
                    handleEntryEdits={handleEntryEdits}
                />
            }
            expanded={expanded}
        />
    );
};

export default EntryCardHeader;
