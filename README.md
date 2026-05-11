# CollabSync Frontend

React + TypeScript + Vite frontend for realtime workspace collaboration.

## Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Routing:** React Router
- **Icons:** Lucide React

## Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Project Structure

```
src/
├── components/      # UI components
│   ├── auth/       # Login, Register
│   ├── chat/       # Chat components
│   ├── layout/     # Header, etc.
│   ├── tasks/      # Kanban board
│   ├── ui/         # Reusable UI (Button, Input, etc.)
│   └── workspace/  # Workspace components
├── hooks/           # Custom React hooks
├── pages/           # Route pages
├── services/        # API client & Socket service
├── store/           # Zustand stores
├── types/           # TypeScript interfaces
└── config/          # Environment config
```

## Features

- JWT Authentication with automatic token refresh
- Real-time updates via Socket.io
- Kanban board with drag-and-drop (dnd-kit)
- Team chat with typing indicators
- Unread message badges
- Notification system
- Dark theme UI
- Responsive design