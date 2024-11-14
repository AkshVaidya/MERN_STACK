import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export const MONTHS = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export function MonthSelector({ value, onChange }) {
  return (
    <FormControl size="small" fullWidth>
      <InputLabel>Month</InputLabel>
      <Select
        value={value}
        label="Month"
        onChange={(e) => onChange(e.target.value)}
      >
        {Object.keys(MONTHS).map((el) => (
          <MenuItem key={el} value={el}>{MONTHS[el]}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
