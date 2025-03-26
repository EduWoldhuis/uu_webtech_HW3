async function fetchMessages() {
    try {
    messages = await fetch("/api/message", {method: 'GET', credentials: 'include'}).then(x => x.json()).then(data => {return data})
    const container = document.getElementById("message-container");
    container.innerHTML = ""; 

    messages.forEach(msg => {
    const messageElement = document.createElement("p");
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
    if (container.style.display == "none") {
        container.style.display = "block";
    } else {
        container.style.display = "none";
    }
}
function messageLoop() {
  // Immediately display the messages before starting the loop
  fetchMessages();
  setInterval(fetchMessages, 5000);
}
// When the elements are loaded, start a loop fetching the messages.
window.addEventListener('DOMContentLoaded', messageLoop);
