interface Props {
  height?: string;
  width?: string;
  padding?: string;
  color: string;
  backgroundColor?: string;
  children: React.ReactNode;
  borderColor?: string;
  onClick: () => void;
  hoverColor: string;
  hoverBgColor: string;
}

const Button = ({
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
      style={{
        height,
        padding,
        backgroundColor,
        width,
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "center",
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
