import QRcode from "qrcode";

export const genCode = async (input: string) => {
	return QRcode.toDataURL(input, {
		type: "image/jpeg",
		rendererOpts: { quality: 1 },
	});
};


export function _arrayBufferToBase64( buffer:ArrayBufferLike ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}