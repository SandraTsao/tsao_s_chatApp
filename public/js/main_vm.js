// imports always go first - if we're importing anything
import ChatMessage from "./modules/ChatMessage.js"

const socket = io();

function setUserId({sID, message}) {
    // debugger;
    // check my id
    vm.socketID = sID;
}

function runDisconnectMessage(packet) {
    // debugger;
    console.log(packet);
}

function appendNewMessage(msg) {
    vm.messages.push(msg);
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
socket.addEventListener('user_disconnect', runDisconnectMessage);
socket.addEventListener('new_message', appendNewMessage);