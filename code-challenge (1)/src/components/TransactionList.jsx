import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { MonthSelector } from "./shared/MonthSelector";
import { useEffect, useState } from "react";

const defaultPaginationState = {
  pageSize: 10,
  page: 1,
  totalPages: 0,
};

export function TransactionList({ month, onMonthChange }) {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(defaultPaginationState);
  useEffect(() => {
    async function fetchStats() {
      const urlParams = new URLSearchParams({
        page: pagination.page,
      });

      if (search) {
        urlParams.set("search", search);
      }
      const res = await fetch(
        `/api/transactions/fetching/${month}?` + urlParams.toString()
      );
      const data = await res.json();
      setList(data?.data ?? []);
      setPagination(data.pagination);
    }
    fetchStats();
  }, [month, pagination.page, search]);

  return (
    <Card elevation={0} variant="outlined">
      <CardHeader title="Transactions" />
      <CardContent>
        <Stack gap="20px">
          <Box display="flex" justifyContent="space-between">
            <TextField
              sx={{ width: 300 }}
              size="small"
              label="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination(defaultPaginationState);
              }}
            />
            <Box width={300}>
              <MonthSelector
                value={month}
                onChange={(v) => {
                  onMonthChange(v);
                  setPagination(defaultPaginationState);
                }}
              />
            </Box>
          </Box>
          <TableContainer sx={{ height: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Sold</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list.map((el) => {
                  return (
                    <TableRow key={el.id}>
                      <TableCell>{el.id}</TableCell>
                      <TableCell>{el.title}</TableCell>
                      <TableCell>{el.description}</TableCell>
                      <TableCell>{el.price}</TableCell>
                      <TableCell>{el.category}</TableCell>
                      <TableCell>{el.sold ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <img width={50} height={50} src={el.image} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontSize={14}>Page No: {pagination.page}</Typography>
            <Box display="flex" alignItems="center" gap={"20px"}>
              <Button
                size="small"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Previous
              </Button>
              <Button
                size="small"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </Box>
            <Typography fontSize={14}>
              Per Page: {pagination.pageSize}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
