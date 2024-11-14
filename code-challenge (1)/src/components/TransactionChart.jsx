import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { MONTHS } from "./shared/MonthSelector";
import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts";

export function TransactionChart({ month }) {
  const [stats, setStats] = useState([]);
  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/statistics/barchart/" + month);
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, [month]);
  return (
    <Card variant="outlined">
      <CardHeader title={`Bar Chart Stats - ${MONTHS[month]}`} />
      <CardContent>
        <BarChart
          series={[{ data: stats.map((el) => el.count) }]}
          height={290}
          xAxis={[
            { data: stats.map((el) => el.priceRange), scaleType: "band", tickLabelPlacement: 'middle' },
          ]}
          margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
        />
      </CardContent>
    </Card>
  );
}
