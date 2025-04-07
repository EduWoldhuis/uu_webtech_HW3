function toggleFriendsMenu(display) {
    const friendMenuContainer = document.getElementById("friends-menu-container");
    if (display) {
        friendMenuContainer.display = "none";
    } else {
        friendMenuContainer.display = "block";
    }
}

async function fetchFriends() {
    const friends = await fetch("/api/allFriends", { method: 'GET' }).then(x => x.json()).then(x => { return x });
    const friendsSelector = document.getElementById("current-friends-selector");
    friends.forEach(friend => {
        const optionEl = document.createElement("option");
        optionEl.textContent += friend;
        friendsSelector.appendChild(optionEl);
    })
}