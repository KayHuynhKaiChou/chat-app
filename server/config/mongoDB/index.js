import mongoose from "mongoose"

export default async function connect(){
    const URL_DB = `mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0.edmwjsy.mongodb.net/appChat?retryWrites=true&w=majority`
    await mongoose.connect(URL_DB,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    }).then(() => console.log('Connect mongo DB success'))
      .catch(error => console.error(error))
}