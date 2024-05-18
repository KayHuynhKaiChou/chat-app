interface ResponseFormat {
    timestamp ?: Date;
    status : Response['status'];
    error ?: string;
    message : string;
    data ?: any;
    success ?: boolean;
}