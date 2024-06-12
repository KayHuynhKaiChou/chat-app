import { Box, Typography } from "@mui/material";

export default function NotFoundPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <Typography variant="h1" style={{ color: 'white' }}>
                404 not found
            </Typography>
        </Box>
    )
}
