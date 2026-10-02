import React from "react";

export const ProjectsTemplate = (props: { children: React.ReactNode }) => {
  return (
    <main className="relative overflow-x-clip pt-24 lg:pt-32">
      <div className="mx-auto max-w-[110rem] px-5 pb-24 sm:px-8 lg:px-12 lg:pb-32">
        {props.children}
      </div>
    </main>
  );
};
