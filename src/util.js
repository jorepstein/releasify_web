import useMediaQuery from "@mui/material/useMediaQuery";

export function isMobile() {
  return useMediaQuery((theme) => {
    return theme.breakpoints.down("md");
  });
}
