import { useEffect } from "react";
import useRouter from "next/router";

import cookies from "next-cookies";
import authentication from '../../services/authentication';
import { useGoogleLogout } from 'react-google-login';

const LogoutPage = () => {

  const clientId =
  '89981139684-5h2uvgps27q8couh86pcffl6vrcve3kb.apps.googleusercontent.com';

  const onLogoutSuccess = (res) => {
    console.log('Logged out Success');
    alert('Logged out Successfully ✌');
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });
  useEffect(() => {
    const router = useRouter;
    const logoutOnServer = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API}/users/logout`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        // router.push("/login");
        setTimeout(() => {
          router.push("/login");
        }, 400);
      } catch (err) {
        console.log(err);
      }
    };
    console.log("try to google sign out")
    signOut();
    logoutOnServer();
    // authentication.signOut();
    console.log("do we make it here?")
  }, []);
  return null;
};

export const getServerSideProps = async (context) => {
  console.log("logout getServerSideProps called!")
  const { token } = cookies(context);
  const res = context.res;
  console.log(token)
  console.log(res)
  if (!token) {
    console.log("NO TOKEN")
    res.writeHead(302, { Location: `/login` });
    res.end();
  }
  console.log("so we're going to return empty props")
  return { props: {} };
};

export default LogoutPage;
