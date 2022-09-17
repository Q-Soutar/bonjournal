// Material UI imports
import {
    Box,
    Toolbar,
    AppBar,
    IconButton,
    styled,
    Menu,
    Button,
    MenuItem
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
// App file imports
import NewSearchBar from "./NewSearchBar";
import stamp_red from "../../img/stamp_red.png";
import { useContext, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Logout } from "@mui/icons-material";
import AuthContext from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

// Since the predfined 'large' fails to work in this situation I've opted to just yoink the h4 or h3 fontsize (I'm undecided still). It's close enough and I can centrally manage it from the theme easily. Might create a dedicated key for this later but for now I can't be bothered.
const MenuContainer = styled(Box)(({ theme }) => ({
    marginLeft: "auto",
    padding: "0px",
    marginTop: "0px",
    marginBottom: "0px",
    "& .MuiSvgIcon-root": {
        color: theme.palette.secondary.main,
        fontSize: theme.typography.h3.fontSize
    }
}));

// Experimentation with doing more Emotion CSS styled, er, styling.
// const SAB2 = styled(AppBar)`
//     color: ${({ theme }) => theme.palette.primary.main};
//     & .MuiIconButton-root {
//         display: flex;
//         margin-left: auto;
//         color: ${({ theme }) => theme.palette.secondary.main};
//     }
//     & .MuiSvgIcon-root {
//         font-size: ${({ theme }) => theme.typography.h4.fontSize};
//     }
// `;

// Relocate the menu container to a new component
const TopBar = function () {
    const authCtx = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = !!anchorEl;
    const navigate = useNavigate();
    const handleMenuOpen = function (e) {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = function () {
        setAnchorEl(null);
    };
    const logoutHandler = function () {
        console.log("Logout registered");
        authCtx.signOut();
    };
    return (
        <AppBar>
            <Toolbar>
                <img src={stamp_red} width="50px" />
                <NewSearchBar />
                <MenuContainer>
                    <IconButton>
                        <SettingsIcon />
                    </IconButton>
                    <IconButton onClick={handleMenuOpen}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                        <MenuItem key="logout" onClick={logoutHandler}>
                            <Button endIcon={<Logout />}>Logout</Button>
                        </MenuItem>
                    </Menu>
                </MenuContainer>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
