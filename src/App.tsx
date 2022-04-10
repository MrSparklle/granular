import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Fields from "pages/fields/Fields";
import styles from "./App.module.scss";
import FieldDetail from "pages/field-detail/FieldDetail";
import Error404 from "pages/error/Error404";

function App() {
  // all pages componentes will be added here with a specific router controller like react-router-dom
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Fields />} />
        <Route path="/field/:fieldId" element={<FieldDetail />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </div>
  );
}

export default App;
