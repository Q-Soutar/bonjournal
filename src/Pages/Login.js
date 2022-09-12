import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import AuthContext from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = function () {
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const emailHandler = function (e) {
        setEmail(e.target.value);
    };

    const passwordHandler = function (e) {
        setPassword(e.target.value);
    };

    const submitHandler = function () {
        authCtx.signIn(email, password).then(
            () => {
                setEmail("");
                setPassword("");
                navigate("/home");
            },
            () => {
                console.log("Error -- credentials not accepted");
            }
        );
    };

    return (
        <Box
            display="flex"
            alignSelf="center"
            justifySelf="center"
            alignContent="center"
            justifyContent="center"
            alignItems="center"
            marginTop="25vw"
        >
            <Typography header1 display="flex">
                Please login
            </Typography>
            <br></br>
            <TextField
                outlined
                label="Email Address"
                display="flex"
                onChange={emailHandler}
                value={email}
            />
            <br></br>
            <TextField
                outlined
                label="Password"
                type="password"
                display="flex"
                onChange={passwordHandler}
                value={password}
            />
            <br></br>
            <Button onClick={submitHandler}>Sign In</Button>
        </Box>
    );
};

export default Login;
