import QRCode from "qrcode";

/**
 * Generate a QR code SVG containing the input text.
 */
export async function createQrCode(text) {
    try {
        const qrOptions = {
            errorCorrectionLevel: 'M', // L, M, Q, H (higher = more error correction)
            type: 'svg',
            margin: 1,
            width: 300,
        };

        // Generate QR code as SVG string
        const qrCodeSvg = await QRCode.toString(text, qrOptions);
        return qrCodeSvg;

    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}
