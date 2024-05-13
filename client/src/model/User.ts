interface Account {
    email ?: string,
    username : string,
    password ?: string,
    confirmPassword ?: string,
    lastMessage ?: string
}

interface User extends Account{
    id : string,
    avatarImage ?: string
}


interface Contact {
    receiver : User,
    newMessage : MessageData 
}