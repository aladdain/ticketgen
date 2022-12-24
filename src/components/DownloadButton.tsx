import { Download } from "@mui/icons-material";
import { Button, CircularProgress } from "@mui/material";
import { addDoc, collection} from "firebase/firestore/lite";
import { useSnackbar } from "notistack";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { EditorContext } from "../EditorContext";
import { db } from "../lib/firebase";
import { _arrayBufferToBase64 } from "../lib/helpers";
import { DataProps } from "../types";

interface Props {
	data: DataProps;
	onSuccess: () => void
}

const DownloadButton: FC<Props> = ({ data, onSuccess }) => {
	const [processing, setProcessing] = useState(false);

	const {
		state: { pdfData },
	} = useContext(EditorContext);

	const {enqueueSnackbar} = useSnackbar()

	const process = useCallback(() => {
		if (processing) return;
		if (!pdfData) {
			enqueueSnackbar("Please fill the form, apply changes then download", {variant: "error"})
			return
		}
		document.getElementById("dwn")?.click();
		setProcessing(true);
		addDoc(collection(db, "buys"), {
			...{...data, qr: ""},
			createdAt: new Date(),
		})
			.then(() => {
				enqueueSnackbar("Ticket generated successfully", {variant: "success"})
				onSuccess()
			})
			.catch((err) => {
				console.error(err);
				enqueueSnackbar("Oops, something wrong happened", {variant: "error"})
			})
			.finally(() => setProcessing(false));
	}, [processing, data, pdfData, onSuccess]);

	const str = useMemo(
		() => (pdfData ?  "data:application/octet;base64," + _arrayBufferToBase64(pdfData) : ""),
		[pdfData]
	);

	return (
		<>
			<Button
				key="b0"
				startIcon={<Download color="inherit" />}
				variant="contained"
				disabled={!(data.qr && pdfData)}
				endIcon={
					processing ? (
						<CircularProgress size={16} color="inherit" />
					) : null
				}
				onClick={process}
				fullWidth
			>
				{processing ? "Processing..." : "Download"}
			</Button>
			{data.area && data.seat ? (
				<a
					id="dwn"
					href={str}
					rel="noreferrer"
					download={`${data.area}-${data.row}-${data.seat}.pdf`}
					target="_blank"
					style={{visibility: "hidden"}}
				>a</a>
			) : null}
		</>
	);
};

export default DownloadButton;
