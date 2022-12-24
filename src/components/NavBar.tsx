import { ChevronRight, Layers, Menu, Settings } from "@mui/icons-material";
import {
	AppBar,
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItemButton,
	ListItemText,
	Stack,
	SwipeableDrawer,
	Toolbar,
	Typography,
} from "@mui/material";
import { FC, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import BatchDialog from "./BatchDialog";
import SettingsDialog from "./SettingsDialog";

const NavBar: FC = () => {
	const [open, setOpen] = useState(false);
	const [batchOpen, setBatchOpen] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);

	const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

	const toggleBatchOpen = useCallback(
		() => setBatchOpen((prev) => !prev),
		[]
	);

	const toggleDrawer = useCallback(() => setDrawerOpen((prev) => !prev), []);

	const navigate = useNavigate()

	return (
		<>
			<AppBar>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						sx={{ mr: 2 }}
						onClick={toggleDrawer}
					>
						<Menu />
					</IconButton>
					<Typography variant="h6" sx={{ fontWeight: 700 }}>
						TicketGen
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Stack direction="row" spacing={2}>
						<Button
							variant="text"
							startIcon={<Layers color="inherit" />}
							onClick={toggleBatchOpen}
						>
							Batch
						</Button>
						<Button
							variant="text"
							startIcon={<Settings color="inherit" />}
							onClick={toggleOpen}
						>
							Settings
						</Button>
					</Stack>
				</Toolbar>
			</AppBar>
			<SettingsDialog open={open} onClose={toggleOpen} />
			<BatchDialog open={batchOpen} onClose={toggleBatchOpen} />
			<SwipeableDrawer
				anchor="left"
				open={drawerOpen}
				sx={{ width: 300 }}
				onClose={toggleDrawer}
				onOpen={() => null}
				PaperProps={{sx: {width: 300}}}
			>
				<Toolbar />
				<Divider />
				<List>
					<ListItemButton onClick={() => navigate("/")}>
						<ListItemText>Form Generator</ListItemText>
						<ChevronRight color="inherit" />
					</ListItemButton>
					<ListItemButton onClick={() => navigate("/ocr")}>
						<ListItemText>Image Generator</ListItemText>
						<ChevronRight color="inherit" />
					</ListItemButton>
				</List>
			</SwipeableDrawer>
		</>
	);
};

export default NavBar;
