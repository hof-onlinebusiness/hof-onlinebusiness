// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
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

    // Check availability
    const slotRef = db.collection('appointments').doc(slot);
    const doc = await slotRef.get();

    if (doc.exists) {
        const data = doc.data();
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
