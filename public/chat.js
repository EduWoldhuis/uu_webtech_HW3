let fetchMessagesInterval;
async function fetchMessages() {
    try {
    messages = await fetch("/api/message", { method: 'GET', credentials: 'include' }).then(x => x.json()).then(data => { return data })
    const container = document.getElementById("message-container");
    container.innerHTML = ""; 

    // The user cookie is the second cookie, we grab the value after the =. TODO: change this goofy method
    username = document.cookie.split(' ')[1].split('=')[1]

    messages.forEach(msg => {
    const messageElement = document.createElement("p");
        if (msg.username == username) {
            messageElement.className = "user-message";
        } else {
            messageElement.className = "other-message";
        }
    messageElement.textContent = msg.username + ": " + msg.message
    container.appendChild(messageElement);
    });

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("message-container").textContent = "Failed to load messages.";
  }
}

function toggleChat() {
    const container = document.getElementById("message-container");
    console.log(container.style.display);
    if (container.style.display == "none") {
        container.style.display = "block";
        toggleMessageLoop(true);
    } else {
        container.style.display = "none";
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

function onDomLoaded() {
    document.getElementById("chat-button").addEventListener("click", toggleChat);
    const container = document.getElementById("message-container");
    container.style.display = "none";
}

document.addEventListener("DOMContentLoaded", onDomLoaded);
