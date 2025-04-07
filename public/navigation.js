function clear() {
    toggleChat(false);
    toggleProfile(false);
    toggleFriendsMenu(false);
}

function onDomLoaded() {
    clear();
    let chatButton = document.getElementById("chat-button");
    chatButton.addEventListener("click", () => { clear(); toggleChat(true); });
    let profileButton = document.getElementById("profile-button");
    profileButton.addEventListener("click", () => { clear(); toggleProfile(true); });
    let friendsMenuButton = document.getElementById("friends-menu-button");
    friendsMenuButton.addEventListener("click", () => { clear(); toggleFriendsMenu(true)})
}

document.addEventListener("DOMContentLoaded", onDomLoaded);
