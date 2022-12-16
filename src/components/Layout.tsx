import { Grid, Toolbar } from "@mui/material";
import { FC } from "react";
import { CookiesProvider } from "react-cookie";
import { EditorProvider } from "../EditorContext";
import Form from "./Form";
import NavBar from "./NavBar";
import Viewer from "./Viewer";

const Layout: FC = () => {
	return (
		<div>
			<NavBar />
			<Toolbar />
			<CookiesProvider>
				<EditorProvider>
					<Grid container>
						<Grid item xs={3}>
							<Form />
						</Grid>
						<Grid item xs={9}>
							<Viewer />
						</Grid>
					</Grid>
				</EditorProvider>
			</CookiesProvider>
		</div>
	);
};

export default Layout;
