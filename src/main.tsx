import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "react-hot-toast";
import SmoothScroll from "./components/SmoothScroll";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SmoothScroll>
      <Provider store={store}>
        <RouterProvider router={router} />
        <Toaster
          containerStyle={{
            zIndex: 99999999999,
          }}
        />
      </Provider>
    </SmoothScroll>
  </React.StrictMode>
);
