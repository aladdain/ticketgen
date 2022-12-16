import { Settings } from "@mui/icons-material";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { FC, useCallback, useState } from "react";
import SettingsDialog from "./SettingsDialog";

const NavBar:FC = () => {
    const [open, setOpen] = useState(false)

    const toggleOpen = useCallback(() => setOpen(prev => !prev), [])

    return (
        <>
        <AppBar>
            <Toolbar>
                <Typography variant="h6" sx={{fontWeight: 700}}>TicketGen</Typography>
                <Box sx={{flexGrow: 1}} />
                <Button variant="text" startIcon={<Settings color="inherit" />} onClick={toggleOpen}>Settings</Button>
            </Toolbar>
        </AppBar>
        <SettingsDialog open={open} onClose={toggleOpen} />
        </>
    )
}

export default NavBar