import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "stores";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardPage from "pages/Dashboard";
import ErrorPage from "pages/ErrorPage";
import AuthPage from "pages/Auth";
import { ThemeProvider } from "@mui/material";
import { theme } from "theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root") as Element);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
