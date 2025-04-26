import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Box, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Ícone de menu
import GavelIcon from '@mui/icons-material/Gavel'; // Ícone de martelo
import apiClient from '../utils/apiClient';

export default function PosArrematacao() {
  const [arrematados, setArrematados] = useState([]);

  useEffect(() => {
    fetchImoveis();
  }, []);

  const fetchImoveis = async () => {
    try {
      const response = await apiClient.get('/api/properties'); // Endpoint para buscar os imóveis
      setArrematados(response.data); // Define todos os imóveis como arrematados
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    }
  };

  const renderCard = (imovel) => (
    <Card key={imovel.id} sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }}>
      {/* Progresso Circular */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
        <CircularProgress
          variant="determinate"
          value={imovel.progress || 17}
          size={50}
          thickness={5}
          sx={{ color: imovel.progress === 100 ? 'green' : 'blue' }}
        />
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            fontWeight: 'bold',
            fontSize: '0.8rem',
          }}
        >
          {imovel.progress || 17}%
        </Typography>
      </Box>

      {/* Conteúdo do Card */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <GavelIcon sx={{ mr: 1, color: 'orange' }} />
          {imovel.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {imovel.document_type || 'Documento do imóvel'} | {imovel.owner || 'Proprietário'}
        </Typography>
      </Box>

      {/* Ícone de Ações */}
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    </Card>
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pós Arrematação
      </Typography>

      {/* Lista de Imóveis Arrematados */}
      <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
        Imóveis Arrematados
      </Typography>
      <Grid container spacing={2}>
        {arrematados.map((imovel) => (
          <Grid item xs={12} sm={6} md={4} key={imovel.id}>
            {renderCard(imovel)}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}