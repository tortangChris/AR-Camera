import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ARCamera from "./Components/ARCamera";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ARCamera />} />
      </Routes>
    </Router>
  );
};

export default App;
