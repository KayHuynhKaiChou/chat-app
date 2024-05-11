import { useNavigate } from 'react-router-dom';
// @ts-ignore
import logoChat from '../../assets/logoChat.svg'
import {useEffect, useState} from 'react'
import './contacts.scss'
import { AiOutlineLogout } from "react-icons/ai";
import { IconButton, InputBase } from '@mui/material';
import { AiOutlineSearch } from "react-icons/ai";
import userServices from '../../services/userServices';

interface contactsProps {
    user : User,
    listContacts : User[],
    setCurrentContact : any
}

export default function ContactsComponent(props : contactsProps) {
    const navigate = useNavigate();
    const [selectedContact , setSelectedContact] = useState(-1);
    const {user , listContacts , setCurrentContact} = props;
    const [contacts , setContacts] = useState(listContacts)
    const [searchText , setSearchText] = useState('');

    useEffect(() => {
        setContacts(listContacts)
    },[listContacts])

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/sign-in')
    }

    const handleChangeContact = (contact : User , index : number) => {
        setSelectedContact(index);
        setCurrentContact(contact);
    }

    const handleChangeSearchText = (e : any) => {
        console.log(e.target.value === '')
        if(e.target.value === ''){
            handleSearchUsers(e.target.value);
        }else{
            setSearchText(e.target.value)
        }
    }

    const handleSearchUsers = (searchText : string) => {
        userServices.searchUsersService(searchText , user.id as string)
            .then(res => setContacts(res.data))
    }

    return (
        <div className="contacts">
            <div className="contacts-title">
                <img src={logoChat} alt="" />
                <h3>HKT CHAT</h3>
            </div>
            <div className="contacts-search">
                <InputBase
                    sx={{ ml: 2, flex: 1}}
                    placeholder="Search name user"
                    inputProps={{ 'aria-label': 'search google maps' }}
                    onChange={handleChangeSearchText}
                />
                <IconButton 
                    type="button" 
                    sx={{ p: '10px' }} 
                    aria-label="search"
                    onClick={() => handleSearchUsers(searchText)}
                >
                    <AiOutlineSearch />
                </IconButton>
            </div>
            <div className="contacts-list">
                {contacts.length === 0 ? (
                    <div className="contacts-list__empty">
                        Danh sách người dùng trống
                    </div>
                ) : 
                contacts.map((contact,index) => (
                    <div 
                        key={index}
                        className={`contacts-list__item ${selectedContact === index ? 'isSelected' : ''}`}
                        onClick={() => handleChangeContact(contact,index)}
                    >
                        <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="" />
                        <h3>{contact.username}</h3>
                    </div>
                ))}
            </div>
            <div className="contacts-personal">
                <img src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="avatar" />
                <div className="contacts-personal__info">
                    <h3>{user.username}</h3>
                    <div className='contacts-personal__info--logout' onClick={handleLogout}>
                        <AiOutlineLogout />
                        Logout
                    </div>
                </div>
            </div>
        </div>
    )
}
