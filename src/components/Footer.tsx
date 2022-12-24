import { Box, Divider, Typography } from "@mui/material";
import { FC } from "react";

const Footer:FC = () => {
    return (
        <Box>
            <Divider />
            <Box sx={{p: 2}}>
            <Typography variant="body2" color={"GrayText"}>{`A pitchou product 😎 - ${new Date().getFullYear()}`}</Typography>
            </Box>
        </Box>
    )
}

export default Footer 