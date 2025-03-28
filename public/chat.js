let fetchMessagesInterval;
async function fetchMessages() {
    try {
        messages = await fetch("/api/message", { method: 'GET', credentials: 'include' }).then(x => x.json()).then(data => { return data })
        const container = document.getElementById("message-container");
        container.innerHTML = ""; 
        const username = await fetch("/getUsername", { method: 'GET' }).then(x => x.text()).then((value) => { return value; }).catch((error) => { console.log("Error in chat.js at getUsername: " + error); });

        messages.forEach(msg => {
        const messageElement = document.createElement("p");
            if (msg.username == username) {
                messageElement.className = "user-message";
            } else {
                messageElement.className = "other-message";
            }
        messageElement.textContent = msg.username + ": " + msg.message
                messageElement.textContent += " : " +  username + " : " + msg.username
        container.appendChild(messageElement);
        });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("message-container").textContent = "Failed to load messages.";
  }
}

function toggleChat(displayChat) {
    const chat = document.getElementById("chat");
    console.log(chat.style.display);
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
    fetchMessages();
    if (receiveMessages) {
        fetchMessagesInterval = setInterval(fetchMessages, 5000);
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