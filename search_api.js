const searchBar = document.getElementById('locationInput');
const dropdown = document.getElementById('dropdown');

// Function to fetch data from OpenStreetMap Nominatim API
async function fetchLocations(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch location data');
  }
  return response.json();
}

// Function to handle input event
searchBar.addEventListener('input', async () => {
  const query = searchBar.value.trim();
  if (query.length < 3) {
    dropdown.innerHTML = ''; // Clear the dropdown if query is too short
    return;
  }

  try {
    const locations = await fetchLocations(query);
    populateDropdown(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
  }
});

// Function to populate the dropdown with location suggestions
function populateDropdown(locations) {
  dropdown.innerHTML = ''; // Clear previous results

  if (locations.length === 0) {
    dropdown.innerHTML = '<div class="dropdown-item">No results found</div>';
    return;
  }

  locations.forEach(location => {
    const item = document.createElement('div');
    item.className = 'dropdown-item';
    item.textContent = location.display_name;

    // Handle click event on the dropdown item
    item.addEventListener('click', () => {
      searchBar.value = location.display_name; // Set search bar value
      dropdown.innerHTML = ''; // Clear dropdown
      console.log('Selected location:', location); // Log the selected location
    });

    dropdown.appendChild(item);
  });
}