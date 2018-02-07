import * as React from "react";
import styled from "react-emotion";

const Grid = styled("div")`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;

  > iframe {
    min-width: 300px;
    min-height: 600px;
  }
`;

const Dashboard = () => {
  const endpoints = [
    "http://localhost:8080/?w=ws://127.0.0.1:9545",
    "http://localhost:8080/?w=ws://127.0.0.1:9546",
    "http://localhost:8080/?w=ws://127.0.0.1:9547"
  ];

  return <Grid>{endpoints.map(url => <iframe key={url} src={url} />)}</Grid>;
};

export default Dashboard;
