// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Your web app's Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app);

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

    // Get a reference to the document for the specific time slot
    const slotRef = doc(db, "appointments", slot);
    const docSnap = await getDoc(slotRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.bookings.length >= limit) {
            statusDiv.innerText = 'This time slot is fully booked.';
        } else {
            // Add booking
            data.bookings.push({ user: 'anonymous' });  // Replace 'anonymous' with actual user info
            await updateDoc(slotRef, { bookings: data.bookings });
            statusDiv.innerText = 'Your appointment is booked!';
        }
    } else {
        // Create new booking slot
        await setDoc(slotRef, { bookings: [{ user: 'anonymous' }] });  // Replace 'anonymous' with actual user info
        statusDiv.innerText = 'Your appointment is booked!';
    }
});
