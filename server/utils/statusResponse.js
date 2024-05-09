export const status500 = (error) => {
    return {
        timestamp : new Date(),
        status : 500,
        error : "Internal Server Error",
        message : error
    }
}

export const status400 = (msg) => {
    return {
        timestamp : new Date(),
        status : 400,
        error : "Bad Request",
        message : msg
    }
}

export const status200 = (msg , data) => {
    return {
        status : 200,
        success : true,
        message : msg,
        data : data
    }
}

export const status401 = () => {
    return {
        status : 401,
        error : "unauthorized",
        message : ""
    }
}