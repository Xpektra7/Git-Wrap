import { toPng } from "html-to-image";

export default async function shareStat(node, title) {
  if (!node.lastElementChild) return;

  try {
    const dataUrl = await toPng(node.lastElementChild, {
      quality: 1.0,
      pixelRatio: 6, // ⬅️ Boost resolution (default = 1)
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      style: {
        "--color": getComputedStyle(document.body).getPropertyValue("--color"),
        "--border": getComputedStyle(document.body).getPropertyValue("--border"),
        "--background-color": getComputedStyle(document.body).getPropertyValue("--background-color"),
        "--sub-text": getComputedStyle(document.body).getPropertyValue("--sub-text"),
      },
    });

    const link = document.createElement("a");
    link.download = `${title}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export card", err);
  }
}
