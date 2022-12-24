import { Box, Toolbar } from "@mui/material";
import { FC, ReactNode } from "react";
import NavBar from "./NavBar";

interface Props {
	children: ReactNode
}

const Layout: FC<Props> = ({children}) => {
	return (
		<Box sx={{ flexGrow: 1, minHeight: "100%" }}>
			<NavBar />
			<Toolbar />
			{children}
		</Box>
	);
};

export default Layout;
