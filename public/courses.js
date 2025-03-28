let fetchpotentialFriendsInterval;
async function fetchPotentialFriends() {
    try {
    potentialFriends = await fetch("/api/potentialFriends", { method: 'GET', credentials: 'include' }).then(x => x.json()).then(data => { return data })
    const container = document.getElementById("course-container");
    container.innerHTML = ""; 


    let course = "";
    
    if (Array.isArray(potentialFriends)){

    potentialFriends.forEach(potentialFriend => {
      const friendElement = document.createElement("p");

      friendElement.textContent = potentialFriend.first_name + " " + potentialFriend.last_name;

      if (potentialFriend.course != course) {
        course = potentialFriend.course;
        courseElement = document.createElement("h2");
        courseElement.textContent = course;
        container.appendChild(courseElement);
      }
      container.appendChild(friendElement);
    })};

    } catch (error) {
      console.error("Error:", error);
      document.getElementById("course-container").textContent = "Failed to load potentialFriends.";
  }
}

function toggleCourseLoop(receivePotentialFriends) {
  // Immediately display the potentialFriends before starting the loop
    fetchPotentialFriends();
    setInterval(fetchPotentialFriends, 5000);
    if (receivePotentialFriends) {
        fetchPotentialFriendsInterval = setInterval(fetchPotentialFriends, 5000);
    } else {
        clearInterval(fetchPotentialFriendsInterval);
    }
}

function onDomLoaded() {
    document.getElementById("chat-button").addEventListener("click", toggleChat);
    const container = document.getElementById("course-container");
    container.style.display = "none";
}

document.addEventListener("DOMContentLoaded", toggleCourseLoop);
