// /api/og/[username].ts
export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const username = url.pathname.split("/").pop() || "Guest";

  return new Response(
    `<!doctype html>
    <html>
      <head>
        <meta property="og:title" content="Gitwrap for ${username}" />
        <meta property="og:description" content="See ${username}'s year in code" />
        <meta property="og:image" content="https://git-wrap-nine.vercel.app/api/image?u=${username}" />
      </head>
      <body>
        <script>window.location="/?username=${username}"</script>
      </body>
    </html>`,
    {
      headers: { "content-type": "text/html" },
    }
  );
}
