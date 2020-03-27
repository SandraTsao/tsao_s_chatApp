// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js"

const   socket = io(),
        sentMsg = new Audio('../media/sentMsg.mp3'),
        gotMsg = new Audio('../media/gotMsg.mp3'),
        userLeft = new Audio('../media/userLeft.mp3'),
        newUser = new Audio('../media/newUser.mp3'),
        anno = document.createElement("p");

function sayHi(packet) {
    // debugger;
    console.log(packet);
    
}

function welcome(packet) {
    newUser.play();
    anno.innerHTML = packet.name + ' has joined the chat!';
    anno.setAttribute("class", "notif");
    document.querySelector(".messages").appendChild(anno);
}

function setUserId({sID}) {
    // debugger;
    vm.socketID = sID;
}

// vue instance
const vm = new Vue({
    data: {
        socketID: "",
        messages: [],
        message: "",
        nickName: ""
    },

    methods: {
        getName() {
            console.log("get name");
            // socket.emit('get_name', {
                // name: this.nickName || "anonymous"
                // || is double pipe operator or and "or" operator
                // if nickMane has been set then use it, otherwise
                // set to anonymous
            // })
            socket.emit('get_name', {
                name: this.nickName || "anonymous"
            })
        },
        dispatchMessage() {
            // emit a message event send message to server
            console.log("handle message sending");

            socket.emit('chat_message', {
                content: this.message,
                name: this.nickName || "anonymous"
            })
            this.message = "";
        }
    },

    components: {
        newmessage: ChatMessage
    },

    mounted: function() {
        console.log("mounted");
    }
}).$mount("#app");

const nickname = vm.nickName;

function runDisconnectMessage(packet) {
    // debugger;   
    console.log(packet);
    userLeft.play();
    anno.innerHTML = 'Someone has left the chat!';
    anno.setAttribute("class", "notif");
    document.querySelector(".messages").appendChild(anno);
}

function appendNewMessage(msg) {
    vm.messages.push(msg);
    if(msg.id === socket.id){
        console.log('me');
        sentMsg.play();
    }else{
        console.log('other people');
        gotMsg.play();
    }
}

socket.addEventListener('connected', setUserId);
socket.addEventListener('new_connect', sayHi);
socket.addEventListener('got_name', welcome);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);