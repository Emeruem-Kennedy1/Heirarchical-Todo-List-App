import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";

function SignupPage() {
  const navigate = useNavigate();
  const api = useApi();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isFormValid = () => {
    return (
      username.trim().length > 0 &&
      validateEmail(email) &&
      password.length > 0 &&
      password === confirmPassword
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Resetting the error message at the beginning of submission
    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Username is required.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    if (password.length === 0) {
      setErrorMessage("Password is required.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post("/signup", {
        username,
        email,
        password,
      });

      if (response.status === 201) {
        navigate("/login");
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Signup failed. Please try again.");
    }
  };


  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography component="h1" variant="h3">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isFormValid()}
          >
            Sign Up
          </Button>
        </Box>
        <Typography>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignupPage;
