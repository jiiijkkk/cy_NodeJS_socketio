$(document).ready(function(){
    var socket = io.connect('#{ host }',{
        reconnect:  false
    });
    socket.on('handshake', function (data) {
        var flag_send = true;
        socket.emit('handshack');
        socket.on('msg', function (message){
            console.log(message);
            addMessage(message);
        });
        $("#console").keypress(function(e){
            console.log(e.keyCode);
            if(e.keyCode == 13 && $("#console").val()!="" && flag_send){
                var message = {
                    type : "Send",
                    body : $("#console").val(),
                    time : new Date().toJSON()
                };
                addOriginMessage(message);
                socket.emit("msg", message);
                $("#console").val("");
            }
        });
        socket.on('disconnect',function(){
            flag_send = false;
            $("#console").val("");
            $("#console").attr({disabled: "disabled"});
            $("#console").fadeOut(5000);
            addMessage({
                type:   "Warn",
                body:   "disconnect!",
                time:   new Date().toJSON()
            });
        });
    });
    $("#console").focus(0);
    function getMessageElement(message){
        return $(
            '<div class= '+ message.type+ ' >'+
                '<div class="type" >'+
                    message.type+
                '</div>'+
                '<div class="body" >'+
                    message.body+
                '</div>'+
                '<div class="time" >'+
                    message.time+
                '</div>'+
            "</div>"
        );
    }
    
    function goBottom(div){
        if(div.outerHeight() + div[0].scrollTop < div[0].scrollHeight){
            div[0].scrollTop = div[0].scrollHeight;
        }
    }
    function htmlEncode(value){
        if (value) {
            return jQuery('<div />').text(value).html();
        } else {
            return '';
        }
    }
    function htmlDecode(value) {
        if (value) {
            return $('<div />').html(value).text();
        } else {
            return '';
        }
    }
    function transHtml(str){
        console.log(str);
        var patts = str.split(" ");
        var result = "";
        for(var i in patts){
            if(isUrl(patts[i])){
                var origin_patt = htmlDecode(patts[i]);
                var url = encodeURI(origin_patt);
                patts[i] = '<a href= "'+ addSlash(url)+ '" target="_blank">'+ origin_patt+ '</a>';
            }
            else if (isMail(patts[i])){
                var origin_patt = htmlDecode(patts[i]);
                var url = encodeURI(origin_patt);
                patts[i] = '<a href= mailto:"'+ addSlash(url)+ '" target="_blank">'+ origin_patt+ '</a>';
                
            }
            if(i != 0) result += " ";
            result += patts[i];
        }
        return result;
    }
    function addSlash(str){
        str = str.replace('"','\"');
        return str;
    }
    function isUrl(str){ 
        return /^((https?)|(ssh)|(telnet)):\/\/[^\n\s\t]+([\.][^\n\s\t:]+)+(:\d+)?(\/[^\n\s\t]*)*$/.test(str);
    }
    function isMail(str){
        return /^[^@]+@[^\n\s\t]+([\.][^@\n\s\t:]+)+$/.test(str);
    }
    function addMessage(message){
        console.log(message);
        message.body = htmlEncode(message.body);
        message.body = transHtml(message.body);
        console.log(message);
        $("#logs").append(
            getMessageElement(message)
        );
        goBottom($("#logs"));
    }
    function addOriginMessage(message){
        message.body = htmlEncode(message.body);
        $("#logs").append(
            getMessageElement(message)
        );
        goBottom($("#logs"));
    }
});