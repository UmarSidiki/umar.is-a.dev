// Central user profile data for the portfolio
export const user = {
    name: "Umar Siddiqui",
    initials: "U",
    title: "Front-End Developer",
    email: "siddiquiumar0007@gmail.com",
    phone: "+92 318 9009633",
    location: {
        city: "Sukkur",
        region: "Sindh",
        country: "Pakistan",
        address: "H# A1408/191, Colony 5, Sukkur, Sindh, Pakistan"
    },
    social: {
        twitter: "", // not provided in resume
        linkedin: "https://linkedin.com/in/umarsidiki",
        github: "https://github.com/UmarSidiki"
    },
    homepage: {
        headline: {
            main: "Crafting Modern",
            highlight: "Web Interfaces"
        },
        tagline: "Front-end developer focused on building responsive, dynamic, and user-friendly web applications using React, Tailwind, and modern JavaScript.",
        callToAction: {
            primary: "View My Projects",
            secondary: "Download Resume"
        },
        availability: {
            status: "Open to frontend roles and internships",
            showStatus: true
        }
    },
    technologies: [
        { name: "HTML", icon: "🟧" },
        { name: "CSS", icon: "🟦" },
        { name: "JavaScript", icon: "🟨" },
        { name: "TypeScript", icon: "📘" },
        { name: "React", icon: "⚛️" },
        { name: "Next.js", icon: "▲" },
        { name: "Tailwind CSS", icon: "💨" },
        { name: "Flutter", icon: "📱" },
        { name: "Git/GitHub", icon: "🔧" }
    ],
    contact: {
        formTitle: "Let's Connect",
        formSubtitle: "Have a project idea or opportunity? I'm happy to talk.",
        emailSubjectPrefix: "[Contact]",
        submitButtonText: "Send",
        formFields: {
            name: {
                label: "Your Name",
                placeholder: "Enter your name",
                required: true
            },
            email: {
                label: "Email Address",
                placeholder: "your.email@example.com",
                required: true
            },
            subject: {
                label: "Subject",
                placeholder: "What is this about?",
                required: true
            },
            message: {
                label: "Message",
                placeholder: "Write your message here...",
                required: true
            }
        }
    },
    skills: [
        { name: "HTML/CSS", proficiency: "95%" },
        { name: "JavaScript", proficiency: "90%" },
        { name: "React/Next.js", proficiency: "85%" },
        { name: "Flutter", proficiency: "80%" },
        { name: "Tailwind CSS", proficiency: "85%" },
        { name: "TypeScript", proficiency: "75%" },
        { name: "Git/GitHub", proficiency: "80%" }
    ],
    experience: [
        {
            title: "Personal Projects",
            company: "Freelance / Self-Driven",
            period: "2021-Present",
            description: "Developed landing pages, booking forms, and WebView apps using React, Flutter, and PHP. Focused on responsive design and user experience."
        }
    ],
    education: [
        {
            degree: "BS Software Engineering",
            institution: "The Islamia University of Bahawalpur",
            year: "2021-Present",
            details: ""
        },
        {
            degree: "Intermediate (FSc)",
            institution: "BISE Sukkur",
            year: "2019-2021",
            details: ""
        },
        {
            degree: "Matriculation (Science)",
            institution: "BISE Sukkur",
            year: "2017-2019",
            details: ""
        }
    ],
    links: [
        { name: "GitHub", url: "https://github.com/UmarSidiki" },
        { name: "LinkedIn", url: "https://linkedin.com/in/umarsidiki" }
    ],
    Resume: "https://pub-c84c7d98fbfc4fba9d6c5c4f9efeefb3.r2.dev/Umar%20Siddiqui%20Resume.pdf",
};
