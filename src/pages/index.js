import { useState, useEffect } from 'react';
import { Typography, Container, Box, Grid } from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import apiClient from '../utils/apiClient';

// Registrar os componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [totalValuation, setTotalValuation] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [valuationData, setValuationData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [categories, setCategories] = useState([]); // Armazena as categorias de despesas

  useEffect(() => {
    fetchPropertiesData();
    fetchExpensesData();
    fetchCategories();
  }, []);

  const fetchPropertiesData = async () => {
    try {
      const response = await apiClient.get('/api/properties');
      const properties = response.data;

      const totalValuation = properties.reduce((sum, property) => sum + parseFloat(property.valuation || 0), 0);
      const totalProperties = properties.length;

      setTotalValuation(totalValuation);
      setTotalProperties(totalProperties);

      // Dados para o gráfico de avaliação
      const valuationData = properties.map((property) => ({
        name: property.name,
        valuation: parseFloat(property.valuation || 0),
      }));
      setValuationData(valuationData);
    } catch (error) {
      console.error('Erro ao buscar dados dos imóveis:', error);
    }
  };

  const fetchExpensesData = async () => {
    try {
      const response = await apiClient.get('/api/transactions');
      const expenses = response.data;

      // Dados para o gráfico de gastos por propriedade
      const expenseData = expenses.reduce((acc, expense) => {
        const propertyId = expense.property_id;
        acc[propertyId] = (acc[propertyId] || 0) + parseFloat(expense.amount || 0);
        return acc;
      }, {});
      setExpenseData(expenseData);

      // Dados para o gráfico de pizza (gastos por categoria)
      const categoryData = expenses.reduce((acc, expense) => {
        const category = expense.category;
        acc[category] = (acc[category] || 0) + parseFloat(expense.amount || 0);
        return acc;
      }, {});
      setCategoryData(categoryData);
    } catch (error) {
      console.error('Erro ao buscar dados de despesas:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/api/expense-types');
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  // Configuração do gráfico de barras (valores de avaliação e gastos por propriedade)
  const barChartData = {
    labels: valuationData.map((data) => data.name),
    datasets: [
      {
        label: 'Valor de Avaliação (R$)',
        data: valuationData.map((data) => data.valuation),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Gastos (R$)',
        data: valuationData.map((data) => expenseData[data.name] || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  // Configuração do gráfico de pizza (gastos por categoria)
  const pieChartData = {
    labels: Object.keys(categoryData).map((categoryId) => {
      const category = categories.find((c) => c.id === categoryId);
      return category ? category.name : 'Desconhecido';
    }),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
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
      <Grid container spacing={2}>
        {/* Gráfico de barras */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Avaliação e Gastos por Propriedade
            </Typography>
            <Bar data={barChartData} />
          </Box>
        </Grid>

        {/* Gráfico de pizza */}
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Gastos por Categoria
            </Typography>
            <Pie data={pieChartData} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}