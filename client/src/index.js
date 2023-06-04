import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import styles from "./index.module.scss";
import { CssBaseline, ThemeProvider } from "@mui/material";
// import { theme } from "./theme";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./state";
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import HomePage from "./scenes/homePage/HomePage";
import AnnosPage from "./scenes/annosPage/AnnosPage";
import InfoPage from "./scenes/infoPage/InfoPage";
import AnnoPage from "./scenes/annoPage/AnnoPage";
import ProfilePage from "./scenes/profilePage/ProfilePage";
import EditProfilePage from "./scenes/editProfilePage/EditProfilePage";
import CreateAnnoPage from "./scenes/createAnnoPage/CreateAnnoPage";
import UserAnnosPage from "./scenes/UserAnnosPage/UserAnnosPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const store = configureStore({
  reducer: { main: mainReducer },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <>
            <ScrollToTop />
            <HomePage />
          </>
        ),
      },
      {
        path: "/create",
        element: (
          <>
            <ScrollToTop />
            <CreateAnnoPage />
          </>
        ),
      },
      {
        path: "/profile",
        children: [
          {
            index: true,
            element: (
              <>
                <ScrollToTop />
                <ProfilePage />
              </>
            ),
          },
          {
            path: "/profile/edit",
            element: (
              <>
                <ScrollToTop />
                <EditProfilePage />
              </>
            ),
          },
          {
            path: "/profile/my-announcments",
            children: [
              {
                index: true,
                element: (
                  <>
                    <ScrollToTop />
                    <UserAnnosPage type="announcments" />
                  </>
                ),
              },
              {
                path: "/profile/my-announcments/:annoId",
                element: <AnnoPage />,
              },
            ],
          },
          {
            path: "/profile/wishlist",
            children: [
              {
                index: true,
                element: (
                  <>
                    <ScrollToTop />
                    <UserAnnosPage type="wishlist" />
                  </>
                ),
              },
              {
                path: "/profile/wishlist/:annoId",
                element: <AnnoPage />,
              },
            ],
          },
        ],
      },
      {
        path: "/:annoId",
        element: <AnnoPage />,
      },
      {
        path: "/annos",
        children: [
          {
            index: true,
            element: (
              <>
                <ScrollToTop />
                <AnnosPage />
              </>
            ),
          },
          {
            path: "/annos/:annoId",
            element: <AnnoPage />,
          },
        ],
      },

      {
        path: "/info",
        element: (
          <>
            <ScrollToTop />
            <InfoPage />
          </>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    {/* <ThemeProvider theme={theme}> */}
    {/* <CssBaseline /> */}
    <RouterProvider router={router} />
    {/* </ThemeProvider> */}
  </Provider>
);
