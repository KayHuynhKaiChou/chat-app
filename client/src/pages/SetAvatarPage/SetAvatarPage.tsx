import { Button } from '@mui/material';
import { patternAvatars, toastMSGObject } from '../../utils/availableMethod';
import './setAvatar.scss'
import {useState , useEffect} from 'react';
// @ts-ignore
import loader from '../../assets/loader.gif';
import userServices from '../../services/userServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function SetAvatarPage() {
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState<string[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const user = JSON.parse(localStorage.getItem('user') as string);

    useEffect(() => {
        patternAvatars().then(data => setAvatars(data))
    },[])

    const handleSetAvatar = () => {
        userServices.setAvatarService({
            avatarImage : avatars[selectedAvatar]
        },user.id)
            .then(res => {
                toast.success(res.success , toastMSGObject());
                localStorage.setItem('user',JSON.stringify({
                    ...user,
                    avatarImage : avatars[selectedAvatar]
                }))
                navigate('/')
            })
    }

    return (
        <div className="set-avatar">
            {avatars.length === 0 ? (
                <img src={loader} alt="loader" className="loader" />
            ) : (
                <>
                    <div className="set-avatar__header">
                        <h2>Pick an Avatar as your profile picture</h2>
                    </div>
                    <div className="set-avatar__body">
                        {avatars.map((avatar : string , index) => (
                            <div className={`set-avatar__body--avatar ${selectedAvatar === index ? 'isSelected' : ''}`}>
                                <img 
                                    src={`data:image/svg+xml;base64,${avatar}`}
                                    alt="avatar"
                                    onClick={() => setSelectedAvatar(index)}
                                />
                            </div>
                        ))}
                    </div>
                    <Button 
                        variant="outlined"
                        onClick={handleSetAvatar}
                    >
                        Set as Profile Picture
                    </Button>               
                </>
            )}
        </div>
    )
}
