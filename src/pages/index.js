import { Typography, Button, Container } from '@mui/material';

export default function Home() {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Bem-vindo ao Arremato!
      </Typography>
      <Button variant="contained" color="primary" href="/login">
        Fazer Login
      </Button>
    </Container>
  );
}