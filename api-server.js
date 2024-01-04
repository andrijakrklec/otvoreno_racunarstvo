var path = require("path")
var express = require("express")
var cors = require('cors')

var fighters = require("./routes/fighters.routes")
var fights = require("./routes/fights.routes")
var openapi = require("./routes/openapi.routes")

const app = express()

app.use(cors())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/v1/fighters', fighters)
app.use('/api/v1/fights', fights)
app.use('/api/v1/openapi', openapi)


app.listen(3000);