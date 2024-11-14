import { Box } from "@mui/material";
import "./App.css";
import { TransactionList } from "./components/TransactionList";
import { useState } from "react";
import { TransactionStats } from "./components/TransactionStats";
import { TransactionChart } from "./components/TransactionChart";

function App() {
  const [month, setMonth] = useState("3");
  return (
    <Box display="flex" flexDirection="column" gap="20px" p="20px">
      <TransactionList month={month} onMonthChange={setMonth} />
      <Box display="flex" gap="20px" height={400}>
        <Box flex={1}>
          <TransactionStats month={month} />
        </Box>
        <Box flex={1}>
          <TransactionChart month={month} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
