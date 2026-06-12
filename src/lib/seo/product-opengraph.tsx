import type { CSSProperties } from "react";
import { OgBackgroundLayer } from "@/lib/seo/og-background-layer";
import { formatProductPriceDisplay } from "@/lib/seo/product-price-display";
import type { IProduct } from "@/types/product";

export const PRODUCT_OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

const INTER_BOLD_URL =
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf";
const INTER_SEMIBOLD_URL =
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf";

export async function loadProductPhotoDataUrl(
  imageUrl: string,
): Promise<string | undefined> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return undefined;
    }

    const mimeType = response.headers.get("content-type") ?? "image/jpeg";
    const buffer = Buffer.from(await response.arrayBuffer());
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export async function loadProductOgFonts() {
  const [bold, semibold] = await Promise.all([
    fetch(INTER_BOLD_URL).then((response) => response.arrayBuffer()),
    fetch(INTER_SEMIBOLD_URL).then((response) => response.arrayBuffer()),
  ]);

  return [
    {
      name: "Inter",
      data: bold,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: semibold,
      weight: 600 as const,
      style: "normal" as const,
    },
  ];
}

type ProductOgCardProps = {
  product: IProduct;
  siteName: string;
  currencySymbol: string;
  productImageUrl?: string;
  backgroundImageUrl?: string;
};

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
  flex: 1,
  padding: "56px 72px",
};

const siteNameStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 600,
  color: "#fdba74",
  marginBottom: 20,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

const titleStyle: CSSProperties = {
  fontSize: 58,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.1,
  marginBottom: 28,
  maxWidth: 620,
};

const priceRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 16,
  marginBottom: 36,
};

const priceStyle: CSSProperties = {
  fontSize: 44,
  fontWeight: 700,
  color: "#fef3c7",
};

const originalPriceStyle: CSSProperties = {
  fontSize: 30,
  fontWeight: 600,
  color: "#9ca3af",
  textDecoration: "line-through",
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

const imagePanelStyle: CSSProperties = {
  position: "relative",
  display: "flex",
  width: 420,
  height: "100%",
  padding: "40px 40px 40px 0",
};

const imageFrameStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  borderRadius: 24,
  overflow: "hidden",
  border: "4px solid rgba(255, 255, 255, 0.2)",
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export function ProductOgCard({
  product,
  siteName,
  currencySymbol,
  productImageUrl,
  backgroundImageUrl,
}: ProductOgCardProps) {
  const price = formatProductPriceDisplay(product, currencySymbol);

  return (
    <div style={rootStyle}>
      <OgBackgroundLayer backgroundImageUrl={backgroundImageUrl} />
      <div style={contentStyle}>
        <div style={siteNameStyle}>{siteName}</div>
        <div style={titleStyle}>{product.name}</div>
        {price ? (
          <div style={priceRowStyle}>
            <div style={priceStyle}>{price.price}</div>
            {price.originalPrice ? (
              <div style={originalPriceStyle}>{price.originalPrice}</div>
            ) : null}
          </div>
        ) : null}
        <div style={ctaStyle}>Order now</div>
      </div>
      {productImageUrl ? (
        <div style={imagePanelStyle}>
          <div style={imageFrameStyle}>
            <img src={productImageUrl} alt="" style={imageStyle} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

type FallbackOgCardProps = {
  siteName: string;
  backgroundImageUrl?: string;
};

export function FallbackOgCard({
  siteName,
  backgroundImageUrl,
}: FallbackOgCardProps) {
  return (
    <div style={rootStyle}>
      <OgBackgroundLayer backgroundImageUrl={backgroundImageUrl} />
      <div style={contentStyle}>
        <div style={{ ...siteNameStyle, marginBottom: 0 }}>{siteName}</div>
        <div style={{ ...titleStyle, maxWidth: 620 }}>Fresh food, delivered fast</div>
        <div style={ctaStyle}>Order now</div>
      </div>
    </div>
  );
}
