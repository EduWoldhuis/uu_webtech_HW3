//All functions related to the friends page of the website

//toggle menu on or off
function toggleFriendsMenu(display) {
    const friendMenuContainer = document.getElementById("friends-menu-container");
    friendMenuContainer.innerHTML = "";
    const title = document.createElement("h3");
    title.textContent = "Friends";
    friendMenuContainer.appendChild(title);

    if (display && friendMenuContainer.style.display == "none") {
        fetchFriends();
        friendMenuContainer.style.display = "flex";
    } else if (friendMenuContainer.style.display == "flex") {
        friendMenuContainer.style.display = "none";
    }
}

async function fetchFriends() {
    const friends = await fetch("/api/allFriends", { method: 'GET' }).then(x => x.json()).then(x => { return x });
    buildFriends(friends);
}

//add all friendcontainers to the menu container
async function buildFriends(friends) {

    for (i = 0; i < friends.length; i++) {
        await createFriend(friends[i]);
    }
    const friendMenuContainer = document.getElementById("friends-menu-container");

    if (friendMenuContainer.childNodes.length == 1) {
        const noFriends = document.createElement("p");
        noFriends.textContent = "No Friends :(";
        friendMenuContainer.appendChild(noFriends);
    }
}

//create a friend container with all its information
async function createFriend(friend) {
    const friendMenuContainer = document.getElementById("friends-menu-container");
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

                const friendAge = document.createElement("p");
                friendAge.id = "friend-age";
                friendAge.textContent = friend.age;
                friendInfoContainer.appendChild(friendAge);

                const friendMajor = document.createElement("p");
                friendMajor.id = "friend-major";
                friendMajor.textContent = friend.major;
                friendInfoContainer.appendChild(friendMajor);

                const friendEmail = document.createElement("p");
                friendEmail.id = "friend-email";
                friendEmail.textContent = friend.email;
                friendInfoContainer.appendChild(friendEmail);

                const friendHobbies = document.createElement("p");
                friendHobbies.id = "friend-hobbies";
                friendHobbies.textContent = "Hobbies: " + friend.hobbies;
                friendInfoContainer.appendChild(friendHobbies);

                const friendCourses = document.createElement("p");
                friendCourses.id = "friend-courses";
                const courses = await fetch(`/api/follows?id=${friend.id}`, { method: 'GET', credentials: 'include' }).then(x => x.json()).then(data => { return data });
                var courseString = "";
                if (courses.length == 0) {
                    courseString = "This user follows no courses.";
                } else {
                    courses.forEach(course => {courseString += course.course += ", "});
                    courseString = courseString.slice(0,-2);
                }

                friendCourses.textContent = "Courses: " + courseString;
                friendInfoContainer.appendChild(friendCourses);

            friendSection.appendChild(friendPictureContainer);
            friendSection.appendChild(friendInfoContainer);
        friendMenuContainer.appendChild(friendSection);
}