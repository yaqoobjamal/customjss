const express = require('express')
const path = require('path')
const app = express()
const port = 5000
app.use(express.static(__dirname + "/"));


app.listen(port, () => console.log(`Example app listening at port ${port}!`))

