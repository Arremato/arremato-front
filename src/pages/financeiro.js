import { Typography, Container } from '@mui/material';

export default function Financeiro() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financeiro
      </Typography>
      <Typography variant="body1">
        Aqui você pode visualizar e gerenciar informações financeiras.
      </Typography>
    </Container>
  );
}