import QRCode from "qrcode";
import { TABLE_QR_IMAGE_SIZE } from "@/lib/constants";

export async function generateTableQrPng(scanUrl: string): Promise<Buffer> {
  return QRCode.toBuffer(scanUrl, {
    type: "png",
    width: TABLE_QR_IMAGE_SIZE,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}
