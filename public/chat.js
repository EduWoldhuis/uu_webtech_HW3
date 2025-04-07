let fetchMessagesInterval;
let lastMessageID = 0; 
let username = "";
let userid = "";

async function fetchUsername() {
    userid = document.cookie.split(' ')[0].split('=')[1];
    console.log("userid: " + userid);
    try {
      const response = await fetch(`/getUsername?userid=${userid}`, { method: 'GET' });
      const data = await response.json();
      username = data[0].username;
    } catch (error) {
      console.error(error);
    }
}

async function fetchMessages() {
    try {
        const response = await fetch(`/api/message?since=${lastMessageID}`, { method: 'GET', credentials: 'include' })
        const newMessages = await response.json();
        const container = document.getElementById("message-container");
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
        toggleMessageLoop(true);

        const container = document.getElementById("message-container");
        container.scrollTop = container.scrollHeight;
    } else {
        chat.style.display = "none";
        toggleMessageLoop(false);
    }
}

function toggleMessageLoop(receiveMessages) {
  // Immediately display the messages before starting the loop
    fetchUsername().then(() => {fetchMessages();});
    if (receiveMessages) {
        fetchMessagesInterval = setInterval(fetchMessages, 500);
    } else {
        clearInterval(fetchMessagesInterval);
    }
}

function clearChatbox() {
    setTimeout(() => {
        const chatBox = document.getElementById("chat-box");
        chatBoxInput = chatBox.querySelector("input");
        chatBoxInput.value = "";
    }, 0);
}

function onDomLoaded() {
    document.getElementById("chat-box").querySelector("button").addEventListener("click", clearChatbox);
}

document.addEventListener("DOMContentLoaded", onDomLoaded);
