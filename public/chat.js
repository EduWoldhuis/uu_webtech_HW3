async function fetchMessages() {
    console.log("called");
    try {
    messages = await fetch("/api/message").then(x => x.json()).then(data => {return data})
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
