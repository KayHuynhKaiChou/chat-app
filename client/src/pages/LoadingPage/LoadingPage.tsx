import { Box } from "@mui/material";
import CaLoading from "../../components/common/CaLoading";

export default function LoadingPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#fff'
            }}
        >
            <CaLoading/>
        </Box>
    )
}
