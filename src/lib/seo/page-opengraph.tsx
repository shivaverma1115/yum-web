import type { CSSProperties } from "react";
import { OgBackgroundLayer } from "@/lib/seo/og-background-layer";
import {
  loadProductOgFonts,
  PRODUCT_OG_SIZE,
} from "@/lib/seo/product-opengraph";

export { PRODUCT_OG_SIZE, loadProductOgFonts };

const rootStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  width: "100%",
  height: "100%",
  fontFamily: "Inter",
};

const contentStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "flex-start",
  flex: 1,
  padding: "56px 72px",
  textAlign: "left",
};

const siteNameStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 600,
  color: "#fdba74",
  marginBottom: 20,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const headlineStyle: CSSProperties = {
  fontSize: 58,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.1,
  marginBottom: 36,
  maxWidth: 620,
};

const ctaStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 220,
  height: 64,
  borderRadius: 999,
  background: "#ea580c",
  color: "#ffffff",
  fontSize: 28,
  fontWeight: 700,
};

type PageOgCardProps = {
  siteName: string;
  headline: string;
  cta?: string;
  backgroundImageUrl?: string;
};

export function PageOgCard({
  siteName,
  headline,
  cta = "Order now",
  backgroundImageUrl,
}: PageOgCardProps) {
  return (
    <div style={rootStyle}>
      <OgBackgroundLayer backgroundImageUrl={backgroundImageUrl} />
      <div style={contentStyle}>
        <div style={siteNameStyle}>{siteName}</div>
        <div style={headlineStyle}>{headline}</div>
        <div style={ctaStyle}>{cta}</div>
      </div>
    </div>
  );
}
