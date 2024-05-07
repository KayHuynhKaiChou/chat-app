import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.scss'
import {CssBaseline , ThemeProvider , createTheme} from '@mui/material'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastContainer/>
  </ThemeProvider>
)
