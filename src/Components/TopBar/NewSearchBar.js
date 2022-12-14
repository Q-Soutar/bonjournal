// Material UI imports
import { InputBase, styled, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// App file imports
// import EntriesContext from "../Context/EntriesContext";

/*
    This is a compromise version of the feature. In addition to the need for additional
    search functionality (eg, date and location filters plus text search), I had wanted
    to have this thing start out as a circle around the icon, that exapnds when you mouse
    over it. However, once the mouse hover goes away, it shrinks back, creating a weird
    scenario where the field text is over nothing. From what I can tell online, there is
    no particularly "easy" way to fix this. The current version is good enough though as far as I care.
*/

const SearchContainer = styled(Box)({
    backgroundColor: "white",
    borderRadius: "16px",
    marginLeft: "2vw",
    display: "flex"
});

// This kind of breaks my rule that the sx prop should be utilized for anything that's like a 2-line styling, but this was born out of trying to do it in the other styling component and it failing. So.... yeah.
const StyledSearchIcon = styled(SearchIcon)(({ theme }) => ({
    alignSelf: "center",
    fontSize: theme.typography.h4.fontSize
}));

const StyledInput = styled(InputBase)({
    ".MuiInputBase-input": {
        width: "80px",
        transition: "width 0.25s",
        // The fact that this is the pseudo-class used for the focus state, and no a Mui- one is a
        // dreadful inconsistency from most other components.
        "&:focus": {
            width: "200px",
            transition: "width 0.25s"
        },
        "&:hover": {
            width: "200px",
            transition: "width 0.25s"
        }
    }
});

// Deferring recreation of the search bar because of the limitations of Firebase Realtime Database searches and sorts. Will recreate it after developing the backend myself.
const NewSearchBar = function () {
    return (
        <SearchContainer>
            <StyledSearchIcon />
            <StyledInput placeholder="Search" />
        </SearchContainer>
    );
};

export default NewSearchBar;
