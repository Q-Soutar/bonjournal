// Material IU imports
import { CardContent, Collapse, styled } from "@mui/material";
// App files
import { CardText } from "./IndexEntryCard";

const StyledCardContent = styled(CardContent)({
    paddingBottom: "-10px",
    "& .MuiTypography-root": {
        wordWrap: "break-word"
    }
});
// Collapsible section of the entry card
const EntryCardCollapse = function ({
    text,
    expanded,
    controls,
    cardMode,
    handleFieldEdits,
    formValidity
}) {
    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <StyledCardContent s={{ paddingBottom: 0 }}>
                <CardText
                    text={text}
                    cardMode={cardMode}
                    handleFieldEdits={handleFieldEdits}
                    formValidity={formValidity}
                />
            </StyledCardContent>
            {controls}
        </Collapse>
    );
};

export default EntryCardCollapse;
