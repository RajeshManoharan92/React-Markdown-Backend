const Mongoose = require('mongoose')


// to connect mongodb Atlas

module.exports = {
   

    async connect() {
        try {
            const response = await Mongoose.connect(process.env.Mongo_URL).then(()=>{
                console.log("database connected successfully")
            })
 
        }
        catch (err) {
            console.log(err)
        }
    }
}