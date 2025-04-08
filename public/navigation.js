function clear() {
    toggleChat(false);
    toggleProfile(false);
    toggleFriendsMenu(false);
}

function onDomLoaded() {
    const friendMenuContainer = document.getElementById("friends-menu-container");
    friendMenuContainer.style.display = "none"
    clear();
    let chatButton = document.getElementById("chat-button");
    chatButton.addEventListener("click", () => {clear(); toggleChat(true); });
    let profileButton = document.getElementById("profile-button");
    profileButton.addEventListener("click", () => {clear(); toggleProfile(true); });
    let friendsMenuButton = document.getElementById("friends-menu-button");
    friendsMenuButton.addEventListener("click", () => {
        const friendMenuContainer = document.getElementById("friends-menu-container");
        if (friendMenuContainer.style.display == "none") {clear(); toggleFriendsMenu(true);}
        }); 
        
}

document.addEventListener("DOMContentLoaded", onDomLoaded);
