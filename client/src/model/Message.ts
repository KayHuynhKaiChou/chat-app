interface MessagePayload {
    from : User['id'],
    to : User['id'],
    message : string
}

interface MessageData {
    _id : string,
    users : [
        MessagePayload['from'],
        MessagePayload['to']
    ],
    sender : MessagePayload['from'],
    message : MessagePayload['message']
    isDeleted : boolean
}