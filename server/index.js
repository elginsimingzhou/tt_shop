const express = require('express');

const PORT = 3000 || process.env.PORT

const app = express();


app.get('/', (req, res)=>{
    res.json("Hello world");
})

app.listen(PORT, ()=>{
    console.log(`App listening at PORT ${PORT}`)
})