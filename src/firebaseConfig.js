import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB37yUryuUnFYLHxhP3_I4IYok-COV_vyg",
    authDomain: "test-11340.firebaseapp.com",
    projectId: "test-11340",
    storageBucket: "test-11340.firebasestorage.app",
    messagingSenderId: "891672048023",
    appId: "1:891672048023:web:aa255259538b6dfebc94d2",
    measurementId: "G-LVT3BP8D5J"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;