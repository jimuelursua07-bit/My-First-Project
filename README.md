# Library Renting Books

A React + Firebase + Express library book renting system inspired by the structure and flow of the Padyak reference application.

## Project structure

- `frontend/` - React + Vite + Firebase Authentication/Firestore client
- `backend/` - Express REST API that communicates with Firestore using the signed-in Firebase ID token
- `firestore.rules` - Firestore security rules

## Requirements

- Node.js 20+ recommended
- A Firebase project using the supplied web configuration
- Enable Email/Password and Google sign-in in Firebase Authentication
- Create a Firestore database
- Deploy `firestore.rules` to the same Firebase project

## Run frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend normally runs at `http://localhost:5173`.

## Run backend

Open another PowerShell window:

```powershell
cd backend
copy .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:8080`.

If your backend uses another URL, create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Admin account

New registrations are assigned `role: "user"`. To make a user an administrator, open Firestore and change that user's document in `users` to:

```text
role: admin
```

The application and backend both check the role before allowing admin operations.

## First setup

1. Enable Firebase Authentication providers.
2. Create Firestore.
3. Deploy `firestore.rules`.
4. Register a normal account.
5. Change that account's Firestore `role` to `admin`.
6. Start frontend and backend.
7. Login as admin and add books.
8. Login as a normal user and rent an available book.

## Important

The Express backend does not use a Firebase service-account key. It receives the Firebase user's ID token from the React client and uses that token for Firestore REST requests. This keeps the generated project from requiring a private service-account JSON file in the ZIP.
