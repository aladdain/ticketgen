import { Grid, Stack } from "@mui/material";
import { FC } from "react";
import { CookiesProvider } from "react-cookie";
import Footer from "../components/Footer";
import Form from "../components/Form";
import Layout from "../components/Layout";
import Viewer from "../components/Viewer";
import { EditorProvider } from "../EditorContext";

const Home:FC = () => {

    return (
        <Stack
            direction={"column"}
            justifyContent="space-between"
            spacing={0}
            sx={{ minHeight: "100vh" }}
        >
            <Layout>
                <CookiesProvider>
                    <EditorProvider>
                        <Grid container sx={{height: "calc(100vh - 54px - 64px)"}}>
                            <Grid item xs={3}>
                                <Form />
                            </Grid>
                            <Grid item xs={9}>
                                <Viewer />
                            </Grid>
                        </Grid>
                    </EditorProvider>
                </CookiesProvider>
            </Layout>
            <Footer />
        </Stack>
    )
}

export default Home