import logoPath from "../../../assets/svgs/logos/logo-2.svg";

export default function LogoComponent() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", maxHeight: "40px"}}>
      <img
        src={logoPath}
        style={{ width: "32px", height: "32px" }}
        alt="Logo"
      />
      <span style={{ fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>
        CriticalStack
      </span>
    </div>
  );
}
