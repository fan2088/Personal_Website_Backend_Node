const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            // avoid warnings in the console
            useNewUrlParser: true,  
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MongoDB connected: ${conn.connection.host}.`);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB