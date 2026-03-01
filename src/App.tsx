import { RouterProvider } from "react-router-dom";

import { DashboardDataProvider } from "./lib/data/context";
import { router } from "./router";

export default function App() {
  return (
    <DashboardDataProvider>
      <RouterProvider router={router} />
    </DashboardDataProvider>
  );
}
