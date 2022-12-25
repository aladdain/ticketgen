import { Add, Close } from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	Divider,
	FormHelperText,
	Stack,
	Typography,
} from "@mui/material";
import { ChangeEvent, FC, useCallback, useState } from "react";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import OcrItem from "../components/OcrItem";

const Ocr: FC = () => {
	const [files, setFiles] = useState<File[]>([]);

	const handleClick = useCallback(
		() => document.getElementById("files")?.click(),
		[]
	);

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) =>
			setFiles((prev) => [
				...prev,
				...Array.from(event.target.files || []).slice(0, 5),
			]),
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
				{files.length === 0 ? (
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
							<FormHelperText sx={{mt:2, textAlign: "center"}}>
								Please select a maximum of 5 tickets per batch
							</FormHelperText>
						</Box>
					</Container>
				) : files.length > 0 ? (
					<Container maxWidth="lg" sx={{ pt: 5 }}>
						<Stack direction={"row"} justifyContent="space-between">
							<Typography
								variant="h6"
								sx={{ fontWeight: 700 }}
							>{`Tickets (${files.length})`}</Typography>
							<Box>
								<Button
									variant="text"
									onClick={() => setFiles([])}
									startIcon={<Close color="inherit" />}
									sx={{mr: 1}}
								>
									Clear
								</Button>
								<Button
									variant="contained"
									startIcon={<Add color="inherit" />}
									onClick={handleClick}
								>
									Add screenshot
								</Button>
							</Box>
							<input
								type="file"
								id="files"
								name="files"
								style={{ display: "none" }}
								multiple
								onChange={onChange}
							/>
						</Stack>
						<Divider sx={{ mt: 2, mb: 2 }} />
						{files.map((k, key) => (
							<OcrItem key={k.name} file={k} index={key} />
						))}
					</Container>
				) : null}
			</Layout>
			<Footer />
		</Stack>
	);
};

export default Ocr;
