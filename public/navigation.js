function clear() {
  toggleChat(false);
  toggleProfile(false);
}

function onDomLoaded() {
    clear();
    let chatButton = document.getElementById("chat-button");
    chatButton.addEventListener("click", () => { clear(); toggleChat(true); });
    let profileButton = document.getElementById("profile-button");
    profileButton.addEventListener("click", () => { clear(); toggleProfile(true); });
}

document.addEventListener("DOMContentLoaded", onDomLoaded);
