import { Routes, Route } from "react-router-dom";

import { Login } from "./components";

import { Home } from "./pages";

import ProtectedRoute from "./ProtectedRoute";
import LoggedRoute from "./LoggedRoute";

const App = () => {
  return (
    <Routes>
      <Route
        path="login"
        element={
          <LoggedRoute>
            <Login />
          </LoggedRoute>
        }
      />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
