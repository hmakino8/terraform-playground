export const SelectButton = (props: {
  size: "S" | "L";
  btnText: string;
  isSelected: boolean;
  location: "left" | "center" | "right";
  setIsSelected: (isSelected: boolean) => void;
  disabled?: boolean;
}) => {
  const { isSelected, size, btnText, location, setIsSelected, disabled } =
    props;
  const width = size === "S" ? "w-16" : "w-24";

  return (
    <div className="flex flex-col">
      <div className="flex justify-start items-center my-2">
        <button
          className={`${style(isSelected, width)} ${
            location === "left"
              ? "rounded-l-full"
              : location === "right"
              ? "rounded-r-full border-l-0"
              : "border-l-0"
          }`}
          disabled={disabled}
          onClick={() => setIsSelected(!isSelected)}
        >
          {btnText}
        </button>
      </div>
    </div>
  );
};

const style = (isSelected: boolean, width: string): string => {
  const commonStyle = "px-2 h-6 items-center flex justify-center";

  return isSelected
    ? `${commonStyle} bg-gray-400 border border-gray-500 text-white ${width} disabled:opacity-30`
    : `${commonStyle} border-gray-400 text-gray-400 border border-gray-700 ${width} disabled:opacity-30`;
};
