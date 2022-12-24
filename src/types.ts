export type DataProps = {
    name: string
    area: string
    row: string
    seat: string
    image: string
    date: string
    membership: string
    entry?: string
    code: string
    qr: string
    door?: string
}

export type XlsxDataProps = DataProps & {
    vip: boolean
}

export type ResolvedOCR = DataProps & {
    type: "regular" | "vip"
}

export type OCRResponse = {
	ParsedResults: {
		FileParseExitCode: number;
		ParsedText: string;
		ErrorMessage: string;
		ErrorDetails: string;
	}[];
	IsErroredOnProcessing: boolean;
	OCRExitCode: number;
};