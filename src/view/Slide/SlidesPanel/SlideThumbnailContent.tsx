const SimplifiedTextElement: React.FC<{
  element: any;
  scale: number;
  isSelected?: boolean;
}> = ({ element, isSelected = false }) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.sizes.width}px`,
    height: `${element.sizes.height}px`,
    fontFamily: element.style?.fontFamily || "Arial",
    fontSize: `${element.style?.fontSize || 14}px`,
    fontWeight: element.style?.fontWeight || "normal",
    fontStyle: element.style?.fontStyle || "normal",
    color: element.style?.color?.color || "#000000",
    padding: "4px",
    boxSizing: "border-box",
    pointerEvents: "none",
    userSelect: "none",
    whiteSpace: 'pre-wrap',
    lineHeight: "1.5", 
    border: isSelected ? "2px solid #1a73e8" : "none", 
   
  };

  return <div style={style}>{element.content || null}</div>;
};

const SimplifiedImageElement: React.FC<{
  element: any;
  scale: number;
  isSelected?: boolean;
}> = ({ element, isSelected = false }) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${element.position.x}px`,
    top: `${element.position.y}px`,
    width: `${element.sizes.width}px`,
    height: `${element.sizes.height}px`,
    pointerEvents: "none",
    userSelect: "none",
    overflow: "hidden",
    border: isSelected ? "2px solid #1a73e8" : "none", 
  };

  const imgStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };

  return (
    <div style={style}>
      <img src={element.src} alt="Изображение" style={imgStyle} draggable={false} />
    </div>
  );
};

export{
  SimplifiedImageElement,
  SimplifiedTextElement
}