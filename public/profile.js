async function fetchUserInfo() {
    try {
    data = await fetch("/api/userdata", {method: 'GET', credentials: 'include'}).then(x => x.json()).then(data => {return data})
    document.getElementById("username").value = data.username || '';
    document.getElementById("first_name").value = data.first_name || '';
    document.getElementById("last_name").value = data.last_name || '';
    document.getElementById("age").value = data.age || '';
    document.getElementById("email").value = data.email || '';
    document.getElementById("major").value = data.major || '';

  } catch (error) {
   console.error("Error:", error);
  }
}

// When the elements are loaded, start a loop fetching the messages.
window.addEventListener('DOMContentLoaded', fetchUserInfo);
