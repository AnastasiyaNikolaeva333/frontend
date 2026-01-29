const renderSlideBackground = (background: {
  type: string;
  color?: string;
  src?: string;
  colors?: Array<{ color: string }>;
}) => {
  switch (background.type) {
    case "color":
      return { backgroundColor: background.color };
    case "picture":
      return {
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    case "gradient": {
      const gradientColors = background.colors?.map((color) => color.color).join(", ") || "";
      return { background: `linear-gradient(135deg, ${gradientColors})` };
    }
    default:
      return { backgroundColor: "#ffffff" };
  }
};

export {
   renderSlideBackground,
}