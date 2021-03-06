
window.onload = function(){
	$('.messageBox').keyup(function(event){
		var keyCode = event.keyCode ? event.keyCode : event.which;
		if(keyCode === 13)
			sendMessage();
	});
}

var chat = io.connect("http://localhost:8080/chat");
var joined = false;

//when error throw from the server to current socket user
chat.on('error',function(data){
	var msg = data['admin']+': '+data['message'];
	appendMsg(msg);
});

chat.on("message",function(data){
	var msg = data['client']+' '+data['current']+'\n\t'+data['message'];
	
	appendMsg(msg);
});

chat.on('loadPrevClient',function(data){
	addClient(data['socketId'],data['client']);
});

chat.on("connected",function(data){
	var msg = data['admin']+": "+data['message'];
	
	addClient(data['socketId'],data['client'],data['clientNum']);
	
	appendMsg(msg);
	
	//set the user has connected with server
	joined = true;
});


chat.on("disconnected",function(data){
	var msg = data['admin']+": "+data['message'];

	removeClient(data['socketId'],data['clientNum']);

	appendMsg(msg);
});


/**
* 
**/
function addClient(id,name,numUser){
//	$('.userTable').find('.online').html(numUser+" user online");
	
	$('.userTable').append('<tr class="success"><td clientId='+id+'>'+name+'</td></tr>');	
}


function removeClient(socketId,numUser){
	$('.userTable').find('td').each(function(){	
		if($(this).attr('clientId') === socketId){
			$(this).parents('tr').remove();
		}
	});
}


//append message to the textarea
function appendMsg(msg){
	
	var pre_msg = $('#message').val();
	if(pre_msg.length <= 0)
		$('#message').val($.trim(msg));
	else
		$('#message').val(pre_msg+"\n"+$.trim(msg));
	//make scroll bar at bottom
	var ps = $('#message');
	ps.scrollTop(
		ps[0].scrollHeight - ps.height()
	);
}

function connect(){
	var name = $('.nickname').val();
	$('.nickname').prop('disabled','true');
	$('.btn-join').removeAttr('onclick');
    	chat.emit("connect", { nickname : name});			
}
	
function sendMessage() {
	if(joined){
		var msg = $('.messageBox').val();
		$('.messageBox').val('');
		//append the user typed message
		appendMsg($('.nickname').val()+' '+getCurrent()+'\n\t'+msg);
		chat.emit("message", { message : msg});
	}else{
		alert('Please type a nickname, join first!');
	}
}

function getCurrent(){
	var time = new Date();
	
	return time.getDate()+'/'+(time.getMonth()+1)+'/'+time.getFullYear()+' '+time.getHours()+':'+time.getMinutes()+':'+time.getSeconds();
}
