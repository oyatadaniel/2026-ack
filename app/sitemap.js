export default function sitemap() {
  const baseUrl = "https://ackdioceseofmasenonorth.org";

  const routes = [
    "",
    "/about",
    "/events",
    "/sermons",
    "/news",
    "/live",
    "/visit",
    "/give",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...routes];
}
