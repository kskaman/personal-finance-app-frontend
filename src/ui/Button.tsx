interface Props {
  type?: "button" | "submit" | "reset";
  height?: string;
  width?: string;
  padding?: string;
  color: string;
  backgroundColor?: string;
  children: React.ReactNode;
  borderColor?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  hoverColor?: string;
  hoverBgColor?: string;
  flex?: number;
  isDisabled?: boolean;
}

const Button = ({
  type = "button",
  flex,
  height = "40px",
  padding = "16px",
  backgroundColor = "inherit",
  color,
  width = "fit-content",
  children,
  borderColor,
  hoverColor,
  hoverBgColor,
  isDisabled = false,
  onClick,
}: Props) => {
  const disabledBg = "#e0e0e0";
  const disabledColor = "#9e9e9e";

  /* ---------- Event handlers ---------- */
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    if (hoverBgColor) e.currentTarget.style.backgroundColor = hoverBgColor;
    if (hoverColor) e.currentTarget.style.color = hoverColor;
    if (hoverBgColor) e.currentTarget.style.borderColor = hoverBgColor;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    e.currentTarget.style.backgroundColor = backgroundColor;
    e.currentTarget.style.color = color;
    e.currentTarget.style.borderColor = borderColor || backgroundColor;
  };

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        flex,
        height,
        width,
        padding,
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        backgroundColor: isDisabled ? disabledBg : backgroundColor,
        color: isDisabled ? disabledColor : color,
        border: `1px solid ${
          isDisabled ? disabledBg : borderColor || backgroundColor
        }`,
        cursor: isDisabled ? "not-allowed" : "pointer",
        pointerEvents: isDisabled ? "none" : "auto",
        transition: "all 120ms ease-in-out",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
