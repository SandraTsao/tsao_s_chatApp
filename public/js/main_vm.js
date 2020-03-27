// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js"

const   socket = io(),
        sentMsg = new Audio('../media/sentMsg.mp3'),
        gotMsg = new Audio('../media/gotMsg.mp3'),
        userLeft = new Audio('../media/userLeft.mp3'),
        newUser = new Audio('../media/newUser.mp3');

function sayHi(packet) {
    // debugger;
    console.log(packet);
    newUser.play();
}

function setUserId({sID}) {
    // debugger;
    vm.socketID = sID;
}

function runDisconnectMessage(packet) {
    // debugger;   
    console.log(packet);
    userLeft.play();
}

function appendNewMessage(msg) {
    vm.messages.push(msg);
    sentMsg.play();
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
        dispatchMessage() {
            // emit a message event send messae to seerver
            console.log("handle message sending");

            socket.emit('chat_message', {
                content: this.message,
                name: this.nickName || "anonymous"
                // || is double pipe operator or and "or" operator
                // if nickMane has been set then use it, otherwise
                // set to anonymous
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

socket.addEventListener('connected', setUserId);
socket.addEventListener('new_connect', sayHi);
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);