document.addEventListener("DOMContentLoaded", registerFunction);
async function registerFunction() {
      
    majorMenu = document.getElementById("major");
    majors = await fetch("/group31/api/majors", {method: 'GET', credentials: 'include'}).then(x => x.json()).then(data => {return data}); 
    majors.forEach(major => {
      selectElement = document.createElement("option");
      selectElement.value = major.name;
      selectElement.innerText = major.name;
      majorMenu.appendChild(selectElement);
    });

    document.getElementById("registerForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);

        try {
            const response = await fetch("/group31/api/register", {
              method: "POST",
              body: formData,
            });
            if (response.redirected) {
                window.location.href = response.url;
            } else if (!response.ok) {
                const errorText = await response.text();
                console.log(errorText);
                const errorDiv = document.createElement("div");
                errorDiv.id = "errorMessage";
                errorDiv.innerText = errorText;

                document.body.appendChild(errorDiv);
                setTimeout(() => {document.getElementById("errorMessage").remove();}, 3000)
            }
        }
        catch (err) {
            document.getElementById("errorMessage").innerText = "An unexpected error occurred.";
            console.error(err);
        }
    });
};
