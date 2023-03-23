import mongoose from 'mongoose';
mongoose.set('strictQuery', true);
import colors from  'colors';


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`Error: ${error.message}`.red.underline.bold);
        process.exit(1);
        
    }
}

export default connectDB
