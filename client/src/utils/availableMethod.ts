import axios from 'axios';
import { Theme, ToastOptions, ToastPosition} from 'react-toastify';
import { Buffer } from "buffer";

export const toastMSGObject = ({
    position = "top-right" as ToastPosition,
    autoClose = 2000,
    hideProgressBar = false,
    closeOnClick = true,
    pauseOnHover = true,
    draggable = true,
    progress = undefined,
    theme = "colored" as Theme,
} = {}): ToastOptions<{}> => ({
  position,
  autoClose,
  hideProgressBar,
  closeOnClick,
  pauseOnHover,
  draggable,
  progress,
  theme
})

export const patternAvatars = async () => {
  const randomAvatars = []
  for (let i = 0; i < 4; i++) {
    const image = await axios.get(
      `https://api.multiavatar.com/4645646/${Math.round(Math.random() * 1000)}`
    );
    const buffer = new Buffer(image.data);
    randomAvatars.push(buffer.toString("base64"));
  }
  return randomAvatars
}