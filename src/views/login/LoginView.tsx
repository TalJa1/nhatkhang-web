import {
  TextField,
  Button,
  Typography,
  Box,
  Link,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import loginImg from "../../assets/login/login.png";
import AppleIcon from "@mui/icons-material/Apple";
import Facebook from "../../assets/login/facebook.png";
import Google from "../../assets/login/google.png";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginInterface } from "../../models/login/loginInterface";
import { signInWithGoogle } from "../../firebase";

const LoginView = () => {
  document.title = "Smart Login";
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState<LoginInterface>({
    email: "NhatKhang@gmail.com",
    password: "123",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    const digitCount = (password.match(/\d/g) || []).length;
    if (digitCount < 3) {
      return "Password must contain at least 3 digits";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setLoginForm({ ...loginForm, email });
    setErrors({
      ...errors,
      email: validateEmail(email),
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setLoginForm({ ...loginForm, password });
    setErrors({
      ...errors,
      password: validatePassword(password),
    });
  };

  useEffect(() => {
    const emailError = validateEmail(loginForm.email);
    const passwordError = validatePassword(loginForm.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    setIsFormValid(!emailError && !passwordError);
  }, [loginForm]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isFormValid) {
      console.log("Login attempt", loginForm);
    }
  };

  const handleGoogleLogin = async () => {
    const user = await signInWithGoogle();
    if (user) {
      console.log("User signed in with Google: ", user.displayName);
      const userData = {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      navigate("/home");
    } else {
      console.log("Google sign-in failed");
    }
  };  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Grid
        columnSpacing={7}
        container
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Grid size={{ xs: 12, md: 12 }} sx={{ mb: 5, p: 1 }}>
          <Box>
            <Typography component="h1" variant="h4" sx={{ fontWeight: "bold" }}>
              SMART STUDY PLANNER
            </Typography>
          </Box>
        </Grid>

        {/* Left side - Login Form */}
        <Grid size={{ xs: 12, md: 7 }} sx={{ p: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: "100%", mb: 2 }}>
              <Typography
                component="h1"
                variant="h4"
                sx={{ fontWeight: "bold", textAlign: "left" }}
              >
                Đăng nhập
              </Typography>
              <Box>Đăng nhập để truy cập tài khoản của bạn</Box>
            </Box>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                value={loginForm.email}
                onChange={handleEmailChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                variant="outlined"
                value={loginForm.password}
                onChange={handlePasswordChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  color: "white",
                  backgroundColor: "#256A6A",
                }}
              >
                Đăng nhập
              </Button>
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  Chưa có tài khoản?{" "}
                  <Link
                    href="#"
                    sx={{
                      color: "#DB3232",
                    }}
                  >
                    Đăng ký
                  </Link>
                </Typography>
              </Box>

              {/* Social login section */}
              <Box sx={{ width: "100%", mt: 3, mb: 2 }}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Hoặc đăng nhập với
                  </Typography>
                </Divider>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                      mr: 1,
                      minWidth: "64px",
                      height: "40px",
                      padding: "6px",
                      borderColor: "#1C1E30",
                      "&:hover": {
                        borderColor: "#1877F2",
                        backgroundColor: "rgba(24, 119, 242, 0.04)",
                      },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={Facebook}
                      alt="Facebook"
                      style={{ width: 24, height: 24 }}
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleGoogleLogin}
                    sx={{
                      flex: 1,
                      mx: 1,
                      minWidth: "64px",
                      height: "40px",
                      padding: "6px",
                      borderColor: "#1C1E30",
                      "&:hover": {
                        borderColor: "#DB4437",
                        backgroundColor: "rgba(219, 68, 55, 0.04)",
                      },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={Google}
                      alt="Google"
                      style={{ width: 24, height: 24 }}
                    />
                  </Button>

                  <Button
                    variant="outlined"
                    sx={{
                      flex: 1,
                      ml: 1,
                      minWidth: "64px",
                      height: "40px",
                      padding: "6px",
                      borderColor: "#1C1E30",
                      "&:hover": {
                        borderColor: "#000000",
                        backgroundColor: "rgba(0, 0, 0, 0.04)",
                      },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <AppleIcon sx={{ color: "#000000" }} />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Right side - Image */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <img
            src={loginImg}
            alt="logo"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              objectFit: "contain",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoginView;
