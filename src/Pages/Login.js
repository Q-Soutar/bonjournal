// React
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// Material UI
import {
    TextField,
    Typography,
    Button,
    Link,
    Box,
    Card,
    styled,
    CardContent
} from "@mui/material";
// App files
import AuthContext from "../Context/AuthContext";
import validator from "email-validator";

const StyledBox = styled(Box)(({ theme }) => ({
    display: "flex",
    maxWidth: "40vw",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifySelf: "center",
    margin: "50vh auto 0",
    transform: "translateY(-50%)"
}));

const defaultFormValidity = {
    userEmail: false,
    password: false,
    submitAttempt: false
};

const Login = function () {
    // State & friends
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [formValidity, setFormValidity] = useState(defaultFormValidity);
    // Manage changes to the email field
    const emailHandler = function (e) {
        setEmail(e.target.value);
        setFormValidity({
            ...formValidity,
            ["userEmail"]: checkField("userEmail", e.target.value)
        });
    };
    // Manage changes to the password field
    const passwordHandler = function (e) {
        setPassword(e.target.value);
        setFormValidity({
            ...formValidity,
            ["userEmail"]: checkField("password", e.target.value)
        });
    };
    // Handle sign in form submissions
    const submitHandler = function () {
        if (!formValidity.password || !formValidity.userEmail) {
            setFormValidity({
                ...formValidity,
                submitAttempt: true
            });
            return;
        }
        authCtx.signIn(email, password).then(
            () => {
                setEmail("");
                setPassword("");
            },
            () => {
                console.log("Error -- credentials not accepted");
                setFormValidity({
                    userEmail: false,
                    password: false,
                    submitAttempt: true
                });
            }
        );
    };
    const signUpHandler = function () {
        navigate("/signup");
    };
    const checkField = function (field, value) {
        switch (field) {
            case "userEmail":
                return checkEmail(value);
            case "password":
                return checkPassword(value);
        }
    };
    const checkEmail = function (value) {
        return validator.validate(value);
    };
    const checkPassword = function (value) {
        /*
            Validation: 
                1. 1 char
                2. 1 num
                3. Min length 7
        */
        const char = /[a-zA-Z]/.test(value);
        const num = /\d/.test(value);
        const length = value.length > 6;
        return char && num && length;
    };
    // Checks whether there's alreadry a session and if so sends them to the home page.
    // Conveniently also acts as the redirect once the use logs in.
    useEffect(() => {
        if (authCtx.token) navigate("/home");
    }, [authCtx.token]);

    return (
        <StyledBox>
            <Card>
                <CardContent
                    sx={{
                        margin: "50px",
                        width: "50vw"
                    }}
                >
                    <Typography header1="true" display="flex">
                        Please login
                    </Typography>
                    <br></br>
                    <TextField
                        padding="25px"
                        outlined="true"
                        label="Email Address"
                        display="flex"
                        onChange={emailHandler}
                        value={email}
                        helperText={
                            formValidity.submitAttempt &&
                            !formValidity.userEmail
                                ? "Enter a valid email address"
                                : undefined
                        }
                        error={
                            formValidity.submitAttempt &&
                            !formValidity.userEmail
                                ? "error"
                                : undefined
                        }
                    />
                    <br></br>
                    <TextField
                        sx={{
                            marginTop: "25px",
                            marginBottom: "25px"
                        }}
                        outlined="true"
                        label="Password"
                        type="password"
                        display="flex"
                        onChange={passwordHandler}
                        value={password}
                        helperText={
                            formValidity.submitAttempt && !formValidity.password
                                ? "Check your password"
                                : undefined
                        }
                        error={
                            formValidity.submitAttempt && !formValidity.password
                                ? "error"
                                : undefined
                        }
                    />
                    <br></br>
                    <Button onClick={submitHandler}>Sign In</Button>
                    <br></br>
                    <Button onClick={signUpHandler}>Sign Up</Button>
                </CardContent>
            </Card>
        </StyledBox>
    );
};

export default Login;
