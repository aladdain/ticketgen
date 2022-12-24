import { Add } from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { ChangeEvent, FC, useCallback, useState } from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import OcrItem from "../components/OcrItem";

const Ocr: FC = () => {
	const [files, setFiles] = useState<FileList | null>(null);

	const handleClick = useCallback(
		() => document.getElementById("files")?.click(),
		[]
	);

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => setFiles(event.target.files),
		[]
	);

	return (
		<Stack
			direction={"column"}
			justifyContent="space-between"
			spacing={0}
			sx={{ minHeight: "100vh" }}
		>
			<Layout>
				{!files ? (
					<Container maxWidth="sm">
						<Box
							sx={{
								p: 5,
								borderStyle: "dashed",
								borderWidth: 1,
								borderColor: "rgba(255, 255,255, 0.3)",
								borderRadius: 3,
								testAlign: "center",
								mt: 5,
							}}
						>
							<Typography variant="body1">
								Drop the tickets screenshots here, you can add
								as many as you'd want.
							</Typography>
							<Button
								variant="contained"
								size="large"
								sx={{ mt: 2 }}
								startIcon={<Add color="inherit" />}
								onClick={handleClick}
							>
                                Select screenshots
							</Button>
							<input
								type="file"
								id="files"
								name="files"
								style={{ display: "none" }}
								multiple
								onChange={onChange}
							/>
						</Box>
					</Container>
				) : files.length > 0 ? (
					<Container maxWidth="lg" sx={{pt: 5}}>
						{Array.from(files).map((k, key) => (
							<OcrItem key={k.name} file={k} />
						))}
					</Container>
				) : null}
			</Layout>
			<Footer />
		</Stack>
	);
};

export default Ocr;
