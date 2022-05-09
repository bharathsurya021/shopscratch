import mongoose from 'mongoose'
import colors from 'colors'

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })

        console.log(`MongoDB Connected : ${connect.connection.host}`.cyan);
    } catch (error) {
        console.error(`Error:${error.message}`.red)
        process.exit(1)
    }
}


export default connectDB