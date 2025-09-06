import { toJpeg } from "html-to-image";

export default async function shareStat(node,title) {
  if (!node.lastElementChild) return;

  try {
    const dataUrl = await toJpeg(node.lastElementChild, {
      quality: 0.95,
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      style: {
        // Force Tailwind CSS variables to render
        "--color": getComputedStyle(document.body).getPropertyValue("--color"),
        "--border": getComputedStyle(document.body).getPropertyValue("--border"),
        "--background-color": getComputedStyle(document.body).getPropertyValue("--background-color"),
        "--sub-text": getComputedStyle(document.body).getPropertyValue("--sub-text"),
      },
    });

    const link = document.createElement("a");
    link.download = `${title}.jpeg`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export card", err);
  }
}
