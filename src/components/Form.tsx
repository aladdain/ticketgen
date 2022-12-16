import { Box, Button, TextField, Typography } from "@mui/material";
import { FC, useCallback, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Actions, EditorContext } from "../EditorContext";
import Editor from "../lib/editor";
import { genCode } from "../lib/helpers";
import { DataProps } from "../types";
import ImageForm from "./ImageForm";

const Form: FC = () => {
	const [data, setData] = useState<DataProps>({
		name: "",
		area: "",
		row: "",
		seat: "",
		image: "",
		date: "",
		membership: "",
		code: "",
		qr: ""
	});
	const [nameError, setNameError] = useState<string | null>(null);
	const [codeError, setCodeError] = useState<string | null>(null);
	const [areaError, setAreaError] = useState<string | null>(null);
	const [rowError, setRowError] = useState<string | null>(null);
	const [seatError, setSeatError] = useState<string | null>(null);
	const [dateError, setDateError] = useState<string | null>(null);
	const [membershipError, setMembershipError] = useState<string | null>(null);
	const [qrFocused, setQRFocused] = useState<boolean>(false)

	const {dispatch} = useContext(EditorContext)

	const [cookies] = useCookies(["settings"])

	// load default settings
	useEffect(() => {
		const cookie = cookies.settings
		if(cookie) {
			setData(prev => ({
				...prev,
				"name": cookie.name,
				"date": cookie.date,
				"membership": cookie.membership
			}))
		}
	}, [cookies])

	const updateData = useCallback((target: string, value: string | number) => {
		setData((prev) => ({ ...prev, [target]: value }));
	}, []);

	const validateName = useCallback(() => {
		if (!data.name || data.name.length < 2) {
			setNameError("Not valid name");
			return false;
		}
		if (nameError) setNameError(null);
		return true;
	}, [data.name, nameError, setNameError]);

	const validateCode = useCallback(() => {
		if (!data.code || data.code.length < 6) {
			setCodeError("Not valid code");
			return false;
		}
		if (codeError) setCodeError(null);
		return true;
	}, [data.code, codeError, setCodeError]);

	const validateMembership = useCallback(() => {
		if (!data.membership || data.membership.length < 2) {
			setMembershipError("Not valid Id");
			return false;
		}
		if (membershipError) setMembershipError(null);
		return true;
	}, [data.membership, membershipError, setMembershipError]);

	const validateDate = useCallback(() => {
		if (!data.date || data.date.length < 2) {
			setDateError("Not valid date");
			return false;
		}
		if (dateError) setDateError(null);
		return true;
	}, [data.date, dateError, setDateError]);

	const validateArea = useCallback(() => {
		if (!data.area || parseInt(data.area) <= 0) {
			setAreaError("Not valid Area");
			return false;
		}
		if (areaError) setAreaError(null);
		return true;
	}, [data.area, areaError, setAreaError]);

	const validateRow = useCallback(() => {
		if (!data.row || parseInt(data.row) <= 0) {
			setRowError("Not valid Row");
			return false;
		}
		if (rowError) setRowError(null);
		return true;
	}, [data.row, rowError, setRowError]);

	const validateSeat = useCallback(() => {
		if (!data.seat || parseInt(data.seat) <= 0) {
			setSeatError("Not valid Seat");
			return false;
		}
		if (seatError) setSeatError(null);
		return true;
	}, [data.seat, seatError, setSeatError]);

	const apply = useCallback(async () => {
		if (!validateName()) return;
		if (!validateMembership()) return;
		if (!validateArea()) return;
		if (!validateSeat()) return;
		if (!validateRow()) return;

		try {			
			const editor = new Editor("ticket.pdf")
			
			const pdfData = await editor.edit(data)

			dispatch({
				type: Actions.DATA_CHANGED,
				payload: pdfData
			})
		} catch (error) {
			console.error(error)
		}
	}, [data, dispatch]);

	const handleCode = useCallback(async () => {
		if(data.code) {
			try {
				const preview = await genCode(data.code)
				updateData("qr", preview)
			} catch (error) {
				console.error(error)
			}
		}
	}, [data.code, updateData])

	useEffect(() => {
		if(data.code && !qrFocused) {
			handleCode()
		}
	}, [data.code, qrFocused])

	return (
		<Box sx={{p:3, textAlign: "left", pt: 5}}>
			<Typography variant="body1">
				Please fill in the form below, and add QR code image.<br />Then click on Download once all changes are made.
			</Typography>
			<TextField
				variant="outlined"
				placeholder="Guest Team Name"
				label="Team Name"
				onChange={(event) => updateData("name", event.target.value)}
				fullWidth
				error={Boolean(nameError)}
				helperText={nameError || ""}
				onBlur={validateName}
				value={data.name}
				sx={{ mt: 3 }}
			/>
			<TextField
				variant="outlined"
				placeholder="Membership Id"
				label="Membership"
				onChange={(event) => updateData("membership", event.target.value)}
				fullWidth
				error={Boolean(membershipError)}
				helperText={membershipError || ""}
				onBlur={validateMembership}
				value={data.membership}
				sx={{ mt: 3 }}
			/>
			<TextField
				id="datetime-local"
				label="Date / Time"
				type="datetime-local"
				defaultValue="2017-05-24T10:30"
				fullWidth
				InputLabelProps={{
					shrink: true,
				}}
				onChange={(event) => updateData("date", event.target.value)}
				error={Boolean(dateError)}
				helperText={nameError || ""}
				sx={{ mt: 3 }}
				value={data.date}
			/>
			<TextField
				variant="outlined"
				placeholder="Area"
				label="Area"
				onChange={(event) => updateData("area", event.target.value)}
				fullWidth
				error={Boolean(areaError)}
				helperText={areaError || ""}
				onBlur={validateArea}
				sx={{ mt: 2 }}
				value={data.area}
			/>
			<TextField
				variant="outlined"
				placeholder="Row"
				label="Row"
				onChange={(event) => updateData("row", event.target.value)}
				fullWidth
				error={Boolean(rowError)}
				helperText={rowError || ""}
				onBlur={validateRow}
				sx={{ mt: 2 }}
				value={data.row}
			/>
			<TextField
				variant="outlined"
				placeholder="Seat"
				label="Seat"
				onChange={(event) => updateData("seat", event.target.value)}
				fullWidth
				error={Boolean(seatError)}
				helperText={seatError || ""}
				onBlur={validateSeat}
				sx={{ mt: 2 }}
				value={data.seat}
			/>
			<TextField
				variant="outlined"
				placeholder="Qr code id"
				label="Qr code id"
				onChange={(event) => updateData("code", event.target.value)}
				fullWidth
				error={Boolean(codeError)}
				helperText={codeError || ""}
				onBlur={() => {
					validateCode()
					setQRFocused(false)
				}}
				onFocus={() => setQRFocused(true)}
				sx={{ mt: 2 }}
				value={data.code}
			/>
			{data.qr && (
				<Box sx={{ mt: 2 }}>
					<Box
						sx={{
							borderWidth: 1,
							borderStyle: "dashed",
							borderRadius: 3,
							height: 100,
							display: "flex",
							alignItems: "center",
							borderColor: "rgba(255,255,255, 0.3)",
						}}
						justifyContent="center"
					>
						<img  src={data.qr} alt="qr code" width={100} height={100} style={{display: "block"}} /> 
					</Box>
				</Box>
			)}
			<Button variant="contained" onClick={apply} sx={{ mt: 2 }} fullWidth>
				Apply
			</Button>
		</Box>
	);
};

export default Form;
