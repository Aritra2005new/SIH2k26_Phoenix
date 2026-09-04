# GovStartAI Frontend

React/Vite frontend aligned to the uploaded Django REST backend.

## Backend

The frontend uses the Django API through the Vite development proxy:

- Browser: `http://localhost:5173`
- Django: `http://127.0.0.1:8000`
- API prefix: `/api`

## Run

1. Start Django:

```bash
python manage.py runserver
```

2. In this frontend folder:

```bash
npm install
npm run dev
```

## Backend-backed features

- JWT login/refresh-compatible login flow
- Startup registration (the current backend always creates STARTUP users)
- Government challenge creation/listing
- Challenge-based ML recommendations
- Startup profile creation
- Startup profile viewing from recommendation results
- Government startup selection
- Startup pending challenge requests
- Startup accept/reject
- Government application/project tracking
- Startup progress updates using the backend progress endpoint
- Notifications and mark-as-read

## Features intentionally removed

The current backend does not expose APIs for search history, startup directory listing, saved startups, messaging/contact, documents, separate solutions, or government profile CRUD. Those unsupported frontend features were removed from active routing/navigation.

## Important current backend limitations

1. Challenge creation requires an existing `GovernmentDepartment` primary key, so the challenge form asks for `department` ID.
2. Startup registration returns a user but does not return JWT tokens; the frontend logs in immediately after successful registration.
3. The backend exposes pending startup applications but does not expose a startup-side list of accepted projects. After an ACCEPT response, the frontend stores that returned application locally so the real progress endpoint can be used. A dedicated backend accepted-project endpoint would be preferable for production.
4. The backend's startup profile API is POST-only; there is no profile update endpoint. The frontend therefore uses the real POST endpoint and warns that duplicate creation may be rejected.
5. The ML recommendation endpoint returns the ML startup ID plus `django_startup_id` when name matching finds a Django profile.
