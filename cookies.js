function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/;`; // Set cookie with URL encoding
}

// Function to get a cookie by name
function getCookie(name) {
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, val] = cookie.split('=');
        acc[key] = decodeURIComponent(val); // Decode the value
        return acc;
    }, {});
    return cookies[name] || null;
}

// Function to load the title from the cookie
function loadTitleFromCookie() {
    const storedTitle = getCookie('pageTitle');
    if (storedTitle) {
        document.getElementById('location').textContent = storedTitle;
    }
}

// Event listener to change the title and store it in a cookie
document.getElementById('changeTitle').addEventListener('click', () => {
    const newTitle = prompt('Enter a new title:');
    if (newTitle) {
        document.getElementById('title').textContent = newTitle;
        setCookie('pageTitle', newTitle);
    }
});

// Event listener to reset the title and clear the cookie
document.getElementById('resetTitle').addEventListener('click', () => {
    document.getElementById('title').textContent = 'Welcome to My Weather App';
    setCookie('pageTitle', 'Welcome to My Weather App'); // Reset the cookie to default title
});

// Load the title from the cookie when the page loads
loadTitleFromCookie();