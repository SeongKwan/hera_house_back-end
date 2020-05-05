const mongoose = require('mongoose');

module.exports = () => {
    const connect = () => {
        if(process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
        mongoose.connect(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        }, (error) => {
            if (error) {
                console.log('Error connecting with mongodb', error);
            } else {
                console.log('Connected with mongodb');
            }
        });
    };
    connect();
    mongoose.connection.on('error', (error) => {
        console.error('Error connecting with mongodb', error);
    });
    mongoose.connection.on('disconnected', () => {
        console.error('Lost connection with mongodb. Try to connect with mongodb again.');
        connect();
    });
    require('./User');
    require('./Post');
}