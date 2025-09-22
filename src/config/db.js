const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("mongoDB connected successfully"); 
    } catch (error) {
        console.log('error connecting DB');
    }
}

module.exports = connectDB;