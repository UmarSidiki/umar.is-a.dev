// Central user profile data for the portfolio
export const user = {
    name: "Umar Siddiqui",
    initials: "U",
    title: "Full-Stack Developer",
    email: "siddiquiumar0007@gmail.com",
    phone: "+92 318 9009633",
    location: {
        city: "Sukkur",
        region: "Sindh",
        country: "Pakistan",
        address: "H# A1408/191, Old Sukkur, Sukkur, Sindh, Pakistan"
    },
    social: {
        twitter: "https://twitter.com/umarsiddiqui",
        linkedin: "https://linkedin.com/in/umarsiddiqui",
        github: "https://github.com/umarsiddiqui"
    },
    // Homepage content
    homepage: {
        headline: {
            main: "Building Digital",
            highlight: "Experiences"
        },
        tagline: "Full-stack developer passionate about creating innovative web solutions that bridge the gap between design and functionality.",
        callToAction: {
            primary: "View My Work",
            secondary: "Download Resume"
        },
        availability: {
            status: "Available for new opportunities",
            showStatus: true
        }
    },
    // Technologies showcase on homepage
    technologies: [
        { name: "React", icon: "⚛️" },
        { name: "Next.js", icon: "▲" },
        { name: "TypeScript", icon: "📘" },
        { name: "Node.js", icon: "🟢" },
        { name: "Python", icon: "🐍" },
        { name: "Docker", icon: "🐳" },
        { name: "AWS", icon: "☁️" },
        { name: "MongoDB", icon: "🍃" }
    ],
    // Contact form settings
    contact: {
        formTitle: "Get In Touch",
        formSubtitle: "Have a project in mind or want to discuss opportunities? Send me a message!",
        emailSubjectPrefix: "[Portfolio Contact]",
        submitButtonText: "Send Message",
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
                placeholder: "What is this regarding?",
                required: true
            },
            message: {
                label: "Message",
                placeholder: "Tell me about your project or inquiry...",
                required: true
            }
        }
    },
    skills: [
        { name: "React/Next.js", proficiency: "95%" },
        { name: "TypeScript", proficiency: "90%" },
        { name: "Node.js", proficiency: "85%" },
        { name: "Python", proficiency: "80%" },
        { name: "Web Development", proficiency: "90%" },
    ],
    experience: [
        {
            title: "Senior Developer",
            company: "Tech Corp",
            period: "2022-Present",
            description: "Leading full-stack development projects using React, Node.js, and cloud technologies."
        },
        {
            title: "Full Stack Developer",
            company: "StartupXYZ",
            period: "2020-2022",
            description: "Built scalable web applications and APIs, implemented CI/CD pipelines."
        }
    ],
    education: [
        {
            degree: "B.S. Computer Science",
            institution: "University of Technology",
            year: "2020",
            details: "Magna Cum Laude, GPA: 3.8/4.0"
        }
    ],
    links: [
        { name: "GitHub", url: "https://github.com/umarsiddiqui" },
        { name: "LinkedIn", url: "https://linkedin.com/in/umarsiddiqui" }
    ],
    Resume: "https://pub-c84c7d98fbfc4fba9d6c5c4f9efeefb3.r2.dev/Umar%20Siddiqui%20Resume.pdf",
};
