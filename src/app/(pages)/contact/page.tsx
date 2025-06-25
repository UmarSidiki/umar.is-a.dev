import React from "react";

const Contact = () => {
  return (
    <>
      <main className="relative min-h-screen z-10 pt-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/70 dark:from-neutral-800/80 dark:via-neutral-900/60 dark:to-transparent backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40 min-h-[calc(100vh-12rem)]">
            <div className="p-8 lg:p-12">
              {/* Header Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
                  Get In Touch
                </h1>                <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                  I&apos;m always open to new opportunities and interesting projects. 
                  Let&apos;s discuss how we can work together to bring your ideas to life.
                </p>
              </div>              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information & Messages */}
                <div className="space-y-8">
                  {/* Message Area */}
                  <div>
                    <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
                      Live Messages
                    </h2>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-6">
                    Send Message
                  </h2>
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
                        placeholder="Project Discussion"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Message
                      </label>
                      <textarea
                        rows={6}
                        className="w-full px-4 py-3 bg-white/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Tell me about your project..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Contact;
