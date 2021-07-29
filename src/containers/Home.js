import React from "react";
import "./Home.css";

export default function Home() {

  function renderLander() {
    return (
      <div className="lander">
        <h1>Post-It: A Coisa</h1>
        <p className="text-muted">Lembre-se do que mais te assusta!</p>
      </div>
    );
    }
  return (
    <div className="Home">
      {renderLander()}
    </div>
  );
  }