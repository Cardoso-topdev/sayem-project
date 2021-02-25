import App from "next/app";
import cookies from "next-cookies";

import UserProvider from "../context/UserContext";
import Layout from "../components/layout";

import "typeface-nunito-sans";
import "typeface-roboto";
import "../shared/global.scss";
import initAuth from '../utils/initAuth'

initAuth()
const MyApp = ({ Component, pageProps, isAuthenticated, uId }) => {
  return (
    <UserProvider isAuthenticated={isAuthenticated} userId={uId}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
};

MyApp.getInitialProps = async (context) => {
  let isAuthenticated = false;
  let uId = "";

  // WARNING - We only check if a cookie called token is present
  // We do not verify the token on the server at this point
  // In this case, it might be fine since we only need the auth state
  // for UI purposes. Any sensitive data fetch is secured separately
  const { token, userId } = cookies(context.ctx);
  if (token) {
    isAuthenticated = true;
    uId = userId;
  }

  const appProps = await App.getInitialProps(context);
  return { ...appProps, isAuthenticated, uId };
};

export default MyApp;
