import type { CSSProperties } from "react";
import { OgBackgroundLayer } from "@/lib/seo/og-background-layer";
import {
  getOgProductDescription,
  getOgProductFeatures,
  getOgProductPrice,
  splitProductName,
} from "@/lib/seo/product-og-helpers";
import type { IProduct } from "@/types/product";

export const PRODUCT_OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

const INTER_BOLD_URL =
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf";
const INTER_SEMIBOLD_URL =
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf";
const PLAYFAIR_BOLD_URL =
  "https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf";

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
  const [interBold, interSemiBold, playfairBold] = await Promise.all([
    fetch(INTER_BOLD_URL).then((response) => response.arrayBuffer()),
    fetch(INTER_SEMIBOLD_URL).then((response) => response.arrayBuffer()),
    fetch(PLAYFAIR_BOLD_URL).then((response) => response.arrayBuffer()),
  ]);

  return [
    {
      name: "Inter",
      data: interBold,
      weight: 700 as const,
      style: "normal" as const,
    },
    {
      name: "Inter",
      data: interSemiBold,
      weight: 600 as const,
      style: "normal" as const,
    },
    {
      name: "Playfair Display",
      data: playfairBold,
      weight: 700 as const,
      style: "normal" as const,
    },
  ];
}

type ProductOgCardProps = {
  product: IProduct;
  siteName: string;
  currencySymbol: string;
  productImageUrl?: string;
};

const rootStyle: CSSProperties = {
  display: "flex",
  width: "100%",
  height: "100%",
  fontFamily: "Inter",
  background: "#111111",
};

const leftPanelStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "54%",
  height: "100%",
  padding: "44px 52px 40px",
  background: "linear-gradient(160deg, #0d0d0d 0%, #171717 55%, #121212 100%)",
};

const brandRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 28,
};

const brandIconStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 42,
  height: 42,
  borderRadius: 999,
  background: "#ea580c",
  color: "#ffffff",
  fontSize: 20,
  fontWeight: 700,
};

const brandNameStyle: CSSProperties = {
  fontSize: 26,
  fontWeight: 700,
  color: "#ffffff",
  letterSpacing: "0.04em",
};

const titleRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "baseline",
  gap: 14,
  marginBottom: 14,
};

const titleFirstStyle: CSSProperties = {
  fontFamily: "Playfair Display",
  fontSize: 62,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1,
};

const titleRestStyle: CSSProperties = {
  fontFamily: "Playfair Display",
  fontSize: 62,
  fontWeight: 700,
  color: "#ea580c",
  lineHeight: 1,
};

const descriptionStyle: CSSProperties = {
  fontSize: 19,
  fontWeight: 600,
  color: "#d1d5db",
  lineHeight: 1.45,
  marginBottom: 26,
  maxWidth: 500,
};

const priceRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 18,
  marginBottom: 14,
};

const priceStyle: CSSProperties = {
  fontSize: 48,
  fontWeight: 700,
  color: "#ffffff",
};

const originalPriceStyle: CSSProperties = {
  fontSize: 30,
  fontWeight: 600,
  color: "#9ca3af",
  textDecoration: "line-through",
};

const discountBadgeStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "2px solid #ea580c",
  borderRadius: 8,
  padding: "8px 18px",
  color: "#ea580c",
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 8,
  width: 160,
};

const featuresRowStyle: CSSProperties = {
  display: "flex",
  gap: 22,
};

const featureItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const featureIconStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  borderRadius: 999,
  background: "#ea580c",
  color: "#ffffff",
  fontSize: 16,
  fontWeight: 700,
};

const featureLabelStyle: CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: "#e5e7eb",
};

const imagePanelStyle: CSSProperties = {
  display: "flex",
  position: "relative",
  width: "46%",
  height: "100%",
};

const heroImageStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const imageFadeStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: 120,
  height: "100%",
  display: "flex",
  background:
    "linear-gradient(90deg, #121212 0%, rgba(18, 18, 18, 0.55) 55%, rgba(18, 18, 18, 0) 100%)",
};

const imagePlaceholderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  background: "#1f2937",
  color: "#9ca3af",
  fontSize: 24,
  fontWeight: 600,
};

function FeaturePill({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={featureItemStyle}>
      <div style={featureIconStyle}>{icon}</div>
      <div style={featureLabelStyle}>{label}</div>
    </div>
  );
}

export function ProductOgCard({
  product,
  siteName,
  currencySymbol,
  productImageUrl,
}: ProductOgCardProps) {
  const { first, rest } = splitProductName(product.name);
  const description = getOgProductDescription(product);
  const price = getOgProductPrice(product, currencySymbol);
  const features = getOgProductFeatures(product);

  return (
    <div style={rootStyle}>
      <div style={leftPanelStyle}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={brandRowStyle}>
            <div style={brandIconStyle}>Y</div>
            <div style={brandNameStyle}>{siteName.toUpperCase()}</div>
          </div>

          <div style={titleRowStyle}>
            <div style={titleFirstStyle}>{first}</div>
            {rest ? <div style={titleRestStyle}>{rest}</div> : null}
          </div>

          {description ? (
            <div style={descriptionStyle}>{description}</div>
          ) : null}

          {price ? (
            <div style={priceRowStyle}>
              <div style={priceStyle}>{price.price}</div>
              {price.originalPrice ? (
                <div style={originalPriceStyle}>{price.originalPrice}</div>
              ) : null}
            </div>
          ) : null}

          {price?.discountPercent ? (
            <div style={discountBadgeStyle}>SAVE {price.discountPercent}%</div>
          ) : null}
        </div>

        <div style={featuresRowStyle}>
          {features.map((feature) => (
            <FeaturePill
              key={feature.label}
              icon={feature.icon}
              label={feature.label}
            />
          ))}
        </div>
      </div>

      <div style={imagePanelStyle}>
        {productImageUrl ? (
          <div
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <img src={productImageUrl} alt="" style={heroImageStyle} />
            <div style={imageFadeStyle} />
          </div>
        ) : (
          <div style={imagePlaceholderStyle}>Product image</div>
        )}
      </div>
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
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        fontFamily: "Inter",
      }}
    >
      <OgBackgroundLayer backgroundImageUrl={backgroundImageUrl} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          flex: 1,
          padding: "56px 72px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#fdba74",
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 36,
          }}
        >
          Fresh food, delivered fast
        </div>
        <div
          style={{
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
          }}
        >
          Order now
        </div>
      </div>
    </div>
  );
}
