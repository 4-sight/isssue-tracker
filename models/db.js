const mongoose = require('mongoose')

mongoose.connect(
    process.env.DB,
    { useNewUrlParser: true },
    (err) => {
        if(err) {console.error('mongoose failed to connect to database')}
        else {console.log('mongoose connected to database')}
    })