import { useNavigate } from 'react-router-dom';
// @ts-ignore
import logoChat from '../../assets/logoChat.svg'
import {CSSProperties, useMemo, useState} from 'react'
import './contacts.scss'
import { AiOutlineLogout } from "react-icons/ai";
import { Badge, IconButton, InputBase } from '@mui/material';
import { AiOutlineSearch } from "react-icons/ai";
import userServices from '../../services/userServices';
import { v4 as uuidv4 } from "uuid";
import CaTooltip from '../common/CaTooltip';
import CaSkeleton from '../common/CaSkeleton';

interface contactsProps {
    currentContact : Contact | null;
    listContacts : Contact[];
    isLoadingListContacts : boolean;
    onChangeCurrentContact : (contact : Contact) => void;
    onChangeListContacts : (listContacts : Contact[]) => void;
}

export default function ContactsComponent(props : contactsProps) {
    const {
        currentContact , 
        listContacts , 
        isLoadingListContacts ,
        onChangeCurrentContact ,
        onChangeListContacts
    } = props;
    //store
    const user = JSON.parse(localStorage.getItem('user') as string);

    //hook navigate
    const navigate = useNavigate();

    //state
    const [searchText , setSearchText] = useState<string>('');

    //useMemo
    const classSelectedContact = useMemo(() => {
        return (receiver : User) => {
            let classItemContact = 'contacts-list__item '
            if(currentContact && currentContact.receiver.id == receiver.id){
                classItemContact += 'isSelected'
            }
            return classItemContact
        }
    },[currentContact])

    const ListContactsEmpty = useMemo(() => {
        return () => (
            <div className="contacts-list__empty">
                Danh sách người dùng trống
            </div>
        )
    },[])

    const ListContactsData = useMemo(() => {
        return () => {
            return listContacts.map(({receiver , newMessage} ,index) => (
                <div 
                    key={uuidv4()}
                    className={classSelectedContact(receiver)}
                    onClick={() => handleChangeContact({receiver , newMessage})}
                >
                    <div className="item-detail-wrap">
                        <div className='item-detailAvatar'>
                            <Badge 
                                invisible={!receiver.isOnline} 
                                color="success" 
                                overlap="circular" 
                                badgeContent=" "
                            >
                                <img src={`data:image/svg+xml;base64,${receiver.avatarImage}`} alt="" />
                            </Badge>
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
            ))
        }
    },[listContacts , currentContact])

    //func handle logic and change state
    const renderListContacts = () => {
        if(isLoadingListContacts){
            return <CaSkeleton/>
        }else{
            if(listContacts.length == 0){
                return <ListContactsEmpty/>
            }else{
                return <ListContactsData/>
            }
        }
    }
    
    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/sign-in')
    }

    const handleChangeContact = (contact : Contact) => {
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
            .then(res => onChangeListContacts(res.data))
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
                {renderListContacts()}
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
