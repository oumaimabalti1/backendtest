const mongoose = require('mongoose');

module.exports.connectToMongoDB = async () => {
mongoose.connect(process.env.Url_MongoDB).then (() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
};