import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./view/pages/HomePage/HomePage"; // Correct import path

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
