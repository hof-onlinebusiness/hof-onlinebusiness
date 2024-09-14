const form = document.getElementById('bookingForm');
const statusDiv = document.getElementById('status');
const limit = 3;  // Max number of bookings per time slot

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (!date || !time) {
        alert('Please select both a date and a time!');
        return;
    }

    const slot = `${date}_${time}`;
    const slotRef = db.collection('appointments').doc(slot);
    const docSnap = await slotRef.get();

    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.bookings.length >= limit) {
            statusDiv.innerText = 'This time slot is fully booked.';
        } else {
            // Add booking
            data.bookings.push({ user: 'anonymous' });  // Replace 'anonymous' with actual user info
            await slotRef.update({ bookings: data.bookings });
            statusDiv.innerText = 'Your appointment is booked!';
        }
    } else {
        // Create new booking slot
        await slotRef.set({ bookings: [{ user: 'anonymous' }] });  // Replace 'anonymous' with actual user info
        statusDiv.innerText = 'Your appointment is booked!';
    }
});
