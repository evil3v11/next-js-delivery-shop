const HighlightText = ({
  text,
  highlight,
}: {
  text: string;
  highlight: string;
}) => {
  if (!highlight.trim().length) return <>{text}</>;

  const textParts = text.split(new RegExp(`(${highlight})`, "gi"));
  console.log(textParts);
  return (
    <span>
      {textParts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="font-bold">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </span>
  );
};

export default HighlightText;
