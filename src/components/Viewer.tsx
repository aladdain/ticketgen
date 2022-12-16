import { Box } from "@mui/material";
import { FC, useContext, useMemo } from "react";
import { EditorContext } from "../EditorContext";

const Viewer:FC = () => {
    const {state: {pdfData}} = useContext(EditorContext)

    const docUrl = useMemo(() => {
        if(pdfData) {            
            const bytes  = new Uint8Array( pdfData ); 
            const blob   = new Blob( [ bytes ], { type: "application/pdf" } );
            return URL.createObjectURL( blob );
        } else {
            return "ticket.pdf"
        }
    }, [pdfData])

    return (
        <Box sx={{p: 3, pt: 5}}>
            <object data={docUrl} type="application/pdf" width="100%" height={800}>
                PDF ticket viewer
            </object>
        </Box>                  
    )
}

export default Viewer