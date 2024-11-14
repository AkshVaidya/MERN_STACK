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

export function TransactionStats({ month }) {
  const [stats, setStats] = useState();
  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/statistics/stats/" + month);
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, [month]);
  return (
    <Card variant="outlined">
      <CardHeader title={`Statistics - ${MONTHS[month]}`} />
      <CardContent>
        <Stack gap={"20px"}>
          <Box display="flex" alignItems="center">
            <Typography width={250} fontWeight={500}>
              Total Sale
            </Typography>
            <Typography>{stats?.totalSales}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography width={250} fontWeight={500}>
              Total sold items
            </Typography>
            <Typography>{stats?.totalSoldItems}</Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography width={250} fontWeight={500}>
              Total not sold items
            </Typography>
            <Typography>{stats?.totalNotSoldItems}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
