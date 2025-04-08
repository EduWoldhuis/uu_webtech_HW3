let fetchMessagesInterval;
let lastMessageID = 0; 
let username = "";
let userid = "";
let otherUsername;

async function fetchUsername() {
    try {
      const response = await fetch(`/getUsername`, { method: 'GET' });
      const data = await response.json();
      username = data[0].username;
    } catch (error) {
      console.error(error);
    }
}

async function fetchMessages() {
    try {
        const response = await fetch(`/api/message?since=${lastMessageID}&otherUsername=${otherUsername}`, { method: 'GET', credentials: 'include' })
        const newMessages = await response.json();
        const container = document.getElementById("message-container");
        console.log("Newmessages: " + newMessages);

        newMessages.forEach(msg => {
            const messageContainerElement = document.createElement("div");
            const messageElement = document.createElement("p");
            if (msg.username == username) {
                messageContainerElement.className = "user-message-box"
                messageElement.className = "user-message";
            } else {
                messageContainerElement.className = "other-message-box"
                messageElement.className = "other-message";
            }

            const userElement = document.createElement("p");
            userElement.className = "user";
            userElement.textContent = msg.username;

            messageElement.textContent = msg.message;
            container.appendChild(messageContainerElement);
            messageContainerElement.appendChild(userElement);
            messageContainerElement.appendChild(messageElement);

            lastMessageID = msg.id;

            container.scrollTop = container.scrollHeight;
        });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("message-container").textContent = "Failed to load messages.";
  }
}

function toggleChat(displayChat) {
    const chat = document.getElementById("chat");
    if (displayChat) {
        chat.style.display = "flex";
        if (otherUsername != "" && otherUsername != null) {
            toggleMessageLoop(true);
        }

        const container = document.getElementById("message-container");
        container.scrollTop = container.scrollHeight;
    } else {
        chat.style.display = "none";
        toggleMessageLoop(false);
    }
}

function toggleMessageLoop(receiveMessages) {
  // Immediately display the messages before starting the loop
    fetchUsername().then(() => {
    if (receiveMessages) {
        fetchMessagesInterval = setInterval(fetchMessages, 500);
    } else {
        clearInterval(fetchMessagesInterval);
    }
    });
}

function clearChatbox() {
    setTimeout(() => {
        const chatBox = document.getElementById("chat-box");
        chatBoxInput = chatBox.querySelector("input");
        chatBoxInput.value = "";
    }, 0);
}

async function fillFriendList() {
    const selectMessageFriend = document.getElementById("message-friend-menu");
    const friendsList = await fetch("/api/allFriends", { method: 'GET' }).then(x => x.json()).then(x => { return x });
    console.log("friendllist: " + friendsList);
    friendsList.forEach(friend => {
        const optionEl = document.createElement("option");
        optionEl.textContent += friend.username;
            selectMessageFriend.appendChild(optionEl);
    });
    if (friendsList.length > 0) {
        selectMessageFriend.value = friendsList[0].username;
        otherUsername = friendsList[0].username;
    }
}

function onDomLoaded() {
    fillFriendList();
    document.getElementById("change-chat-button").addEventListener("click", function () {
        otherUsername = document.getElementById("message-friend-menu").value;
    });
    document.getElementById("chat-box").querySelector("button").addEventListener("click", clearChatbox);
    document.getElementById("chat-send-button").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("otherUsername").value = otherUsername;
        document.getElementById("chat-box").submit();
    })

}

document.addEventListener("DOMContentLoaded", onDomLoaded);
