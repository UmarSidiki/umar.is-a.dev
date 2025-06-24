import "@/styles/app.css";

export const BlogTemplate = (props: { children: React.ReactNode }) => {
  return <>
  <main className="relative min-h-screen z-10 pt-24">
  {props.children}
  </main>
  </>;
};
