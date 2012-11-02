var
    io = require('socket.io');

exports.initSocketService = function(server){
    io = io.listen(server);
};

exports.setSocketService = function(){
    io.sockets.on('connection',function(socket){
        socket.emit('handshake');
        socket.on('handshack',function(){
            console.log("success!");
            socket.on('msg',function(message){
                if(message.type == "Send" && message.body != ""){
                    message.type = "Recv";
                    message.time = new Date().toJSON();
                    socket.emit('msg',message);
                }
            });
        });
    });
};

exports.index = function(req, res){
    res.render('socketio',{ host: req.headers.host });
};