# Campus Notify

React + Vite frontend for the Campus Notifications platform.

## Run in VS Code

1. Open this folder in VS Code
2. Open the integrated terminal (`Ctrl+`` ` or **Terminal → New Terminal**)
3. Run:

```bash
npm install
npm run dev
```

4. Open **http://localhost:3000** in your browser

## API Token (if needed)

```bash
# Rename .env.example to .env and add your token
VITE_API_TOKEN=your_token_here
```

## Pages

| Route       | Description                                    |
|-------------|------------------------------------------------|
| `/`         | All notifications — filter by type, paginated  |
| `/priority` | Top-N priority inbox — slider for N, type filter |

## Folder structure

```
campus-notify/
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── src/
    ├── main.jsx              # entry point + MUI theme
    ├── App.jsx               # routes
    ├── lib/
    │   └── notifications.js  # API + scoring logic
    ├── components/
    │   ├── NavBar.jsx
    │   └── NotificationCard.jsx
    └── pages/
        ├── AllNotifications.jsx
        └── PriorityInbox.jsx
```