import React from "react";
import WagmiWrapper from "../wagmi-provider";

const AddPageLayout = ({ children }: { children: React.ReactNode }) => {
  return <WagmiWrapper>{children}</WagmiWrapper>;
};

export default AddPageLayout;
