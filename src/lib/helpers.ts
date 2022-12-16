import QRcode from "qrcode";

export const genCode = async (input: string) => {
	return QRcode.toDataURL(input, {
		type: "image/jpeg",
		rendererOpts: { quality: 1 },
	});
};
