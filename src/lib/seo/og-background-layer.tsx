import type { CSSProperties } from "react";

const absoluteFillStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
};

const fallbackStyle: CSSProperties = {
  ...absoluteFillStyle,
  display: "flex",
  background:
    "linear-gradient(135deg, #111827 0%, #1f2937 45%, #7c2d12 100%)",
};

const backgroundRootStyle: CSSProperties = {
  ...absoluteFillStyle,
  display: "flex",
};

const backgroundImageStyle: CSSProperties = {
  ...absoluteFillStyle,
  objectFit: "cover",
};

const overlayStyle: CSSProperties = {
  ...absoluteFillStyle,
  display: "flex",
  background:
    "linear-gradient(90deg, rgba(0, 0, 0, 0.78) 0%, rgba(0, 0, 0, 0.45) 42%, rgba(0, 0, 0, 0.12) 100%)",
};

type OgBackgroundLayerProps = {
  backgroundImageUrl?: string;
};

export function OgBackgroundLayer({ backgroundImageUrl }: OgBackgroundLayerProps) {
  if (!backgroundImageUrl) {
    return <div style={fallbackStyle} />;
  }

  return (
    <div style={backgroundRootStyle}>
      <img src={backgroundImageUrl} alt="" style={backgroundImageStyle} />
      <div style={overlayStyle} />
    </div>
  );
}
