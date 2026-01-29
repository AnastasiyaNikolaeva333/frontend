export function LoadingSplash({ text = "Загрузка…" }: { text?: string }) {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        background: "#f6f6f6",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "5px solid #d0d0d0",
          borderTopColor: "#007acc",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <div style={{ color: "#444" }}>{text}</div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
