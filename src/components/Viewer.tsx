import { Box } from "@mui/material";
import { FC, useContext, useMemo } from "react";
import { EditorContext } from "../EditorContext";

const Viewer:FC = () => {
    const {state: {pdfData, type}} = useContext(EditorContext)

    const docUrl = useMemo(() => {
        if(pdfData) {            
            const bytes  = new Uint8Array( pdfData ); 
            const blob   = new Blob( [ bytes ], { type: "application/pdf" } );
            return URL.createObjectURL( blob );
        } else {
            return type === "regular" ? "ticket.pdf" : "vip.pdf"
        }
    }, [pdfData, type])

    return (
        <Box sx={{height: "100%"}}>
            <object data={`${docUrl}#toolbar=0&navpanes=0`} type="application/pdf" width="100%" height="100%">
                PDF ticket viewer
            </object>
        </Box>                  
    )
}

export default Viewer