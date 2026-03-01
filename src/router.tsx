import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./components/layout/AppShell";
import { ArchivesPage } from "./features/archives/ArchivesPage";
import { DimensionsPage } from "./features/dimensions/DimensionsPage";
import { OverviewPage } from "./features/overview/OverviewPage";
import { SessionsPage } from "./features/sessions/SessionsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: "sessions",
        element: <SessionsPage />,
      },
      {
        path: "dimensions",
        element: <DimensionsPage />,
      },
      {
        path: "archives",
        element: <ArchivesPage />,
      },
    ],
  },
]);
