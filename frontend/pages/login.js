import { useState, useContext } from "react";
import { useRouter } from "next/router";
import cookies from "next-cookies";

import { UserDispatchContext } from "../context/UserContext";
import Notice from "../components/notice";
import Input from "../components/input";
import AuthProviderList from "../components/AuthProviderList";
import authentication from '../../services/authentication';
import GoogleLogin from 'react-google-login';
import { useGoogleLogin } from 'react-google-login';
import { withStyles } from "@material-ui/core/styles"
import { Box, ButtonGroup, Button } from "@material-ui/core"
import { Google as GoogleIcon } from "mdi-material-ui";

const form = {
  id: "login",
  inputs: [
    {
      id: "email",
      type: "email",
      label: "E-Mail Address",
      required: true,
      value: "",
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      required: true,
      value: "",
    },
  ],
  submitButton: {
    type: "submit",
    label: "Login",
  },
  button: {
    type: "button",
    label: "Forgot password ?",
  },
};

const LoginPage = () => {
  const RESET_NOTICE = { type: "", message: "" };
  const [notice, setNotice] = useState(RESET_NOTICE);
  const dispatch = useContext(UserDispatchContext);
  const router = useRouter();
  console.log("loginpage start")

  const values = {};
  form.inputs.forEach((input) => (values[input.id] = input.value));
  const [formData, setFormData] = useState(values);

  const handleInputChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const GoogleButton = withStyles({
    root: {
      color: "#ea4335",
    },
  })(Button);


  const clientId =
  '89981139684-5h2uvgps27q8couh86pcffl6vrcve3kb.apps.googleusercontent.com';

  // const onSuccess = (res) => {
  //   console.log('Login Success: currentUser:', res.profileObj);
  //   alert(
  //     `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
  //   );
  //   refreshTokenSetup(res);
  // };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    console.log(res.body)
    alert(
      `This shit aint working`
    );
  };

  const onSuccess = async res => {
    console.log('Login Success: currentUser:', res);
    // alert(
    //   `Logged in successfully welcome ${res.profileObj.name} 😍. \n See console for full profile object.`
    // );
    // refreshTokenSetup(res);
    console.log("so we got here")
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/users/googlogin`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: res.profileObj.email,
          uid: res.profileObj.googleId,
        }),
      }
    );
    const data = await response.json();

    if (data.errCode) {
      setNotice({ type: "ERROR", message: data.message });
    } else {
      dispatch({ type: "LOGIN" });
      setTimeout(() => {
        router.push("/pages");
      }, 500);
    }
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: 'offline',
    // responseType: 'code',
    // prompt: 'consent',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice(RESET_NOTICE);
   
    try {
      console.log("submit called")
      console.log(`${process.env.NEXT_PUBLIC_API}`)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/login`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );
      
      const data = await response.json();
      console.log("what this look like")
      console.log(data)
      if (data.errCode) {
        setNotice({ type: "ERROR", message: data.message });
      } else {
        dispatch({ type: "LOGIN" });
        // router.push("/pages");
        router.push("/" + data.userId);
      }
    } catch (err) {
      console.log(err);
      setNotice({ type: "ERROR", message: "Something unexpected happened." });
      dispatch({ type: "LOGOUT" });
    }
  };

  const signInWithAuthProvider = (provider) => {
    console.log("signInWithAuthProvider was called")
    // console.log(auth.currentUser)
    let heyy = authentication
      .signInWithAuthProvider(provider)
      .then(async (user) => {

      console.log("user!!!")
      console.log(user)
      console.log(user.uid)
      
      // logic to figure out if this was a new user or old user

      // get the user and password inside the controller, sign token, set cookie, res successful login
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/users/login2`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            uid: user.uid,
          }),
        }
      );
      dispatch({ type: "LOGIN" });
      setTimeout(() => {
        router.push("/pages");
      }, 50);
      
      })
      .catch((reason) => {
        const code = reason.code;
        const message = reason.message;

        switch (code) {
          case "auth/account-exists-with-different-credential":
          case "auth/auth-domain-config-required":
          case "auth/cancelled-popup-request":
          case "auth/operation-not-allowed":
          case "auth/operation-not-supported-in-this-environment":
          case "auth/popup-blocked":
          case "auth/popup-closed-by-user":
          case "auth/unauthorized-domain":
            // this.props.openSnackbar(message);
            return;

          default:
            // this.props.openSnackbar(message);
            return;
        }
      })
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    router.push("/forgotPassword");
  };

  return (
    <>
      <h1 className="pageHeading">Login</h1>
      <form id={form.id} onSubmit={handleSubmit}>
        {form.inputs.map((input, key) => {
          return (
            <Input
              key={key}
              formId={form.id}
              id={input.id}
              type={input.type}
              label={input.label}
              required={input.required}
              value={formData[input.id]}
              setValue={(value) => handleInputChange(input.id, value)}
            />
          );
        })}
        {notice.message && (
          <Notice status={notice.type} mini>
            {notice.message}
          </Notice>
        )}
        <button type={form.submitButton.type}>{form.submitButton.label}</button>
        <button type={form.button.type} onClick={handlePasswordReset}>
          {form.button.label}
        </button>
      </form>

      <div>
        <ButtonGroup
          halfwidth="true"
          orientation="vertical"
          variant="outlined"
        >
          <Button
            key={"google.com"}
            startIcon={<GoogleIcon/>}
            onClick={() => signIn()}
          >
          {"Sign in with Google"}
        </Button>
        </ButtonGroup>

      </div>
      <p>
        Don't have an account yet?{" "}
        <a href="/signup" rel="noreferrer noopener">
          <strong>Sign up here.</strong>
        </a>
      </p>
    </>
  );
};

export const getServerSideProps = (context) => {
  console.log("login getServerSideProps called!")
  const { token } = cookies(context);
  const res = context.res;
  console.log(token)
  console.log(res)
  if (token) {
    console.log("we have a token still bitch")
    res.writeHead(302, { Location: `/login` });
    res.end();
  }
  return { props: {} };
};

export default LoginPage;
