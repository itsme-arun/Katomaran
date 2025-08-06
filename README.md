# ToDo Mobile App

📦 [Download APK](https://github.com/<your-username>/<your-repo-name>/releases/download/v1.0.0/your-app-name.apk)


A cross-platform (Android/iOS) **ToDo Task Management App** built with React Native (Expo), Firebase, and Social Login.  
Designed with a clean UI and scalable MVVM architecture—ideal for hackathon demos.

---

## 🚀 Features

- 🔐 Google & Facebook authentication (OAuth via Expo AuthSession + Firebase)
- 🔄 Real-time task management with Firebase Firestore
- 📝 Add, edit, delete, and mark tasks as completed
- ✅ Persistent login state with Firebase Auth
- 📱 Responsive and interactive mobile UI
- 🧩 Modular MVVM-based project structure

---

## 🧠 Architecture

This app follows the **MVVM (Model-View-ViewModel)** design pattern:

- **Model:** Firebase (Firestore and Auth)
- **ViewModel:** React hooks and Context API for state management
- **View:** React Native components with clean UI and animations

📌 *Refer to the included architecture diagram for a visual overview.*

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/todo-app.git
   cd todo-app
Install Dependencies

bash
Copy
Edit
npm install
Add Firebase Configuration

Create a file: services/firebaseConfig.js

Paste your Firebase config object:

js
Copy
Edit
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
Configure OAuth Credentials

Set redirect URI in your developer consoles:
https://auth.expo.io/@your-username/your-project-slug

Google Cloud Console:

Add to OAuth 2.0 Client → Authorized redirect URIs

Facebook Developer Console:

Add the same URI under "Valid OAuth Redirect URIs"

Set auth.expo.io under App Domains

Add testers in "Roles" tab

Run the App

bash
Copy
Edit
expo start
Scan QR code with Expo Go (Android/iOS)

Build Android APK (Optional)

bash
Copy
Edit
eas build --platform android
Download APK from EAS dashboard

🔐 Social Login Setup
Google
Add your Expo redirect URI to your Google OAuth client settings.

Facebook
Add the URI to Facebook → Valid OAuth Redirect URIs

Add auth.expo.io as an App Domain

Add testers under Roles → Testers section
