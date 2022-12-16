import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { DataProps } from "../types";

interface Props {
    open:boolean
    onClose: () => void
}

const SettingsDialog:FC<Props> = ({open, onClose}) => {
    const [settings, setSettings] = useState<Partial<DataProps>>({
        name: "",
        date: "",
        membership: ""
    })

    const [cookies, setCookie, removeCookie] = useCookies(["settings"])

    useEffect(() => {
        const cookie = cookies.settings
        if(cookie) {
            setSettings(cookie)
        }
    }, [cookies])

    const save = useCallback(() => {
        removeCookie("settings")
        setCookie("settings", JSON.stringify(settings), {
            expires: new Date("2038-01-19 04:14:07")
        })
        onClose()
    }, [settings, setCookie, removeCookie, onClose])

    const updateData = useCallback((target: string, value: string | number) => {
		setSettings((prev) => ({ ...prev, [target]: value }));
	}, []);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Settings</DialogTitle>
            <DialogContent>
                <DialogContentText>Configure the defaults settings for the event. They will be used as default values for any ticket.</DialogContentText>
                <TextField
                    variant="outlined"
                    placeholder="Guest Team Name"
                    label="Team Name"
                    value={settings.name}
                    onChange={(event) => updateData("name", event.target.value)}
                    fullWidth
                    sx={{ mt: 3 }}
                />
                <TextField
                    variant="outlined"
                    placeholder="Membership Id"
                    label="Membership"
                    value={settings.membership}
                    onChange={(event) => updateData("membership", event.target.value)}
                    fullWidth
                    sx={{ mt: 3 }}
                />
                <TextField
                    id="datetime-local"
                    value={settings.date}
                    label="Date / Time"
                    type="datetime-local"
                    defaultValue={new Date().toString()}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => updateData("date", event.target.value)}
                    sx={{ mt: 3 }}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={save}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SettingsDialog