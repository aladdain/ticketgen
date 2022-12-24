import {
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
	image: string;
	data: ResolvedOCR;
}

const OcrPreviewDialog: FC<Props> = ({ open, onClose, image, data }) => {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Confirm decoded image</DialogTitle>
			<DialogContent>
				{image && data ? (
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<img src={image} alt="" style={{ height: 400 }} />
						</Grid>
						<Grid item xs={6}>
                            {Object.keys(data).map((k, key) =>
                                <Fragment key={key}>
                                    <Typography variant="body2"><b>{k}</b></Typography>
                                    <Typography variant="inherit">{(data as any)[k]}</Typography>
                                </Fragment> 
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
