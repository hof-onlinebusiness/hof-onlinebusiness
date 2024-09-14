// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDZfTvPrbExyZ5UMsRNZ_IPYH4NDe61tM8",
  authDomain: "hof-online-booking-system.firebaseapp.com",
  projectId: "hof-online-booking-system",
  storageBucket: "hof-online-booking-system.appspot.com",
  messagingSenderId: "513439830348",
  appId: "1:513439830348:web:356c7a6e2ad5fbfeffbfe9",
  measurementId: "G-FNQE3GHVDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
