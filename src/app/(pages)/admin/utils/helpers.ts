export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getAuthHeaders = () => {
  // Authentication is carried by the httpOnly session cookie, which fetch
  // sends automatically for same-origin requests. No token is handled in JS.
  return {
    "Content-Type": "application/json",
  };
};

export const categories = [
  "Technology",
  "Web Development",
  "React",
  "Next.js",
  "JavaScript",
  "Tutorial",
  "Personal",
];
