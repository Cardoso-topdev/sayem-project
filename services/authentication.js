import firebase, { auth, firestore, storage } from "../firebase";

// import moment from "moment";

const authentication = {};
const { Timestamp } = firebase.firestore;

authentication.signInWithAuthProvider = (provider) => {

    console.log("ay we here")
    return new Promise((resolve, reject) => {
      if (!provider) {
        reject(new Error("No provider"));
  
        return;
      }
      
      const authProvider = new firebase.auth.OAuthProvider(provider.id);
      const scopes = provider.scopes;
  
      if (scopes) {
        scopes.forEach((scope) => {
          authProvider.addScope(scope);
        });
      }
  
      if (auth.currentUser) {
        console.log("current user")
        console.log(auth.currentUser)
        reject(new Error("No current user"));
  
        // resolve(auth.currentUser);
        return;
      }
      console.log("we got here")
      auth
        .signInWithPopup(authProvider)
        .then((value) => {
          const user = value.user;
          console.log("user")
          console.log(user)
  
          if (!user) {
            reject(new Error("No user"));
            return;
          }
  
          const uid = user.uid;
  
          if (!uid) {
            reject(new Error("No UID"));
  
            return;
          }
          console.log("we got here now")
          
          const userDocumentReference = firestore.collection("users").doc(uid);
  
          userDocumentReference
            .get({ source: "server" })
            .then((value) => {
              if (value.exists) {
                // analytics.logEvent("login", {
                //   method: provider.id,
                // });
                console.log("existing user")
                console.log(user)
                resolve(user);
              } else {
                console.log("new user")
                userDocumentReference
                  .set({pages:[]}, { merge: true })
                  .then((value) => {
                    // analytics.logEvent("login", {
                    //   method: provider.id,
                    // });

                    resolve(user);
                  })
                  .catch((reason) => {
                    reject(reason);
                  });
              }
            })
            .catch((reason) => {
              reject(reason);
            });
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  };

authentication.signOut = () => {
  return new Promise((resolve, reject) => {
    const currentUser = auth.currentUser;
    console.log("yoooooo")
    console.log(auth)
    console.log(auth.currentUser)
    if (!currentUser) {
      reject(new Error("No current user"));

      return;
    }

    auth
      .signOut()
      .then((value) => {
        // analytics.logEvent("sign_out");

        resolve(value);
      })
      .catch((reason) => {
        reject(reason);
      });
  });
};
export default authentication;