// Material IU imports
import { CardContent, Typography, Collapse, styled } from "@mui/material";

const StyledCardContent = styled(CardContent)({
    paddingBottom: "-10px",
    "& .MuiTypography-root": {
        wordWrap: "break-word"
    }
});
const EntryCardCollapse = function ({ text, expanded, controls }) {
    return (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
            <StyledCardContent s={{ paddingBottom: 0 }}>
                <Typography paragraph>{text}</Typography>
            </StyledCardContent>
            {controls}
        </Collapse>
    );
};

export default EntryCardCollapse;
