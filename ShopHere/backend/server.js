const app = require('./app');
const connectDatabase = require('./config/database')


const dotenv = require('dotenv');


//Handling uncaught Exception
process.on('uncaughtException', err=>{
    console.log(`ERROR: ${err.stack}`)
    console.log('Shuting down the server due to uncaught exceptino');
    process.exit(1)
})

//Setting up config file
dotenv.config({path:'backend/config/config.env'})

//connecting to Database
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode` )
})

//Handle unhandled Promise rejection
process.on('unhandledRejection', err=>{
    console.log('Shutting douwn the server due to unhandled rejection')
    console.log(`ERROR: ${err.stack}`);
    server.close(()=>{
        process.exit(1)
    })
})