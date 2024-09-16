// Initialize Firebase Firestore
const db = firebase.firestore();

// Helper function to populate time options
function populateTimeDropdown(selectElement) {
    selectElement.innerHTML = ''; // Clear previous options
    for (let hour = 0; hour < 24; hour++) {
        for (let min = 0; min < 60; min += 30) {
            let formattedHour = hour < 10 ? `0${hour}` : hour;
            let formattedMin = min < 10 ? `0${min}` : min;
            let timeOption = `${formattedHour}:${formattedMin}`;
            let option = document.createElement('option');
            option.value = timeOption;
            option.text = timeOption;
            selectElement.add(option);
        }
    }
}

// Function to load availability from the database
async function loadAvailability() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availabilityDoc = await db.collection('availability').doc('current').get();

    if (availabilityDoc.exists) {
        const availabilityData = availabilityDoc.data();
        days.forEach(day => {
            const startSelect = document.getElementById(`${day}-start`);
            const endSelect = document.getElementById(`${day}-end`);
            
            // Populate the dropdowns
            populateTimeDropdown(startSelect);
            populateTimeDropdown(endSelect);

            if (availabilityData[day]) {
                startSelect.value = availabilityData[day].time.start;
                endSelect.value = availabilityData[day].time.end;
                toggleAvailability(day, availabilityData[day].isAvailable);
            }
        });

        // Load unavailable dates
        const unavailableDates = availabilityData.unavailableDates || [];
        const unavailableDatesList = document.getElementById('unavailableDatesList');
        unavailableDates.forEach(date => {
            addUnavailableDateToList(date);
        });
    }
}

// Toggle the availability for a day
function toggleAvailability(day, isAvailable) {
    const button = document.querySelector(`button[data-day="${day}"]`);
    if (isAvailable) {
        button.classList.add('available-toggle');
        button.classList.remove('unavailable-toggle');
        button.innerText = 'Available';
    } else {
        button.classList.remove('available-toggle');
        button.classList.add('unavailable-toggle');
        button.innerText = 'Unavailable';
    }
}

// Event listener for toggling availability
document.querySelectorAll('.availability-button').forEach(button => {
    button.addEventListener('click', function() {
        const day = this.getAttribute('data-day');
        const isAvailable = this.classList.contains('unavailable-toggle');
        toggleAvailability(day, isAvailable);
    });
});

// Add unavailable date range to list
function addUnavailableDateToList(date) {
    const unavailableDatesList = document.getElementById('unavailableDatesList');
    const li = document.createElement('li');
    li.textContent = date;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'X';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => {
        li.remove();
    });
    li.appendChild(removeBtn);
    unavailableDatesList.appendChild(li);
}

// Add unavailable date range event
document.getElementById('addUnavailableDateRange').addEventListener('click', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (startDate && endDate) {
        addUnavailableDateToList(`${startDate} to ${endDate}`);
    } else {
        alert('Please select both start and end dates.');
    }
});

// Save availability data to Firebase
document.getElementById('availabilityForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const availabilityData = {};

    days.forEach(day => {
        const start = document.getElementById(`${day}-start`).value;
        const end = document.getElementById(`${day}-end`).value;
        const isAvailable = document.querySelector(`button[data-day="${day}"]`).classList.contains('available-toggle');

        availabilityData[day] = {
            time: {
                start: start,
                end: end
            },
            isAvailable: isAvailable
        };
    });

    const unavailableDatesList = document.getElementById('unavailableDatesList').querySelectorAll('li');
    const unavailableDates = Array.from(unavailableDatesList).map(li => li.textContent.replace('X', '').trim());

    availabilityData.unavailableDates = unavailableDates;

    await db.collection('availability').doc('current').set(availabilityData);
    document.getElementById('statusMessage').innerText = 'Availability saved successfully!';
});

loadAvailability();
