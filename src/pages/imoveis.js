import { useState, useEffect } from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import apiClient from '../utils/apiClient';

export default function Imoveis() {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    valuation: '',
    payment_method: '',
    acquisition_date: '',
    purpose: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await apiClient.get('/api/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProperty({ ...newProperty, [name]: value });
  };

  const handleAddProperty = async () => {
    try {
      await apiClient.post('/api/properties', newProperty);
      fetchProperties(); // Atualiza a lista de imóveis
      setNewProperty({
        name: '',
        location: '',
        valuation: '',
        payment_method: '',
        acquisition_date: '',
        purpose: '',
      });
      setOpenModal(false); // Fecha o modal após o cadastro
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao cadastrar imóvel');
    }
  };

  const translatePurpose = (purpose) => {
    const translations = {
      sale: 'Venda',
      rental: 'Aluguel',
      residence: 'Residência',
    };
    return translations[purpose] || purpose;
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Imóveis
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ mb: 4 }}>
        Cadastrar Novo Imóvel
      </Button>

      {/* Modal de Cadastro */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Cadastrar Novo Imóvel</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nome"
                name="name"
                value={newProperty.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Localização"
                name="location"
                value={newProperty.location}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Avaliação (R$)"
                name="valuation"
                type="number"
                value={newProperty.valuation}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Método de Pagamento"
                name="payment_method"
                value={newProperty.payment_method}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Data de Aquisição"
                name="acquisition_date"
                type="date"
                value={newProperty.acquisition_date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Finalidade"
                name="purpose"
                value={newProperty.purpose}
                onChange={handleInputChange}
                fullWidth
              >
                <MenuItem value="sale">Venda</MenuItem>
                <MenuItem value="rental">Aluguel</MenuItem>
                <MenuItem value="residence">Residência</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddProperty} color="primary">
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lista de Imóveis */}
      <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
        Lista de Imóveis
      </Typography>
      <Grid container spacing={2}>
        {properties.map((property) => (
          <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={property.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{property.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Localização: {property.location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Avaliação: R$ {property.valuation}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Método de Pagamento: {property.payment_method}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Data de Aquisição: {property.acquisition_date}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Finalidade: {translatePurpose(property.purpose)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Ver Detalhes
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}