import React, { Component } from "react";
import GoogleLogin from 'react-google-login';
// refresh token
// import { refreshTokenSetup } from '../utils/refreshToken';

const clientId =
  '89981139684-5h2uvgps27q8couh86pcffl6vrcve3kb.apps.googleusercontent.com';

function GoogLogin() {
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
    dispatch({ type: "LOGIN" });
    setTimeout(() => {
      router.push("/pages");
    }, 50);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
    );
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login"
        onSuccess={onSuccess}
        uxMode="popup"
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        style={{ marginTop: '100px' }}
        isSignedIn={true}
      />
    </div>
  );
}

export default GoogLogin;
