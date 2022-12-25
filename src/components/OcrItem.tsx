import { Check, Download } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	CardMedia,
	CircularProgress,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import { addDoc, collection } from "firebase/firestore/lite";
import { useSnackbar } from "notistack";
import {
	FC,
	MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import Editor from "../lib/editor";
import { db } from "../lib/firebase";
import { genCode, _arrayBufferToBase64 } from "../lib/helpers";
import { OCRResponse, ResolvedOCR } from "../types";
import { gates, gates_doors, vip_gates } from "./Form";
import OcrPreviewDialog from "./OcrPreviewDialog";

interface Props {
	file: File;
	index: number;
}

const OcrItem: FC<Props> = ({ file, index }) => {
	const [image, setImage] = useState<string | null>(null);
	const [processing, setProcessing] = useState(false);
	const [ocrData, setOcrData] = useState<ResolvedOCR | null>(null);
	const [previewOpen, setPreviewOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [generating, setGenerating] = useState(false);
	const [generated, setGenerated] = useState(false);

	const handleFile = useCallback((file: File) => {
		const reader = new FileReader();
		reader.onload = async (e) => {
			setImage(e.target?.result as string);
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
				//console.log(response);
				if (response.IsErroredOnProcessing)
					throw new Error("OCR Error");
				const result = response.ParsedResults[0];
				if (result.ErrorMessage) throw new Error(result.ErrorMessage);
				let data = result.ParsedText.split("\t\r\n");
				if (data.length < 15) throw new Error("Parse Error");
				//console.log(data)
				if (data.length === 15) {
					data.unshift("added");
				}
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
				let parsedData: ResolvedOCR;
				let dt = (data[9].match(/\s([1-9]{1,2}\s+.*)/) as any)[1];
				let ndt = `${dt} ${new Date().getFullYear()}`;
				ndt =
					new Date() > new Date(ndt)
						? `${dt} ${new Date().getFullYear() + 1}`
						: `${dt} ${new Date().getFullYear()}`;
				parsedData = {
					membership: data[5],
					name: (
						data[9].match(/Arsenal\sv\s([a-zA-Z\s]+)/) as any
					)[1].trim() as string,
					date: ndt,
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
				setProcessing(false);
			} catch (error) {
				console.error(error);
				setError(error as string);
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
			setTimeout(() => handleImage(image), 2500 * index);
		}
	}, [image, ocrData, index]);

	const togglePreview = useCallback(
		() => setPreviewOpen((prev) => !prev),
		[]
	);

	const handleAction = useCallback(
		() => (image && ocrData ? togglePreview() : null),
		[image, ocrData, togglePreview]
	);

	const { enqueueSnackbar } = useSnackbar();

	const generate = useCallback(
		async (event: MouseEvent) => {
			event.stopPropagation();
			if (generating) return;
			if (!ocrData) return;
			setGenerating(true);
			try {
				const _data = { ...ocrData };
				_data["qr"] = await genCode(_data.code);
				const editor = new Editor(
					ocrData.type === "regular" ? "ticket.pdf" : "vip.pdf"
				);
				const pdfData = await editor.edit(_data, ocrData.type);
				if (pdfData) {
					const a = Object.assign(document.createElement("a"), {
						download: `${_data.area}-${_data.row}-${_data.seat}.pdf`,
						href:
							"data:application/octet;base64," +
							_arrayBufferToBase64(pdfData),
						textContent: "d",
						style: { display: "none" },
					});
					document.body.appendChild(a).click();
					await addDoc(collection(db, "buys"), {
						...{ ..._data, qr: "" },
						createdAt: new Date(),
					});
				} else {
					throw new Error("PDF error");
				}
				setGenerating(false);
				enqueueSnackbar("Ticket generated successfully", {
					variant: "success",
				});
				setGenerated(true);
			} catch (error) {
				console.error(error);
				enqueueSnackbar("Error generating Ticket", {
					variant: "error",
				});
				setGenerating(false);
			}
		},
		[generating, ocrData]
	);

	return (
		<>
			<Card sx={{ mb: 3, opacity: error ? 0.5 : 1 }}>
				<CardActionArea onClick={handleAction}>
					<Stack direction={"row"} spacing={1}>
						{image ? (
							<CardMedia
								component={"img"}
								image={image}
								sx={{
									width: 210,
									height: 210,
									objectFit: "cover",
								}}
								alt="ticket"
							/>
						) : (
							<Skeleton
								variant="rectangular"
								width={210}
								height={210}
							/>
						)}
						<Box sx={{ flexGrow: 1, textAlign: "left", pr: 1 }}>
							{ocrData && (
								<CardHeader
									title={`Arsenal v ${ocrData.name}`}
									subheader={ocrData.date}
									sx={{ pb: 0 }}
									action={
										!generated ? (
											<Button
												startIcon={
													!generating ? (
														<Download color="inherit" />
													) : null
												}
												variant="outlined"
												endIcon={
													generating ? (
														<CircularProgress
															size={16}
															color={"inherit"}
														/>
													) : null
												}
												onClick={generate}
											>
												{generating
													? "Processing..."
													: "Generate"}
											</Button>
										) : (
											<Button
												startIcon={
													<Check color="inherit" />
												}
												variant="outlined"
												disabled={true}
											>
												Generated
											</Button>
										)
									}
								/>
							)}
							{error && (
								<>
									<Typography variant="body1" color={"error"}>
										Error parsing the image
									</Typography>
									<Typography variant="body2" color={"error"}>
										Contact developer
									</Typography>
								</>
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
									<>
										{ocrData && (
											<Box sx={{ textAlign: "left" }}>
												<Typography variant="body2">{`Type: ${ocrData.type}`}</Typography>
												<Typography variant="body2">{`Membership: ${ocrData.membership}`}</Typography>
												<Typography variant="body2">{`Area: ${ocrData.area}, Row: ${ocrData.row}, Seat: ${ocrData.seat}`}</Typography>
												<Typography variant="body2">{`Entrance: ${ocrData.entry} ${ocrData.door}`}</Typography>
												<Typography variant="body2">{`Code: ${ocrData.code}`}</Typography>
											</Box>
										)}
									</>
								)}
							</CardContent>
						</Box>
					</Stack>
				</CardActionArea>
			</Card>
			<OcrPreviewDialog
				open={previewOpen}
				onClose={togglePreview}
				image={image}
				data={ocrData}
			/>
		</>
	);
};

export default OcrItem;
