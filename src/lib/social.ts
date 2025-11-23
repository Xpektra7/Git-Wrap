import { toPng } from "html-to-image";

export default async function shareStat(node: HTMLElement | null, title: string) {
  if (!node || !node.lastElementChild) return;

  try {
    const dataUrl = await toPng(node.lastElementChild as HTMLElement, {
      quality: 1.0,
      pixelRatio: 6,
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      style: {
        "--color": getComputedStyle(document.body).getPropertyValue("--color"),
        "--border": getComputedStyle(document.body).getPropertyValue("--border"),
        "--background-color": getComputedStyle(document.body).getPropertyValue("--background-color"),
        "--sub-text": getComputedStyle(document.body).getPropertyValue("--sub-text"),
      } as any,
    });

    const link = document.createElement("a");
    link.download = `${title}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Failed to export card", err);
  }
}
