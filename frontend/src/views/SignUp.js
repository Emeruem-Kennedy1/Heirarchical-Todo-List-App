import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";

function SignupPage() {
  const navigate = useNavigate();
  const api = useApi();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      api
        .post("/signup", {
          username: username,
          email: email,
          password: password,
        })
        .then((response) => {
          if (response.status === 201) {
            // Assuming 201 status for successful signup
            navigate("/login");
          } else {
            alert("Signup failed");
            navigate("/signup");
          }
        });
    } catch (error) {
      console.error(error);
      alert("Signup failed");
      navigate("/signup");
    }
  };

  return (
    <Container
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "82vh",
      }}
    >
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default SignupPage;
