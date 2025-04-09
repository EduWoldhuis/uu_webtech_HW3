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
    const incomingFriendRequests = await fetch("/api/friendRequests", { method: 'GET', credentials: 'include'  }).then(x => x.json()).then(x => { return x });
    const friendRequestsIds = incomingFriendRequests.map(req => parseInt(req.user_id_sender));
    const outgoingFriendRequests = await fetch("/api/outgoingFriendRequests", { method: 'GET', credentials: 'include'  }).then(x => x.json()).then(x => { return x });
    const outgoingFriendRequestsIds = outgoingFriendRequests.map(req => parseInt(req.user_id_reciever));

    const friends = await fetch("/api/potentialFriends", { method: 'GET', credentials: 'include'  }).then(x => x.json()).then(x => { return x });
    buildPotentialFriends(friends, friendRequestsIds, outgoingFriendRequestsIds);
}

//Add all potensial friends to the menu container
async function buildPotentialFriends(friends, friendRequestsIds, outgoingFriendRequestsIds) {
    for (i = 0; i < friends.length; i++) {
        await createPotentialFriend(friends[i], friendRequestsIds, outgoingFriendRequestsIds);
    }
    const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");

    if (potentialFriendMenuContainer.childNodes.length == 1) {
        const noPotentialFriends = document.createElement("p");
        noPotentialFriends.textContent = "No Potential Friends :(";
        potentialFriendMenuContainer.appendChild(noPotentialFriends);
    }
}

//Create potensial friend container 
async function createPotentialFriend(friend, friendRequestsIds, outgoingFriendRequestsIds) {
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
                
                //if (userid in friendRequests) {make button to accept} -> logic to delete friendrequest and make them friends
                if (friendRequestsIds.includes(parseInt(friend.user_id))) {
                    const requestInfo = document.createElement("p");
                    requestInfo.textContent = "This user has sent you a friend request!";
                    requestInfo.style.color = "green";

                    const acceptButton = document.createElement("button");
                    acceptButton.textContent = "Click to accept Friend Request";

                    acceptButton.addEventListener("click", () => {
                        acceptFriendRequest(friend.user_id);
                    });
                
                friendInfoContainer.appendChild(requestInfo);

                friendInfoContainer.appendChild(acceptButton);

                } else if (outgoingFriendRequestsIds.includes(parseInt(friend.user_id))) {
                    const requestInfo = document.createElement("p");
                    requestInfo.textContent = "You have sent this user a friend request!";
                    requestInfo.style.color = "orange";

                    friendInfoContainer.appendChild(requestInfo);

                } else {
                    const addButton = document.createElement("button");
                    addButton.textContent = "Send Friend Request";

                    addButton.addEventListener("click", () => {
                    sendFriendRequest(friend.user_id);
                });
                friendInfoContainer.appendChild(addButton);

                }



            friendSection.appendChild(friendPictureContainer);
            friendSection.appendChild(friendInfoContainer);
        potentialFriendMenuContainer.appendChild(friendSection);
}

async function sendFriendRequest(friendid) {
    const response = await fetch(`/api/createFriendRequest?friendid=${friendid}`, { method: 'POST', credentials: 'include' })

    const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");
    potentialFriendMenuContainer.innerHTML = "";
    const title = document.createElement("h4");
    title.textContent = "Potential Friends";
    potentialFriendMenuContainer.appendChild(title);
    fetchPotentialFriends();

    return;
}

async function acceptFriendRequest(friendid) {
    const response = await fetch(`/api/acceptFriendRequest?friendid=${friendid}`, { method: 'POST', credentials: 'include' })

    const potentialFriendMenuContainer = document.getElementById("potential-friends-menu-container");
    potentialFriendMenuContainer.innerHTML = "";
    const title = document.createElement("h4");
    title.textContent = "Potential Friends";
    potentialFriendMenuContainer.appendChild(title);
    fetchPotentialFriends();

    return;
}