export default function SocialCard({
  username,
  title,
  value,
  subtitle,
}) {
  
  let prefix = "";
  let suffix = "";

  if (title.toLowerCase().includes("star")) {
    prefix = ""
    suffix = "";
  } else if (title.toLowerCase().includes("fork")) {
    prefix = ""
    suffix = "";
  } else if (title.toLowerCase().includes("collaborations")) {
    prefix = "I collaborated on"
    suffix = "different repos this year";
  } else if (title.toLowerCase().includes("follower")) {
    prefix = "I gained"
    suffix = "new followers this year";
  } else if (title.toLowerCase().includes("repos")) {
    prefix = "I created"
    suffix = "repos this year";
  } else if (title.toLowerCase().includes("repo")) {
    prefix = "I worked on"
    suffix = `the most this year totalling ${subtitle}`;
  } else if (title.toLowerCase().includes("commits")) {
    prefix = "I made"
    suffix = "commits this year";
  } else if (title.toLowerCase().includes("pull")) {
    prefix = "I opened"
    suffix = "pull requests this year";
  } else if (title.toLowerCase().includes("issue")) {
    prefix = ""
    suffix = "";
  } else if (title.toLowerCase().includes("language")) {
    prefix = "My most used language is"
    suffix = "";
  }

  if(value === null || value === undefined){
    value = "";
  } else {
    value = value.toString();
  }
  const fontSize =
  value.length > 10 ? "text-3xl" :
  value.length > 7 ? "text-6xl" :
  value.length > 3 ? "text-8xl" :
  "text-9xl";

  

  return (
    <div className="flex flex-col absolute z-[-10] w-[300px] aspect-square bg-(--border) my-2 justify-between pt-4 pb-2 rounded-md ">
        <h2 className="text-xl px-4">🎖️B-</h2>
        <div className="flex w-full gap-2 items-baseline flex-col px-4">
          <p className="text-sm text-(--sub-text)">{prefix}</p>
          {
            (value && value.length >= 0) ? 
          (
          <h3 className={`${fontSize} text-(--color) font-bold`} >
            {value}
          </h3>) : null}
          <p className="text-sm text-(--sub-text)">{suffix}</p>
        </div>
        <h2 className="text-sm p-2 text-neutral-950 bg-neutral-50 w-fit self-end rounded-l-full">gitwrap/{username}</h2>
    </div>);
}
