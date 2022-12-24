import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Link,
	Typography,
} from "@mui/material";
import { ChangeEvent, FC, useCallback, useState } from "react";
import XLSX from "xlsx"
import { DataProps, XlsxDataProps } from "../types";
import * as zip from "@zip.js/zip.js";
import Editor from "../lib/editor";
import { Blob } from "buffer";
import { format, isValid } from "date-fns";
import { genCode } from "../lib/helpers";
import { useSnackbar } from "notistack";
import { collection, doc, writeBatch } from "firebase/firestore/lite";
import { db } from "../lib/firebase";

interface Props {
	open: boolean;
	onClose: () => void;
}

export const BatchDialog: FC<Props> = ({ open, onClose }) => {
	const [processing, setProcessing] = useState(false);

	const {enqueueSnackbar} = useSnackbar()

	const downloadFile = useCallback((blob:any) => {
		const a = Object.assign(document.createElement("a"), {
			download: `tickets-${format(new Date(), "yyyy/MM/dd")}.zip`,
			href: URL.createObjectURL(blob),
			textContent: "d",
			style: {display: "none"}
		})
		document.body.appendChild(a).click();
	}, [])

	const process = useCallback((event:ChangeEvent<HTMLInputElement>) => {
		if (processing) return;
		const files = event.target.files
		if(files && files.length > 0) {
			const _file = files[0]
			const reader = new FileReader()
			reader.onload = async (e) => {
				try {					
					setProcessing(true);
					const wb = XLSX.read(e.target?.result)
					const data = XLSX.utils.sheet_to_json<XlsxDataProps>(wb.Sheets[wb.SheetNames[0]])
					const editor_reg = new Editor("ticket.pdf")
					const editor_vip = new Editor("vip.pdf")
					const zipWriter = new zip.ZipWriter(new zip.BlobWriter("application/zip"));
					if(data.length > 0) {
						const _data = data.filter(k => 
								k.name 
								&& k.membership 
								&& k.area 
								&& k.row 
								&& k.seat 
								&& k.date && isValid(new Date(k.date)) 
								&& k.code 
								&& k.entry
								&& (k.vip || (!k.vip && k.door)))
						if(_data.length < data.length) {
							const msg = "One or more rows contains invalid data"
							enqueueSnackbar(msg, {variant: "error"})
							throw new Error(msg)
						}
						const batch = writeBatch(db)
						let promises:Promise<zip.EntryMetaData>[] = data.map(async k => {
							let _k = k
							_k["qr"] = await genCode(_k.code.toString())
							batch.set(doc(collection(db, "buys")), {..._k, createdAt: new Date()})
							const pdf = await (k.vip ? editor_vip.edit(_k, "vip") : editor_reg.edit(_k, "regular"))
							return zipWriter.add(`${k.area}-${k.row}-${k.seat}.pdf`, new zip.Uint8ArrayReader(pdf as Uint8Array))
						})
						await Promise.all(promises)
						const blob = await zipWriter.close()
						downloadFile(blob)
						await batch.commit()
						enqueueSnackbar("Tickets generated successfully", {variant: "success"})
					} else {
						enqueueSnackbar("File is empty !", {variant: "error"})
					}
					setProcessing(false);
				} catch (error) {
					console.error(error)
					setProcessing(false);
					enqueueSnackbar("Something wrong happened", {variant: "error"})
				}
			}
			reader.readAsArrayBuffer(_file)
		} else {
			enqueueSnackbar("No file provided", {variant: "error"})
		}
	}, [processing]);


	const handleClick = useCallback(() => document.getElementById("fi")?.click(), [])

	return (
		<Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
			<DialogTitle>Generate multiple tickets</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<Typography variant="inherit">
						choose a file that contains tickets information. Make
						sure the file follows{" "}
						<Link
							href="template.xlsx"
							download={"template.xlsx"}
							target="_blank"
						>
							this template
						</Link>
					</Typography>
				</DialogContentText>
				<Button
					variant="contained"
					fullWidth
					sx={{ mt: 3 }}
					disableElevation
					onClick={handleClick}
					size="large"
					endIcon={processing ? <CircularProgress size={20} color="inherit" /> : null}
				>
					{processing ? "Processing..." : "Generate"}
				</Button>
				<input
					id="fi"
					name="fi"
					type="file"
					style={{ display: "none" }}
					accept="xlsx"
					onChange={process}
				/>
			</DialogContent>
			<DialogActions>
				<Button variant="text" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default BatchDialog;
