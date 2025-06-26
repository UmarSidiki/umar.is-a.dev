"use client";

import React from "react";

// Configuration object for easy editing
const config = {
  profile: {
    initials: "U",
    name: "Umar Siddiqui",
    title: "Full-Stack Developer",
  },
  contact: [
    { icon: "📧", value: "john@example.com" },
    { icon: "📱", value: "+1 (555) 123-4567" },
    { icon: "📍", value: "San Francisco, CA" },
  ],
  skills: [
    { name: "React/Next.js", proficiency: "95%" },
    { name: "TypeScript", proficiency: "90%" },
    { name: "Node.js", proficiency: "85%" },
    { name: "Python", proficiency: "80%" },
  ],
  experience: [
    {
      title: "Senior Developer",
      company: "Tech Corp",
      period: "2022-Present",
      description:
        "Leading full-stack development projects using React, Node.js, and cloud technologies.",
    },
    {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      period: "2020-2022",
      description:
        "Built scalable web applications and APIs, implemented CI/CD pipelines.",
    },
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      institution: "University of Technology",
      year: "2020",
      details: "Magna Cum Laude, GPA: 3.8/4.0",
    },
  ],
  links: [
    { name: "GitHub", url: "#" },
    { name: "LinkedIn", url: "#" },
  ],
};

export const Sidebar = () => {
  return (
    <aside className="col-span-1 lg:col-span-4 order-1 lg:order-2">
      <div className="sticky top-32 bg-gradient-to-br from-white/80 via-neutral-50/60 to-white/70 dark:from-neutral-800/80 dark:via-neutral-900/60 dark:to-transparent backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl shadow-2xl shadow-neutral-200/20 dark:shadow-neutral-900/40">
        <div>
          <div className="p-8">
            {/* Profile Header */}
            <div className="mb-10 text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-amber-100 dark:ring-amber-900/30">
                {config.profile.initials}
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                {config.profile.name}
              </h1>
              <p className="text-base text-neutral-600 dark:text-neutral-400 mb-4 font-medium">
                {config.profile.title}
              </p>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mx-auto"></div>
            </div>{" "}
            {/* Resume Content */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Contact
                </h3>
                <div className="space-y-3 text-sm">
                  {config.contact.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 p-2 rounded-lg transition-colors duration-200"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Skills
                </h3>
                <div className="space-y-4">
                  {config.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-800 dark:text-neutral-200 font-medium">
                          {skill.name}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          {skill.proficiency}
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: skill.proficiency }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Experience
                </h3>
                <div className="space-y-6">
                  {config.experience.map((exp, index) => (
                    <div
                      key={index}
                      className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 p-3 rounded-lg transition-colors duration-200 -m-3"
                    >
                      <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                        {exp.title}
                      </h4>
                      <p className="text-sm text-amber-600 dark:text-amber-400 mb-2 font-medium">
                        {exp.company} • {exp.period}
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Education
                </h3>
                {config.education.map((edu, index) => (
                  <div
                    key={index}
                    className="group hover:bg-neutral-50 dark:hover:bg-neutral-800/50 p-3 rounded-lg transition-colors duration-200 -m-3"
                  >
                    <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-2 font-medium">
                      {edu.institution} • {edu.year}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {edu.details}
                    </p>
                  </div>
                ))}
              </div>

              {/* Links */}
              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {config.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-neutral-700 dark:text-neutral-300 hover:text-amber-700 dark:hover:text-amber-300 rounded-xl px-4 py-3 text-center transition-all duration-200 text-sm font-semibold border border-neutral-200 dark:border-neutral-700 hover:border-amber-300 dark:hover:border-amber-600"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl px-6 py-4 text-white text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-0">
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
