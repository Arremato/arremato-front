import { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openRegister, setOpenRegister] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [registerError, setRegisterError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH_API}/api/login`, {
        email,
        password,
      });

      const { token } = response.data;
      sessionStorage.setItem('authToken', token);
      router.push('/');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH_API}/api/users`, registerData);

      setOpenRegister(false);
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Erro ao cadastrar usuário');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: 'white',
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Login
        </Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && (
          <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Entrar
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => setOpenRegister(true)}
        >
          Cadastrar
        </Button>
      </Box>

      <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
        <DialogTitle>Cadastrar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            type="text"
            fullWidth
            margin="normal"
            value={registerData.name}
            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            margin="normal"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          />
          {registerError && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
              {registerError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegister(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleRegister} color="primary">
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}