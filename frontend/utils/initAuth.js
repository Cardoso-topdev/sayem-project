import { init } from 'next-firebase-auth'

const initAuth = () => {
  init({
    authPageURL: '/login',
    appPageURL: '/',
    loginAPIEndpoint: '/api/login', // required
    logoutAPIEndpoint: '/api/logout', // required
    // Required in most cases.
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
        // The private key must not be accesssible on the client side.
        privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY, // required
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      // keys: [
      //   process.env.COOKIE_SECRET_CURRENT,
      //   process.env.COOKIE_SECRET_PREVIOUS,
      // ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: false, // set this to false in local (non-HTTPS) development
      signed: false,
    },
  })
}

export default initAuth