interface Account {
    username : string;
    password ?: string;
    confirmPassword ?: string;
}
    
interface User extends Account{
    email : string;
    id : string;
    avatarImage : string;
    isOnline : boolean; 
}


interface Contact {
    receiver : User;
    newMessage : MessageData;
}