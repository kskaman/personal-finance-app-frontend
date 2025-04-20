import { Stack, Typography } from "@mui/material";

const NotFoundPage = () => (
  <Stack
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    width="100vw"
    gap={2}
  >
    <Typography variant="h3" fontWeight={700}>
      404
    </Typography>
    <Typography variant="h6">
      Sorry, the page you’re looking for doesn’t exist.
    </Typography>
  </Stack>
);

export default NotFoundPage;
