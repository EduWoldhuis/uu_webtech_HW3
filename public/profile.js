async function fetchUserInfo() {
    try {
    data = await fetch("/api/userdata", {method: 'GET', credentials: 'include'}).then(x => x.json()).then(data => {return data})
    document.getElementById("username").value = data.username || '';
    document.getElementById("first_name").value = data.first_name || '';
    document.getElementById("last_name").value = data.last_name || '';
    document.getElementById("age").value = data.age || '';
    document.getElementById("email").value = data.email || '';
    document.getElementById("major").value = data.major || '';

    submitButton = document.getElementsByClassName("change-button")[0];
    coursesData = await fetch("/api/courses", {method: 'GET', credentials: 'include'}).then(x => x.json()).then(data => {return data});
    // Prevent the course checkboxes from being created multiple times.
    if (document.getElementsByName("courses").length == 0) {
      userCoursesData = await fetch("/api/follows", {method: 'GET', credentials: 'include'}).then(x => x.json()).then(data => {return data});
      coursesData.forEach(courseData => {
          labelElement = document.createElement("label")
          labelElement.innerText = courseData.name
          inputElement = document.createElement("input")
          inputElement.type = "checkbox"
          inputElement.name = "courses"
          inputElement.value = courseData.name
          submitButton.insertAdjacentElement("beforebegin", labelElement)
          submitButton.insertAdjacentElement("beforebegin", inputElement)
      });
      if (!Array.isArray(userCoursesData)){
          userCoursesData = userCoursesData ? [userCoursesData] : [];
      }
      userCoursesData.forEach(courseData => {
          courseElement = document.querySelectorAll(`input[value='${courseData.course}']`)[0]
          courseElement.checked = true;
      });
    }


  } catch (error) {
   console.error("Error:", error);
  }
}

function toggleProfile(displayProfile){
    const profile = document.getElementById("profile-container");
    if (displayProfile) {
        profile.style.display = "flex";
        fetchUserInfo();
    } else {
        profile.style.display = "none";
    }
}

// When the elements are loaded, start a loop fetching the messages.
//window.addEventListener('DOMContentLoaded', fetchUserInfo);
