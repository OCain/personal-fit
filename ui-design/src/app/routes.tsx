import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layouts/RootLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { ClientProfile } from "./pages/ClientProfile";
import { Schedule } from "./pages/Schedule";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "clients", Component: Clients },
      { path: "clients/:id", Component: ClientProfile },
      { path: "schedule", Component: Schedule },
      { path: "*", Component: NotFound },
    ],
  },
]);