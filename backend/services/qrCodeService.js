import QRCode from "qrcode";

/**
 * Returns a QR code with the input text in SVG format.
 * @param {string} text The string to encode in the QR code.
 * @returns {string} SVG code for the QR code.
 */
export async function createQrCode(text) {
    try {
        const qrOptions = {
            // options: L, M, Q, H ; higher = more error correction
            errorCorrectionLevel: 'M',
            type: 'svg',
            margin: 1,
            width: 300,
        };

        // Generate QR code as SVG string
        const qrCodeSvg = await QRCode.toString(text, qrOptions);
        return qrCodeSvg;

    } catch {
        throw new Error("Failed to generate QR code");
    }
}
