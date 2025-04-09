//All functions related to the potentialFriendsMenu page of the website

//toggle menu on or off
function togglePotentialFriendsMenu(display) {
    const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");
    potentialFriendMenuContainer.innerHTML = "";
    const title = document.createElement("h4");
    title.textContent = "Potential Friends";
    potentialFriendMenuContainer.appendChild(title);

    if (display && potentialFriendMenuContainer.style.display == "none") {
        fetchPotentialFriends();
        potentialFriendMenuContainer.style.display = "flex";
    } else if (potentialFriendMenuContainer.style.display == "flex") {
        potentialFriendMenuContainer.style.display = "none";
    }
}

async function fetchPotentialFriends() {
    const friends = await fetch("/group31/api/potentialFriends", { method: 'GET' }).then(x => x.json()).then(x => { return x });
    buildPotentialFriends(friends);
}

//Add all potensial friends to the menu container
async function buildPotentialFriends(friends) {
    for (i = 0; i < friends.length; i++) {
        await createPotentialFriend(friends[i]);
    }
    const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");

    if (potentialFriendMenuContainer.childNodes.length == 1) {
        const noPotentialFriends = document.createElement("p");
        noPotentialFriends.textContent = "No Potential Friends :(";
        potentialFriendMenuContainer.appendChild(noPotentialFriends);
    }
}

//Create potensial friend container 
async function createPotentialFriend(friend) {
    const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");
        const friendSection = document.createElement("section");
        friendSection.id = "friend";
            const friendPictureContainer = document.createElement("div");
            friendPictureContainer.id = "friend-picture-container";
                const friendPicture = document.createElement("img");
                friendPicture.id = "friend-picture";
                friendPicture.src = `/images/userimages/${friend.username}.png`;
                friendPicture.addEventListener('error', function () {
                    this.src = `/images/userimages/${friend.username}.jpg`;
                })
                friendPicture.addEventListener('error', function () {
                    this.src = `/images/notfound.png`;
                })                
                friendPictureContainer.appendChild(friendPicture);

                const friendUsername = document.createElement("strong");
                friendUsername.id = "friend-username";
                friendUsername.textContent = friend.username;
                friendPictureContainer.appendChild(friendUsername);

            const friendInfoContainer = document.createElement("div");
            friendInfoContainer.id = "friend-info-container";
                const friendName = document.createElement("p");
                friendName.id = "friend-name";
                friendName.textContent = friend.first_name + " " + friend.last_name;
                friendInfoContainer.appendChild(friendName);

            friendSection.appendChild(friendPictureContainer);
            friendSection.appendChild(friendInfoContainer);
        potentialFriendMenuContainer.appendChild(friendSection);
}