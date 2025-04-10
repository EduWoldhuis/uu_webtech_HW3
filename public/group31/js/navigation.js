//All functions related to the navigation bar, this is where you can select a menu

//Clear all menu's
function clear() {
    toggleChat(false);
    toggleProfile(false);
    toggleFriendsMenu(false);
    togglePotentialFriendsMenu(false);
}

//Add all eventlisteners to the buttons so they toggle the correct menu on and clear the rest
function onDomLoaded() {
    const friendMenuContainer = document.getElementById("friends-menu-container");
    friendMenuContainer.style.display = "none"
    const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");
    potentialFriendMenuContainer.style.display = "none"

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
    let potentialFriendsMenuButton = document.getElementById("potential-friends-menu-button");
    potentialFriendsMenuButton.addEventListener("click", () => {
        const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");
        if (potentialFriendMenuContainer.style.display == "none") {clear(); togglePotentialFriendsMenu(true);}
    });   
}

document.addEventListener("DOMContentLoaded", onDomLoaded);
