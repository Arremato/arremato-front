import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openRegisterModal, setOpenRegisterModal] = useState(false); // Controle do modal de cadastro
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' }); // Dados do cadastro
  const [registerError, setRegisterError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH_API}/api/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      sessionStorage.setItem('authToken', token);
      sessionStorage.setItem('userName', user.name);
      router.push('/'); // Redireciona para o Dashboard
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_PATH_API}/api/users`, registerData);
      setOpenRegisterModal(false); // Fecha o modal após o cadastro
      alert('Usuário cadastrado com sucesso!'); // Exibe uma mensagem de sucesso
      setRegisterData({ name: '', email: '', password: '' }); // Reseta os campos do formulário
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Erro ao cadastrar usuário');
    }
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  return (
    <Container sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 400, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: 'white' }}>
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
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Button variant="outlined" color="secondary" fullWidth onClick={() => setOpenRegisterModal(true)}>
              Cadastrar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
              Entrar
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Modal de Cadastro */}
      <Dialog open={openRegisterModal} onClose={() => setOpenRegisterModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Cadastrar Usuário</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            name="name"
            value={registerData.name}
            onChange={handleRegisterInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={registerData.email}
            onChange={handleRegisterInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Senha"
            name="password"
            type="password"
            value={registerData.password}
            onChange={handleRegisterInputChange}
            fullWidth
            margin="normal"
          />
          {registerError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {registerError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegisterModal(false)} color="secondary">
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