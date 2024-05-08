import { FC } from "react";
import { MetaMaskContextProvider } from "./Metamask";

type Props = {
  children: React.ReactNode;
};
const MasterProvider: FC<Props> = ({ children }) => {
  return <MetaMaskContextProvider>{children}</MetaMaskContextProvider>;
};

export default MasterProvider;
