import "@/styles/app.css";
import { Sidebar } from "@/components/Sidebar/Sidebar";

export const BaseTemplate = (props: { children: React.ReactNode }) => {
  return (
    <>


      <main className="relative min-h-screen z-10 pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Content Area */}
            <div className="col-span-1 lg:col-span-8 order-2 lg:order-1">
              <div className="bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/70 dark:from-neutral-800/80 dark:via-neutral-900/60 dark:to-transparent backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40 min-h-[calc(100vh-12rem)]">
                <div className="p-8 lg:p-12">
                  {props.children}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <Sidebar />
          </div>
        </div>
      </main>
    </>
  );
};
