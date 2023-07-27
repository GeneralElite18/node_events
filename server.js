// Complete Events Exercise

const { EventEmitter } = require("events");
const http = require("http");
const path = require("path");
const fs = require("fs");
const PORT = 5555;

let NewsLetter = new EventEmitter();

const server = http.createServer((request, response) => {
    const { url, method } = request
    const chunks = [];

    request.on("data", (chunk) => {
        chunks.push(chunk);
    });

    request.on("end", () => {
        if(url == "/newsletter_signup" && method == "POST"){
            const postData = JSON.parse(Buffer.concat(chunks).toString());

            NewsLetter.emit("signup", postData);
            //Send back a response to client
            response.writeHead(200, {"content-type": "text/html"});
            response.write("User signed up!");
            response.end();
        }
        else{
            response.writeHead(404, {"content-type": "text/html"});
            response.write("Nothing found!");
            response.end();
        }
    });

    NewsLetter.on("signup", (contact) => {      
        fs.writeFile("newsletterUsers.csv", JSON.stringify(contact), (err) => {
            if(err){
                console.error(err);
            }
            else{
                console.log(`Added ${contact} to csv file`);
            }
        });
        // fs.appendFile("/", contact);
    });

    response.end();
});

server.listen(PORT, () => {
    console.log("Listenting on port...");
});