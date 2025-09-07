export default function SocialCard({
  username,
  title,
  value,
  subtitle,
  extra,
}) {
  // --- 1. Parse value safely
  let parsedValue = "";
  if (value !== null && value !== undefined) {
    parsedValue = value.toString();
    if (parsedValue.includes(":")) {
      parsedValue = parsedValue.split(":")[1].trim();
    }
  }

  // --- 2. Font sizing helper
  const getFontSize = (len) => {
    if (len >= 10) return "text-4xl";
    if (len >= 7) return "text-6xl";
    if (len >= 5) return "text-7xl";
    if (len > 3) return "text-8xl";
    return "text-9xl";
  };
  let fontSize = getFontSize(parsedValue.length);

  // --- 3. Title → prefix/suffix rules
  const rules = [
    {
      key: "night owl",
      prefix: "I made ",
      suffix: (extra) => `% of my commits ${extra ? extra[1] : ""}`,
      value: (_, extra) => `${extra[0]}`,
    },
    {
      key: "collaborations",
      prefix: "I collaborated on",
      suffix: () => "different repos this year",
    },
    {
      key: "follower",
      prefix: "I gained",
      suffix: () => "new followers this year",
    },
    {
      key: "repos",
      prefix: "I created",
      suffix: () => "repos this year",
    },
    {
      key: "repo",
      prefix: "My most active project this year is",
      suffix: (_, subtitle) => `with ${subtitle}`,
    },
    {
      key: "commits",
      prefix: "I made",
      suffix: () => "commits this year",
    },
    {
      key: "pull",
      prefix: "I opened",
      suffix: () => "pull requests this year",
    },
    {
      key: "language",
      prefix: "I coded mostly in",
      suffix: () => "this year",
    },
    {
      key: "stars",
      prefix: "I received",
      suffix: () => "stars on my repositories this year",
    },
    {
      key: "streak",
      prefix: "My longest commit streak this year is",
      suffix: () => "days",
    },
  ];

  // --- 4. Apply rule if matched
  let prefix = "",
    suffix = "",
    finalValue = parsedValue;

  for (const rule of rules) {
    if (title.toLowerCase().includes(rule.key)) {
      prefix = rule.prefix || "";
      suffix =
        typeof rule.suffix === "function"
          ? rule.suffix(extra, subtitle)
          : rule.suffix || "";
      if (rule.value) {
        finalValue = rule.value(parsedValue, extra, subtitle);
        fontSize = getFontSize(finalValue.length);
      }
      break;
    }
  }

  // --- 5. Render
  return (
    <div className="flex flex-col w-[300px] absolute z-[-10] aspect-square bg-(--background-color) my-2 justify-between pt-4 pb-2 rounded-md">
      <h2 className="text-xl px-4">🎖️B-</h2>
      <div className="flex w-full gap-2 items-baseline flex-col px-4">
        {prefix && <p className="text-sm text-(--sub-text)">{prefix}</p>}
        {finalValue && (
          <h3 className={`${fontSize} text-(--color) font-bold`}>
            {finalValue}
          </h3>
        )}
        {suffix && <p className="text-sm text-(--sub-text)">{suffix}</p>}
      </div>
      <h2 className="text-sm p-2 text-(--background-color) bg-(--color) w-fit self-end rounded-l-full">
        gitwrap/{username}
      </h2>
    </div>
  );
}
