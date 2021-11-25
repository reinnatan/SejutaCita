const http = require('http')
const app = require("./app")
const server = http.createServer(app);
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;


app.listen(port, () => {
	console.log(`app listening at http://localhost:${port}`)
});
