import React from "react";

export const BaseTemplate = (props: { children: React.ReactNode }) => {
  return <main className="relative overflow-x-clip">{props.children}</main>;
};
