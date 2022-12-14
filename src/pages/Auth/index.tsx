import { useState } from "react";
import AuthLayout from "Layouts/Auth";
import TabRows from "./TabsRow";
import TNInput from "components/Input";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button } from "@mui/material";
import { useSignUpMutation, useSignInMutation } from "stores/services/user";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { commonActions } from "stores/slices/common";

export enum AuthTabs {
  SignIn = "Sign in",
  SignUp = "Sign up",
}

interface FormProps {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tab, setTab] = useState(AuthTabs.SignIn);

  const isSignUpTab = tab === AuthTabs.SignUp;
  const [signUp] = useSignUpMutation();
  const [signIn] = useSignInMutation();

  const schema = Yup.object({
    email: Yup.string().label("Email").email().required("This field is required!"),
    password: Yup.string().label("Password").min(6).max(18).required("This field is required!"),
    ...(isSignUpTab
      ? {
          username: Yup.string().label("User name").min(3).required("This field is required!"),
          confirmPassword: Yup.string()
            .label("Password confirmation")
            .oneOf([Yup.ref("password"), null], "Password doesn't match")
            .required(),
        }
      : {}),
  }).required();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ username, email, password }: FormProps) => {
    const params = { username, email, password };
    try {
      if (isSignUpTab) {
        await signUp(params).unwrap();
        setTab(AuthTabs.SignIn);
        dispatch(commonActions.showAlertMessage({ type: "success", message: "Successfully signed up!" }));
      } else {
        const user = await signIn(params).unwrap();
        dispatch(commonActions.setUser(user));
        dispatch(commonActions.showAlertMessage({ type: "success", message: "Successfully signed in!" }));
        navigate("/");
      }
    } catch (error: any) {
      dispatch(commonActions.showAlertMessage({ type: "error", message: error.data.message }));
    }
  };
  return (
    <AuthLayout header={tab}>
      <TabRows
        tab={tab}
        setTab={(tab) => {
          setTab(tab);
          reset({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
        }}
      />
      <Box display="grid" gap={3} sx={{ placeItems: "center" }}>
        {isSignUpTab && (
          <TNInput
            label="User name"
            placeholder="Please enter your user name."
            fullWidth
            inputProps={{ ...register("username") }}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
        <TNInput
          label="Email"
          placeholder="Please enter your email."
          fullWidth
          inputProps={{ ...register("email") }}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TNInput
          type="password"
          label="Password"
          placeholder="Please enter your password."
          fullWidth
          inputProps={{ ...register("password") }}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        {isSignUpTab && (
          <TNInput
            type="password"
            label="Confirm password"
            placeholder="Please re-enter your password."
            fullWidth
            inputProps={{ ...register("confirmPassword") }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />
        )}
        <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
          {tab}
        </Button>
      </Box>
    </AuthLayout>
  );
};

export default AuthPage;
