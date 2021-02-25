import { createContext, useReducer, useEffect } from "react";

export const UserStateContext = createContext();
export const UserDispatchContext = createContext();

// const initialState = {
//   isAuth: false,
// };

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return {
        isAuth: true,
        userId: action.userId
      };
    }
    case "LOGOUT": {
      return {
        isAuth: false,
        userId: ""
      };
    }
    default: {
      throw new Error("Unhandled action type.");
    }
  }
};

const UserProvider = ({ children, isAuthenticated, userId }) => {
  const [state, dispatch] = useReducer(reducer, { isAuth: isAuthenticated });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch({ type: "LOGIN", userId: userId });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, [isAuthenticated]);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
};

export default UserProvider;
