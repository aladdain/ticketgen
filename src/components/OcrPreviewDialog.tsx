import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
    Typography,
} from "@mui/material";
import { FC, Fragment } from "react";
import { ResolvedOCR } from "../types";

interface Props {
	open: boolean;
	onClose: () => void;
	image: string | null;
	data: ResolvedOCR | null;
}

const OcrPreviewDialog: FC<Props> = ({ open, onClose, image, data }) => {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Confirm decoded image</DialogTitle>
			<DialogContent>
				{image && data ? (
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<img src={image} alt="" style={{ width: 300 }} />
						</Grid>
						<Grid item xs={6}>
                            {Object.keys(data).filter(k => k !== "image" && k !== "qr").map((k, key) =>
                                <Box key={key} sx={{mt: 1}}>
                                    <Typography variant="body2"><b>{k}</b></Typography>
                                    <Typography variant="inherit">{(data as any)[k]}</Typography>
                                </Box> 
                            )}
                        </Grid>
					</Grid>
				) : null}
			</DialogContent>
			<DialogActions>
				<Button variant="text" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default OcrPreviewDialog;
