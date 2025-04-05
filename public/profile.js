//Gave a error: require is not defined
//const filter = require("../../../node_modules/jade/lib/filters");
//const { cache } = require("../../../node_modules/jade/lib/index");


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
        const filterdCoursesData = [];

        for (let i = 0; i < coursesData.length; i++) {
            if ((userCoursesData.map(x => x.name)).includes(coursesData.map((x => x.name))[i])) {
                filterdCoursesData.push(coursesData.map((x => x.name))[i]);
            }
        }

        //Remove old selector menu
        const lastCourseContainer = document.getElementById("course-container");
        if (lastCourseContainer) {
            lastCourseContainer.remove();
        }

        //Insert a selector to where you can choose courses and add the courses that are followd
        const courseContainer = createSelection(coursesData, filterdCoursesData);
        courseContainer.id = "course-container";

        userCoursesData.forEach(courseData => {
            console.log(courseData);
            const courseTag = createTag(courseData.name);
            courseTag.classList.add("course-tag");
            courseContainer.appendChild(courseTag);
        });

        document.getElementById("profile-form").insertBefore(courseContainer, document.getElementById("change-button"));
        
    } catch(err) {
        console.log(err);
    }
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

    return tag;
}

//Create a selection menu ONLY FOR AN ARRAY WITH ELEMENTS WITH A NAME VALUE
function createSelection(options, filteredList) {
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
    selectButton.addEventListener("click", function () {
        console.log(filteredList + " : " + select.value);
        if (!filteredList.includes(select.value)) {
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
    document.getElementById("change-button").addEventListener("click", function () {
        const allCourseTags = document.querySelectorAll(".course-tag")
        const coursesInput = document.getElementById("courses");
        for (let i = 0; i < allCourseTags.length; i++) {
            coursesInput.value += allCourseTags[i].children[0].textContent;
            if (i != allCourseTags.length - 1) {
                coursesInput.value += ",";
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", onDomLoaded);



// When the elements are loaded, start a loop fetching the messages.
//window.addEventListener('DOMContentLoaded', fetchUserInfo);
