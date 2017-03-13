/**
 * Created by Paul on 3/1/2017.
 Edited my miguel 3-10-2017
 */
var osc = require("osc");
    WebSocket = require("ws");
var express = require("express");
var socketIO = require("socket.io");
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var http = require("http");
var fs = require("fs");
var path = require("path");
var mime = require("mime");
var exec = require("child_process").exec

//http.listen(8080, "127.0.0.1");

io.on('connection', function (socket) {
    console.log("A user is connected");
});

function sendPage(response, filePath, fileContents) {
  response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

var getIPAddresses = function () {
    var os = require("os"),
    interfaces = os.networkInterfaces(),
    ipAddresses = [];

    for (var deviceName in interfaces){
        var addresses = interfaces[deviceName];

        for (var i = 0; i < addresses.length; i++) {
            var addressInfo = addresses[i];

            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

var udpPort = new osc.UDPPort({
   localAddress: "0.0.0.0",
    localPort: 7400,
    remoteAddress: "127.0.0.1",
    remotePort: 7500
});

udpPort.on("ready", function () {
    var ipAddresses = getIPAddresses();
    console.log("Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", udpPort.options.localPort);
    });
    console.log("Broadcasting OSC over UDP to", udpPort.options.remoteAddress + ", Port:", udpPort.options.remotePort);
});

// Open the socket.
udpPort.open();

var wss = new WebSocket.Server({
    port: 8080
});

wss.on("connection", function (socket) {
    console.log("A Web Socket connection has been established!");
    var socketPort = new osc.WebSocketPort({
        socket: socket
    });

    var relay = new osc.Relay(udpPort, socketPort, {
        raw: true
    });
});

var bttn1 = 0;
var bttn2 = 0;
var bttn3 = 0;
var bttn4 = 0;
var bttn5 = 0;
var bttn6 = 0;

var app = express();
app.get("/", function (req, res) {
    res.sendfile("./index.html");
});

io.sockets.on("connect", function (socket) {
    socket.emit("connection_made");
    socket.on("button_click_1", function () {
        ++bttn1;
    });
    socket.on("button_click_2", function () {
        ++bttn2;
    });
    socket.on("button_click_3", function () {
        ++bttn3;
    });
    socket.on("button_click_4", function () {
        ++bttn4;
    });
    socket.on("button_click_5", function () {
        ++bttn5;
    });
    socket.on("button_click_6", function () {
        ++bttn6;
    });
});

// Every five seconds, send an OSC message to SuperCollider
setInterval(function () {
    var msg = {
        address: "/new/button/values/",
        args: [bttn1, bttn2, bttn3, bttn4, bttn5, bttn6]
    };

    //console.log("Sending message", msg.address, msg.args, "to", udpPort.options.remoteAddress + ":" + udpPort.options.remotePort);
    console.log(msg.args[0], msg.args[1], msg.args[2], msg.args[3], msg.args[4], msg.args[5]);
    udpPort.send(msg);

    //reset all button values
    bttn1 = 0;
    bttn2 = 0;
    bttn3 = 0;
    bttn4 = 0;
    bttn5 = 0;
    bttn6 = 0;
}, 5000);
