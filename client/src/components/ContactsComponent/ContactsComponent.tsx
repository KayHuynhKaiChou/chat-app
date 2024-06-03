import { useNavigate } from 'react-router-dom';
// @ts-ignore
import logoChat from '../../assets/logoChat.svg'
import {CSSProperties, useEffect, useState} from 'react'
import './contacts.scss'
import { AiOutlineLogout } from "react-icons/ai";
import { IconButton, InputBase } from '@mui/material';
import { AiOutlineSearch } from "react-icons/ai";
import userServices from '../../services/userServices';
import { v4 as uuidv4 } from "uuid";
import CaTooltip from '../common/CaTooltip';

interface contactsProps {
    user : User;
    listContacts : Contact[];
    onChangeCurrentContact : (contact : Contact) => void;
}

export default function ContactsComponent(props : contactsProps) {
    const {user , listContacts , onChangeCurrentContact} = props;
    const navigate = useNavigate();
    const [selectedContactId , setSelectedContactId] = useState<User['id']>('');
    const [contacts , setContacts] = useState<Contact[]>(listContacts);
    const [searchText , setSearchText] = useState<string>('');

    useEffect(() => {
        setContacts(listContacts)
    },[listContacts])

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/sign-in')
    }

    const handleChangeContact = (contact : Contact) => {
        setSelectedContactId(contact.receiver.id);
        onChangeCurrentContact(contact);
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

    const showNewMessage = (newMessage : MessageData , receiver : User) => {
        if (newMessage){
            if (newMessage.sender == user.id){
                return newMessage.isDeleted ? 'You has deleted this message.' : `You: ${newMessage.message}`
            }else{
                return newMessage.isDeleted ? `${receiver.username} has deleted this message.` : `${newMessage.message}`
            }
        }else{
            return 'Not message in this conversation.'
        }
    }

    const styleViewedMessage = (newMessage : MessageData) : CSSProperties => {
        if(!newMessage) return {};
        if(
            newMessage.sender == user.id ||
            newMessage.viewers.includes(user.id)
        ){
            return {}
        }else{
            return {
                color: '#fff',
                fontWeight: 'bold'
            }
        }
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
                contacts.map(({receiver , newMessage} ,index) => (
                    <div 
                        key={uuidv4()}
                        className={`contacts-list__item ${selectedContactId == receiver.id ? 'isSelected' : ''}`}
                        onClick={() => handleChangeContact({receiver , newMessage})}
                    >
                        <div className="item-detail-wrap">
                            <div className='item-detailAvatar'>
                                <img src={`data:image/svg+xml;base64,${receiver.avatarImage}`} alt="" />
                            </div>
                            <div className="item-detailInfo">
                                <div className="item-detailInfo__name">
                                    {receiver.username}
                                </div>
                                <CaTooltip
                                    id={`tooltip-new-message-${index}`}
                                >
                                    <div 
                                        style={styleViewedMessage(newMessage)}
                                        id={`tooltip-new-message-${index}`}
                                        className="item-detailInfo__msg"
                                    >
                                        {showNewMessage(newMessage , receiver)}
                                    </div>
                                </CaTooltip>    
                            </div>
                        </div>
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
