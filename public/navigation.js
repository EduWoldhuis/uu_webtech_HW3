function selectNavigationItem(functionOfItem) {
    const navigationOptions = [toggleChat, toggleProfile];
    for (let i = 0; i < navigationOptions.length; i++) {
        if (navigationOptions[i] == functionOfItem) {
            navigationOptions[i](true);
        } else {
            navigationOptions[i](false);
        }
    }
}
function onDomLoaded() {
    let chatButton = document.getElementById("chat-button");
    chatButton.addEventListener("click", () => { selectNavigationItem(toggleChat) });
    let profileButton = document.getElementById("profile-button");
    profileButton.addEventListener("click", () => { selectNavigationItem(toggleProfile) });
    selectNavigationItem(null);
}

document.addEventListener("DOMContentLoaded", onDomLoaded);