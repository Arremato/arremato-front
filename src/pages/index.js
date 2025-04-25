import { useState, useEffect } from 'react';
import { Typography, Container, Box } from '@mui/material';
import apiClient from '../utils/apiClient';

export default function Dashboard() {
  const [totalValuation, setTotalValuation] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    fetchPropertiesData();
  }, []);

  const fetchPropertiesData = async () => {
    try {
      const response = await apiClient.get('/api/properties');
      const properties = response.data;

      const totalValuation = properties.reduce((sum, property) => sum + parseFloat(property.valuation || 0), 0);
      const totalProperties = properties.length;

      setTotalValuation(totalValuation);
      setTotalProperties(totalProperties);
    } catch (error) {
      console.error('Erro ao buscar dados dos imóveis:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="h5" component="div">
          Valor de avaliação da carteira: R$ {totalValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Typography>
        <Typography variant="subtitle1" component="div">
          Total de imóveis: {totalProperties}
        </Typography>
      </Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1">
        Bem-vindo ao painel principal! Aqui você pode visualizar informações gerais sobre o sistema.
      </Typography>
    </Container>
  );
}