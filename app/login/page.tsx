"use client";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Link as MuiLink } from "@mui/material";
import { logIn, setCurrentLocation } from "@/lib/features/auth-slice";
import { useAppDispatch } from "@/lib/hooks";
import customToast from "@/toast/toast";
import API_BASE_URL from "@/utils/apiBaseUrl";
import getCurrentLocation from "@/utils/getCurrentLocation";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const cookies = useCookies();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { token } = response.data;
      cookies.set("JWT", token);
      dispatch(logIn());

      const locationResult = await getCurrentLocation();
      if (locationResult.ok) {
        dispatch(setCurrentLocation(locationResult.position));
      } else {
        customToast("warning", locationResult.reason);
      }

      router.push("/event");
    } catch (e: any) {
      customToast("error", e?.response?.data?.message || "Login failed");
    }
  };

  const errorUsername = errors.email?.message;
  const helperTextUsername =
    errorUsername && typeof errorUsername === "string" ? errorUsername : "";

  const errorPassword = errors.password?.message;
  const helperTextPassword =
    errorPassword && typeof errorPassword === "string" ? errorPassword : "";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: "1 1 auto",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Login
        </Typography>
        <TextField
          fullWidth
          label="Email"
          {...register("email", {
            required: "Email is required",
            minLength: {
              value: 3,
              message: "Email must be at least 3 characters",
            },
          })}
          error={Boolean(errors.email)}
          helperText={helperTextUsername}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          error={Boolean(errors.password)}
          helperText={helperTextPassword}
          margin="normal"
          sx={{ mt: 2 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Sing In
        </Button>
        <Box sx={{ mt: 1 }}>
          <Grid container>
            <Grid item>
              <MuiLink component={Link} href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default LoginForm;
