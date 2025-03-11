interface Props {
  type?: "button" | "submit" | "reset";
  height?: string;
  width?: string;
  padding?: string;
  color: string;
  backgroundColor?: string;
  children: React.ReactNode;
  borderColor?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  hoverColor: string;
  hoverBgColor: string;
  flex?: number;
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
  onClick,
}: Props) => {
  return (
    <button
      type={type}
      style={{
        flex,
        height,
        padding,
        backgroundColor,
        width,
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        border: `1px solid ${borderColor || backgroundColor}`,
        color,
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = hoverBgColor || "inherit";
        e.currentTarget.style.color = hoverColor;
        e.currentTarget.style.borderColor = hoverBgColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = backgroundColor;
        e.currentTarget.style.color = color;
        e.currentTarget.style.borderColor = borderColor || backgroundColor;
      }}
    >
      {children}
    </button>
  );
};

export default Button;
