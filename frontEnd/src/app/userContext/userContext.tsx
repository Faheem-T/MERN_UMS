import { createContext } from "react";

export const UserContext = createContext({ username: "" });

export const UserContextProvider = ({ children }) => {
  return <UserContext.Provider value={}>{children}</UserContext.Provider>;
};
