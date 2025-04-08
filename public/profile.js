async function fetchUserInfo() {
    try {
        data = await fetch("/api/userdata", { method: 'GET', credentials: 'include' }).then(x => x.json()).then(data => { return data })
        document.getElementById("username").value = data.username || '';
        document.getElementById("first_name").value = data.first_name || '';
        document.getElementById("last_name").value = data.last_name || '';
        document.getElementById("age").value = data.age || '';
        document.getElementById("email").value = data.email || '';
        document.getElementById("major").value = data.major || '';


        submitButton = document.getElementsByClassName("change-button")[0];
        const coursesData = await fetch("/api/courses", { method: 'GET', credentials: 'include' }).then(x => x.json()).then(data => { return data });
        const userCoursesData = await fetch("/api/follows", { method: 'GET', credentials: 'include' }).then(x => x.json()).then(data => { return data });

        //Remove old selector menu
        const lastCourseContainer = document.getElementById("course-container");
        if (lastCourseContainer) {
            lastCourseContainer.remove();
        }

        //Insert a selector to where you can choose courses and add the courses that are followd
        const courseContainer = createSelection(coursesData);
        courseContainer.id = "course-container";

        console.log(userCoursesData);

        userCoursesData.forEach(courseData => {
            const courseTag = createTag(courseData.course);
            courseContainer.appendChild(courseTag);
        });


        document.getElementById("profile-form").insertBefore(courseContainer, document.getElementById("change-button"));
        majorMenu = document.getElementById("major");
        majors = await fetch("/api/majors", {method: 'GET', credentials: 'include'}).then(x => x.json()).then(data => {return data}); 
        majors.forEach(major => {
          selectElement = document.createElement("option");
          selectElement.value = major.name;
          selectElement.innerText = major.name;
          majorMenu.appendChild(selectElement);
        });
        majorMenu.value = data.major;
        
    } catch(err) {
        console.log(err);
    }
}

function getSelectedCourses() {
    const selectedCourses = Array.from(document.querySelectorAll(".course-tag")).map(x => x.children[0].textContent);
    return Array.from(selectedCourses);
}

function createTag(title) {
    const tag = document.createElement("div");
    const tagTitle = document.createElement("p");
    const removeButton = document.createElement("button");

    tagTitle.textContent += title;
    removeButton.textContent += "Remove";
    removeButton.addEventListener("click", function () { 
        removeButton.parentElement.remove()
    });

    tag.appendChild(tagTitle);
    tag.appendChild(removeButton);
    tag.classList.add("course-tag");
    return tag;
}

//Create a selection menu ONLY FOR AN ARRAY WITH ELEMENTS WITH A NAME VALUE
function createSelection(options) {
    const selectContainer = document.createElement("div");
    const select = document.createElement("select");
    options.forEach(option => {
        const optionEl = document.createElement("option");
        optionEl.textContent += option.name;
        optionEl.value = option.name;
        select.appendChild(optionEl);
    });
    selectContainer.appendChild(select);

    const selectButton = document.createElement("button");
    selectButton.textContent += "Add";
    selectButton.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(getSelectedCourses());
        if (!getSelectedCourses().includes(select.value)) {
            selectContainer.appendChild(createTag(select.value))
        }
    });


    selectContainer.appendChild(selectButton);
    return selectContainer;
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

function onDomLoaded() {
    document.getElementById("change-button").addEventListener("click", function (event) {
        event.preventDefault();
        const allCourses = getSelectedCourses();
        const coursesInput = document.getElementById("courses");
        for (let i = 0; i < allCourses.length; i++) {
            coursesInput.value += allCourses[i];
            if (i != allCourses.length - 1) {
                coursesInput.value += ",";
            }
        }
        console.log("AllCourses: " + allCourses);
        console.log("coursesInput:" + coursesInput.value);
        document.getElementById("profile-form").submit();
    }, true);

}

document.addEventListener("DOMContentLoaded", onDomLoaded);



// When the elements are loaded, start a loop fetching the messages.
//window.addEventListener('DOMContentLoaded', fetchUserInfo);
