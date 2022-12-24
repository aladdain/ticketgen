import {
    Box,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Skeleton,
	Stack,
    Typography,
} from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { OCRResponse, ResolvedOCR } from "../types";
import { gates, gates_doors, vip_gates } from "./Form";

interface Props {
	file: File;
}

const OcrItem: FC<Props> = ({ file }) => {
	const [image, setImage] = useState<string | null>(null);
	const [processing, setProcessing] = useState(false);
	const [ocrData, setOcrData] = useState<ResolvedOCR | null>(null);

	const handleFile = useCallback((file: File) => {
		const reader = new FileReader();
		reader.onload = async (e) => {
			setImage(e.target?.result as string);
			//const parsed = await ocrFile(data as string)
			//console.log(parsed)
		};
		reader.readAsDataURL(file);
	}, []);

	const handleImage = useCallback(
		async (image: string) => {
			if (processing) return;
			setProcessing(true);
			try {
				const formData = new FormData();
				formData.append("base64image", image);
				formData.append("language", "eng");
				formData.append("apikey", "K89843749188957");
				formData.append("filetype", "JPG");
				formData.append("istable", "true");
				formData.append("ocrengine", "5");
				const json = await fetch("https://api.ocr.space/parse/image", {
					method: "post",
					body: formData,
				});
				const response: OCRResponse = await json.json();
				console.log(response);
				if (response.IsErroredOnProcessing)
					throw new Error("OCR Error");
				const result = response.ParsedResults[0];
				if (result.ErrorMessage) throw new Error(result.ErrorMessage);
				let data = result.ParsedText.split("\t\r\n");
				if (data.length < 15) throw new Error("Parse Error");
				const isVip = vip_gates.find((k) =>
					data[13].toLowerCase().includes(k.toLowerCase())
				);
				let entry = "";
				let door = "";
				if (isVip) {
					entry = data[13].split("\t")[0];
				} else {
					door = data[13].split(" ")[1].split("\t")[0];
					entry = gates
						.map((k) =>
							gates_doors[k].find((x) => x === door) ? k : null
						)
						.filter((k) => k)[0] as string;
				}
				const parsedData: ResolvedOCR = {
					membership: data[5],
					name: (
						data[9].match(/Arsenal\sv\s([a-zA-Z\s]+)/) as any
					)[1].trim() as string,
					date: (data[9].match(/\s([1-9]{1,2}\s+.*)/) as any)[1],
					area: data[11].split("\t")[0],
					row: data[11].split("\t")[1],
					seat: data[11].split("\t")[2],
					code: data[14],
					type: isVip ? "vip" : "regular",
					door,
					entry,
					image: "",
					qr: "",
				};
				setOcrData(parsedData);
                setProcessing(false)
			} catch (error) {
				console.error(error);
				setProcessing(false);
			}
		},
		[processing]
	);

	useEffect(() => {
		if (file) {
			handleFile(file);
		}
	}, [file]);

	useEffect(() => {
		if (image && !ocrData) {
            handleImage(image)
		}
	}, [image, ocrData]);

	return (
		<Card sx={{ mb: 3 }}>
			<Stack direction={"row"} spacing={1}>
				{image ? (
					<CardMedia
						component={"img"}
						image={image}
						sx={{ width: 200, height: 200, objectFit: "cover" }}
						alt="ticket"
					/>
				) : (
					<Skeleton variant="rectangular" width={200} height={200} />
				)}
				<CardContent>
					{processing ? (
						<>
							<Skeleton variant="text" width={200} />
							<Skeleton
								variant="text"
								width={100}
								sx={{ mt: 1 }}
							/>
						</>
					) : (
						<Stack
							direction={"column"}
							justifyContent="space-between"
						>
                            {ocrData && (
                                <Box sx={{textAlign: "left"}}>
                                    <Typography variant="h6" sx={{fontWeight: 700}}>{`Arsenal v ${ocrData.name}`}</Typography>
                                    <Typography variant="body2" color="GrayText">{ocrData.date}</Typography>
                                    <Typography variant="body2" sx={{mt: 1}}>{`Type: ${ocrData.type}`}</Typography>
                                    <Typography variant="body2">{`Membership: ${ocrData.membership}`}</Typography>
                                    <Typography variant="body2">{`Area: ${ocrData.area}, Row: ${ocrData.row}, Seat: ${ocrData.seat}`}</Typography>
                                    <Typography variant="body2">{`Entrance: ${ocrData.entry} ${ocrData.door}`}</Typography>
                                    <Typography variant="body2">{`Code: ${ocrData.code}`}</Typography>
                                </Box>
                            )}
                        </Stack>
					)}
				</CardContent>
			</Stack>
		</Card>
	);
};

export default OcrItem;
