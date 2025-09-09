# Trello Clone - Task Management App

A modern, responsive task management application built with React, TypeScript, and Tailwind CSS. This project replicates the core functionality of Trello with a clean, intuitive interface for managing boards, lists, and tasks.

## ✨ Features

- **📋 Board Management**: Create, edit, and delete multiple boards
- **📝 List Organization**: Organize tasks into customizable lists (To Do, In Progress, Done)
- **🎯 Task Management**: Add, edit, delete, and move tasks between lists
- **🔍 Search Functionality**: Search through tasks and descriptions
- **🌙 Dark Mode**: Toggle between light and dark themes
- **💾 Local Storage**: All data is automatically saved to browser's local storage
- **📤 Export/Import**: Backup and restore your data with JSON export/import
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🎨 Drag & Drop**: Intuitive drag-and-drop interface for task management
- **🧩 Modular Components**: Well-organized component structure with reusable Lists component

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ronit675/trello-clone-assessment.git
   cd trello-clone-assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1
- **Language**: TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.13
- **Icons**: Lucide React
- **Drag & Drop**: @dnd-kit
- **Routing**: React Router DOM
- **Linting**: ESLint

## 🏗️ Component Architecture

The application follows a modular component structure:

- **Dashboard**: Main overview page displaying all boards
- **Board**: Individual board view with lists and tasks
- **Lists**: Container component managing multiple lists and list operations
- **List**: Individual list component with task management
- **TaskCard**: Individual task display and interaction
- **Modal**: Reusable modal component for various dialogs

### Key Components:

- **`Lists.jsx`**: New modular component containing both individual List and Lists container functionality
- **`components.jsx`**: Legacy component file with the original List implementation
- **`useLocalStorage.js`**: Custom hook for managing local storage operations

## 📁 Project Structure

```
trello-clone/
├── src/
│   ├── App.tsx          # Main application component
│   ├── main.jsx         # Application entry point
│   ├── types.js         # Type definitions and utility functions
│   ├── storage.js       # Local storage utilities
│   ├── components.jsx   # Legacy components (List component)
│   ├── pages/
│   │   ├── Board.jsx    # Board view component
│   │   └── Dashboard.jsx # Dashboard component
│   ├── components/
│   │   ├── index.js     # Component exports
│   │   ├── Lists.jsx    # Lists component (new)
│   │   ├── Modal.jsx    # Modal component
│   │   └── TaskCard.jsx # Task card component
│   ├── hooks/
│   │   └── useLocalStorage.js # Custom hook for local storage
│   ├── assets/          # Static assets
│   ├── App.css          # Global styles
│   └── index.css        # Base styles
├── public/              # Public assets
├── dist/                # Build output
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🎯 Usage

### Creating a Board
1. Click "Create New Board" on the dashboard
2. Enter a board title
3. Click "Create" to add the board

### Managing Lists
- **Add List**: Click "Add another list" on any board
- **Edit List**: Click on the list title to edit (shows edit icon on hover)
- **Delete List**: Click the trash icon next to the list title
- **List Management**: The new Lists component provides enhanced list functionality with better organization

### Managing Tasks
- **Add Task**: Click "Add a task" in any list
- **Edit Task**: Click the edit icon on any task card
- **Delete Task**: Click the trash icon on any task card
- **Move Task**: Drag and drop tasks between lists

### Additional Features
- **Search**: Use the search bar to find specific tasks
- **Dark Mode**: Toggle the theme using the sun/moon icon
- **Export Data**: Download your data as a JSON file
- **Import Data**: Upload a previously exported JSON file

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

This application can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder or connect your repository
- **GitHub Pages**: Use GitHub Actions to deploy automatically
- **Firebase Hosting**: Use Firebase CLI to deploy

## 🔄 Recent Updates

### Component Architecture Improvements
- **New Lists Component**: Created a dedicated `Lists.jsx` component file for better organization
- **Modular Structure**: Separated list functionality into reusable components
- **Enhanced UI**: Added hover effects and improved visual feedback
- **Better Organization**: Components are now properly organized in the `/components` directory

### File Structure Changes
- Added `/src/components/Lists.jsx` - New modular lists component
- Updated `/src/components/index.js` - Added exports for new components
- Maintained backward compatibility with existing `components.jsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by Trello's intuitive task management interface
- Built with modern React patterns and best practices
- Icons provided by [Lucide React](https://lucide.dev/)

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub.

---

**Happy task managing! 🎉**