const express=require('express')
const app=express();
const errorMiddleware=require('./middleware/error')

app.use(express.json());


const register=require('./routes/registerRoutes')
const login=require('./routes/loginRoutes')

app.use('/api/v1',register);
app.use('/api/v1',login);
app.use(errorMiddleware);

module.exports=app;