interface MessagePayload {
    from : User['id'],
    to : User['id'],
    message : string
}

interface MessageData {
    _id : string;
    users : [
        MessagePayload['from'],
        MessagePayload['to']
    ],
    sender : MessagePayload['from'];
    viewers : Array<User['id']>
    message : MessagePayload['message'];
    isDeleted : boolean;
}