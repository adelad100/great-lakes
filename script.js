const stationIds = ['9099090', '9063038', '9087068', '9014098']; // Updated with new station IDs

async function fetchProductData(stationId, product) {
    const baseUrl = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
    const params = `?station=${stationId}&product=${product}&date=latest&units=metric&format=xml&datum=STND&time_zone=gmt`;
    const url = `${baseUrl}${params}`;

    try {
        const response = await fetch(url);
        
        // Check if the response is okay
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const textData = await response.text(); // Get XML data as text
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(textData, 'application/xml'); // Parse XML to DOM

        const observation = xmlDoc.querySelector('observations wl'); // Adjusted query to match your working code
        if (observation) {
            const value = observation.getAttribute('v'); // Get value attribute
            return value; // Return the water level value
        } else {
            throw new Error(`No data available for ${product}`);
        }
    } catch (error) {
        console.error(`Error fetching ${product} data for station ${stationId}:`, error);
        return null; // Return null in case of error
    }
}

async function fetchStationData(stationId) {
    const waterLevelData = await fetchProductData(stationId, 'water_level');

    return {
        water_level: waterLevelData ? waterLevelData : 'N/A', // Return the water level data or 'N/A'
    };
}
const stationDetails = {
    '9099090': 'Grand Marais, Lake Superior, MN',
    '9063038': 'Erie, Lake Erie, PA',
    '9087068': 'Kewaunee, Lake Michigan, WI',
    '9014098': 'Fort Gratiot, MI',
};

async function displayData() {
    const dataDisplay = document.getElementById('data-display');
    dataDisplay.innerHTML = ''; // Clear existing content

    for (let stationId of stationIds) {
        const stationData = await fetchStationData(stationId);
        const stationName = stationDetails[stationId]; // Get station name

        // Update the display with station data
        if (stationData) {
            dataDisplay.innerHTML += `
                <div class="data-item">
                    <strong>Station Name: \n \n ${stationName}</strong>
                    <span>Station Id:  ${stationId}</span><br>
                    <span>Water Level: ${stationData.water_level} meters</span>
                </div>
            `;
        } else {
            dataDisplay.innerHTML += `
                <div class="data-item">
                    <strong> \n \n ${stationName}</strong>
                    <span>Station Id:  ${stationId}</span><br>
                    <em>No data available</em>
                </div>
            `;
        }
    }
}
document.addEventListener("DOMContentLoaded", function() {
    displayData(); // Call the displayData function when the DOM is fully loaded
});
