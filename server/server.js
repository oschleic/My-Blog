const express = require("express")
const app = express()

const root = require('path').join(__dirname, '../client/build')
app.use(express.static(root));
app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
})


app.get("/", function(req, res) {
    res.send("It's working!")
})
  
app.listen(3000, () => {
    console.log("app listening on port 3000")
})
