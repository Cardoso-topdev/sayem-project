import { useEffect } from "react";
import useRouter from "next/router";

import cookies from "next-cookies";
import authentication from '../../services/authentication';
import { useGoogleLogout } from 'react-google-login';

const LogoutPage = () => {

  const clientId =
  '89981139684-5h2uvgps27q8couh86pcffl6vrcve3kb.apps.googleusercontent.com';

  const onLogoutSuccess = (res) => {
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
    signOut();
    logoutOnServer();
  }, []);
  return null;
};

export const getServerSideProps = async (context) => {
  const { token } = cookies(context);
  const res = context.res;
  if (!token) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }
  return { props: {} };
};

export default LogoutPage;
