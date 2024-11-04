import React from "react";
import "./App.css";
import MainRoutes from "./Routes";
import Appbar from "./components/Appbar/Appbar";
import SnackBar from "./components/common/Snackbar/SnackBar";

function App() {
  return (
    <div className="app-container">
      <div className="app-wrapper">
        <SnackBar />
        <Appbar />
        <main className="main-content">
          <MainRoutes />
        </main>
      </div>
    </div>
  );
}

export default App;