import { Menu, MenuItem, Button } from "@mui/material";
import {
    Logout,
    PersonIcon,
    FormatListBulletedIcon
} from "../../Utils/IndexIcons";

// Menu for navigating the site.
const TopMenuBar = function ({
    anchorEl,
    open,
    handleMenuClose,
    journalLink,
    profileLink,
    logoutHandler
}) {
    return (
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
            <MenuItem key="journal" onClick={journalLink}>
                <Button endIcon={<FormatListBulletedIcon />}>Journal</Button>
            </MenuItem>
            <MenuItem key="profile" onClick={profileLink}>
                <Button endIcon={<PersonIcon />}>Profile</Button>
            </MenuItem>
            <MenuItem key="logout" onClick={logoutHandler}>
                <Button endIcon={<Logout />}>Logout</Button>
            </MenuItem>
        </Menu>
    );
};

export default TopMenuBar;
