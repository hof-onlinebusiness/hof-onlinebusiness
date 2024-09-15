const form = document.getElementById('bookingForm');
const statusDiv = document.getElementById('status');
const reviewBtn = document.getElementById('reviewBtn');
const confirmationModal = document.getElementById('confirmationModal');
const confirmationDetails = document.getElementById('confirmationDetails');
const confirmSubmit = document.getElementById('confirmSubmit');
const editInfo = document.getElementById('editInfo');
const limit = 3;  // Max number of bookings per time slot

// Helper function to validate email
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email format validation
    return emailPattern.test(email);
}

// Helper function to validate contact number (must be all numbers and at least 10 digits)
function validateContactNumber(contactNumber) {
    const numberPattern = /^\d+$/;  // Allows only digits
    return numberPattern.test(contactNumber) && contactNumber.length >= 10;
}

// Helper function to check if the selected date/time is in the past
function isBookingInPast(date, time) {
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    return selectedDateTime < now;  // Check if selected date/time is earlier than current time
}

// Review button click handler
reviewBtn.addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const specialRequests = document.getElementById('specialRequests').value;

    // Validate email and contact number
    if (!validateEmail(email)) {
        alert('Please enter a valid email address!');
        return;
    }
    if (!validateContactNumber(contactNumber)) {
        alert('Please enter a valid contact number (at least 10 digits and numbers only)!');
        return;
    }

    // Prevent booking in the past
    if (isBookingInPast(date, time)) {
        alert('You cannot book an appointment in the past. Please select a valid date and time.');
        return;
    }

    if (!firstName || !lastName || !email || !contactNumber || !date || !time) {
        alert('Please fill out all fields!');
        return;
    }

    // Show confirmation details
    confirmationDetails.innerHTML = `
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact Number:</strong> ${contactNumber}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Time:</strong> ${time}</p>
        <p><strong>Special Requests:</strong> ${specialRequests}</p>
    `;
    confirmationModal.style.display = 'block'; // Show modal
});

// Go back and edit information
editInfo.addEventListener('click', () => {
    confirmationModal.style.display = 'none'; // Hide modal
});

// Confirm submission
confirmSubmit.addEventListener('click', async () => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const specialRequests = document.getElementById('specialRequests').value;

    const slot = `${date}_${time}`;
    const slotRef = db.collection('appointments').doc(slot);

    const docSnap = await slotRef.get();

    if (docSnap.exists) {
        const data = docSnap.data();
        if (data.bookings.length >= limit) {
            statusDiv.innerText = 'This time slot is fully booked.';
            statusDiv.classList.add('error');
        } else {
            // Add booking with user info
            data.bookings.push({
                firstName: firstName,
                lastName: lastName,
                email: email,
                contactNumber: contactNumber,
                specialRequests: specialRequests
            });
            await slotRef.update({ bookings: data.bookings });
            statusDiv.innerText = 'Your appointment is booked!';
            statusDiv.classList.remove('error');
        }
    } else {
        // Create new booking slot with user info
        await slotRef.set({
            bookings: [{
                firstName: firstName,
                lastName: lastName,
                email: email,
                contactNumber: contactNumber,
                specialRequests: specialRequests
            }]
        });
        statusDiv.innerText = 'Your appointment is booked!';
        statusDiv.classList.remove('error');
    }

    // Hide modal and reset form
    confirmationModal.style.display = 'none';
    form.reset();  // Reset form after submission
});
