document.addEventListener("DOMContentLoaded", registerFunction);
function registerFunction() {
    document.getElementById("registerForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const queryString = new URLSearchParams(formData).toString()

        try {
            const response = await fetch("/api/register", {
              method: "POST",
              headers: {"Content-Type": "application/x-www-form-urlencoded"},
              body: queryString,
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