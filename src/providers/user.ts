// Central user profile data for the portfolio
export const user = {
    name: "Umar Siddiqui",
    initials: "U",
    title: "Full-Stack Web & Mobile App Developer",
    email: "siddiquiumar0007@gmail.com",
    phone: "+92 318 9009633",
    location: {
        city: "Sukkur",
        region: "Sindh",
        country: "Pakistan",
        address: "H# A1408/191, Colony 5, Sukkur, Sindh, Pakistan"
    },
    social: {
        linkedin: "https://linkedin.com/in/umarsidiki",
        github: "https://github.com/UmarSidiki"
    },
    homepage: {
        headline: {
            main: "Crafting Modern",
            highlight: "Interfaces"
        },
        tagline: "I'm a passionate Full Stack Developer specializing in Laravel, MERN, Flutter, and custom automation systems. With over 5 years of experience building impactful software solutions, I help businesses automate processes, create stunning web and mobile apps, and boost their digital presence.",
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
        { name: "React", iconName: "react" },
        { name: "Next.js", iconName: "nextjs" },
        { name: "Node.js", iconName: "nodejs" },
        { name: "Express.js", iconName: "expressjs" },
        { name: "Laravel", iconName: "laravel" },
        { name: "WordPress", iconName: "wordpress" },
        { name: "TypeScript", iconName: "typescript" },
        { name: "Flutter", iconName: "flutter" }
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
        { name: "MERN Stack", proficiency: "80%" },
        { name: "Laravel", proficiency: "70%" },
        { name: "React/Next.js", proficiency: "85%" },
        { name: "Flutter", proficiency: "80%" },
        { name: "WordPress", proficiency: "95%" },
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
            year: "2021-2025",
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

export const services = [
    {
        title: "Brand Identity",
        description: "I develop a cohesive brand identity with personalized cards that encapsulate your brand's essence, ensuring consistent representation across all platforms.",
        iconName: "brandIdentity"
    },
    {
        title: "Business Websites",
        description: "I create a professional online presence that showcases your brand and engages customers effectively.",
        iconName: "businessWebsites"
    },
    {
        title: "MVP Development",
        description: "I build a minimum viable product to validate your idea quickly and efficiently, ensuring it meets market needs.",
        iconName: "mvpDevelopment"
    },
    {
        title: "Web System Development",
        description: "I create custom, scalable web systems designed to streamline your business operations and boost efficiency.",
        iconName: "webSystemDevelopment"
    },
    {
        title: "Mobile App Development",
        description: "I develop custom, high-performance mobile apps that enhance user experience and drive business growth.",
        iconName: "mobileAppDevelopment"
    }
];
