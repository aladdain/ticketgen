import { Add } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { FC, useState } from "react";

const ImageForm: FC = () => {
	const [image, setImage] = useState(null);

	return (
		<Box sx={{ mt: 2 }}>
			<Box
				sx={{
					borderWidth: 1,
					borderStyle: "dashed",
					borderRadius: 3,
					height: 150,
					display: "flex",
					alignItems: "center",
					borderColor: "rgba(255,255,255, 0.3)",
				}}
				justifyContent="center"
			>
				<Button variant="text" startIcon={<Add color="inherit" />}>
					Choose image
				</Button>
			</Box>
		</Box>
	);
};

export default ImageForm;
