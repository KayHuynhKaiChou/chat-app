interface Account {
    email : string;
    username : string;
    password ?: string;
    confirmPassword ?: string;
}

interface User extends Account{
    id : string;
    avatarImage : string;
    isOnline : boolean; 
}


interface Contact {
    receiver : User;
    newMessage : MessageData;
}