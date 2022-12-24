import { Box, Stack, Typography } from "@mui/material";
import { DocumentData } from "firebase/firestore/lite";
import { SnackbarProvider } from "notistack";
import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { checkConfig } from "./lib/config";
import Home from "./views/Home";
import Ocr from "./views/ocr";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />
	},
	{
		path: "ocr",
		element: <Ocr />
	}
])

function App() {
	const [ready, setReady] = useState(false);
	const [config, setConfig] = useState<DocumentData | undefined>(undefined);

	useEffect(() => {
		if (!ready) {
			checkConfig()
				.then((r) => {
					setConfig(r.data());
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [ready]);

	useEffect(() => {
		if (config) {
			setReady(true);
		}
	}, [config]);

	return (
		<SnackbarProvider maxSnack={3}>
			<div className="App">
				{ready && (
					<>
						{config?.enabled ? (
							<RouterProvider router={router} />
						) : (
							<Box sx={{ p: 5 }}>
								<Typography>
									Please contact developer
								</Typography>
							</Box>
						)}
					</>
				)}
			</div>
		</SnackbarProvider>
	);
}

export default App;
