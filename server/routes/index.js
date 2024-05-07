import userRoute from "./userRoute.js"
import messageRoute from "./messageRoute.js"


export const routes = (app) => {
    app.use('/api/user', userRoute)
    app.use('/api/message', messageRoute)
}