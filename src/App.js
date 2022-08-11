/** @format */

import "./App.css";
import Table from "./components/Table";

function App() {
  return (
    <div className="App" style={{ overflowX: "hidden" }}>
      <h1>Country-wise Internet Users</h1>
      <Table />
    </div>
  );
}

export default App;
