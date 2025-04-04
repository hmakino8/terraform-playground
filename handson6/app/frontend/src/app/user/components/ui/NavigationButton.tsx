export const NavigationButton: React.FC<{
  icon: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      className={`w-full flex flex-col items-center ${
        isActive ? "text-blue-400" : "text-gray-500"
      } bg-transparent hover:opacity-80`}
      onClick={onClick}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
        {icon}
      </span>
      {label !== "Account" && <p className="text-[12px] h-5">{label}</p>}
    </button>
  );
};
