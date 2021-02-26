import firebase, { auth, firestore, storage } from "../firebase";

// import moment from "moment";

const authentication = {};
const { Timestamp } = firebase.firestore;

authentication.signInWithAuthProvider = (provider) => {

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
        reject(new Error("No current user"));
        return;
      }
      auth
        .signInWithPopup(authProvider)
        .then((value) => {
          const user = value.user;
  
          if (!user) {
            reject(new Error("No user"));
            return;
          }
  
          const uid = user.uid;
  
          if (!uid) {
            reject(new Error("No UID"));
  
            return;
          }
          const userDocumentReference = firestore.collection("users").doc(uid);
  
          userDocumentReference
            .get({ source: "server" })
            .then((value) => {
              if (value.exists) {
                resolve(user);
              } else {
                userDocumentReference
                  .set({pages:[]}, { merge: true })
                  .then((value) => {
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