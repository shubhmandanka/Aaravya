import QRCode from "qrcode";

/** Google Maps "directions to" link (Maps URLs API) — opens the Maps app on phones. */
export function directionsUrl(address: string) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

/**
 * QR code as an SVG string, generated on the server at render time (the
 * footer is part of the statically prerendered layout, so this runs at build
 * / revalidation, never in the browser and never via a third-party service).
 * Forest-900 modules on a white quiet zone: phone cameras need the contrast, so
 * don't invert it to match the dark footer. Level L keeps the ~190-char
 * address URL at 49 modules; an on-screen code never gets physically damaged.
 */
export function qrSvg(text: string) {
  return QRCode.toString(text, {
    type: "svg",
    errorCorrectionLevel: "L",
    margin: 2,
    color: { dark: "#1C3621", light: "#ffffff" },
  });
}
