import React from "react";
import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div>
      <h1>This route doesn't exists!</h1>
      <Link to="/">
        <h3>Back to Home</h3>
      </Link>
    </div>
  );
};

export default Error404;
