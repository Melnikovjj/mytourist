import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import Layout from './Layout';
import { Home } from './pages/Home';
import { ProjectDetails } from './pages/ProjectDetails';
import { Profile } from './pages/Profile';
import { SettingsPage } from './pages/Settings';
import { CreateProject } from './pages/CreateProject';

// Fallback for 404
const NotFound = () => (
  <div className="flex items-center justify-center min-h-screen text-[#1C1C1E]">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-[#1C1C1E]/60">Page not found</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "create",
        Component: CreateProject,
      },
      {
        path: "project/:id",
        Component: ProjectDetails,
      },
      {
        path: "profile",
        Component: Profile,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
      {
        path: "*",
        Component: NotFound,
      }
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
