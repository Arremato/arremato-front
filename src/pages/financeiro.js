import { useState, useEffect } from 'react';
import { Typography, Container, Button, Grid, Card, CardContent, CardActions, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import apiClient from '../utils/apiClient';

export default function Financeiro() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExpense, setNewExpense] = useState({
    property_id: '',
    type: 'expense',
    date: '',
    amount: '',
    category: '',
    description: '',
    receipt: '',
    funding_source: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchProperties();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get('/api/transactions');
      setExpenses(response.data);
    } catch (error) {
      console.error('Erro ao buscar despesas:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await apiClient.get('/api/properties');
      setProperties(response.data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      const selectedCategory = categories.find((category) => category.id === value);
      setNewExpense({
        ...newExpense,
        [name]: value,
        description: selectedCategory ? selectedCategory.description : '',
      });
    } else {
      setNewExpense({ ...newExpense, [name]: value });
    }
  };

  const handleAddExpense = async () => {
    try {
      const expenseData = {
        ...newExpense,
        date: newExpense.date || new Date().toISOString().split('T')[0],
      };

      await apiClient.post('/api/transactions', expenseData);
      fetchExpenses();
      setNewExpense({
        property_id: '',
        type: 'expense',
        date: '',
        amount: '',
        category: '',
        description: '',
        receipt: '',
        funding_source: '',
      });
      setOpenModal(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Erro ao cadastrar despesa');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financeiro
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenModal(true)} sx={{ mb: 4 }}>
        Cadastrar Nova Despesa
      </Button>

      {/* Modal de Cadastro */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth >
        <DialogTitle>Cadastrar Nova Despesa</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Imóvel"
                name="property_id"
                value={newExpense.property_id}
                onChange={handleInputChange}
                fullWidth
              >
                {properties.map((property) => (
                  <MenuItem key={property.id} value={property.id}>
                    {property.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Data"
                name="date"
                type="date"
                value={newExpense.date}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Valor (R$)"
                name="amount"
                type="number"
                value={newExpense.amount}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Categoria"
                name="category"
                value={newExpense.category}
                onChange={handleInputChange}
                fullWidth
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Descrição"
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Recibo"
                name="receipt"
                value={newExpense.receipt}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Fonte de Financiamento"
                name="funding_source"
                value={newExpense.funding_source}
                onChange={handleInputChange}
                fullWidth
              />
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
          <Button onClick={handleAddExpense} color="primary">
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lista de Despesas */}
      <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>
        Lista de Despesas
      </Typography>
      <Grid container spacing={2}>
        {expenses
          .slice()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((expense) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={expense.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    Imóvel: {properties.find((p) => p.id === expense.property_id)?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Data: {expense.date}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Valor: R$ {parseFloat(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Categoria: {categories.find((c) => c.id === expense.category)?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Descrição: {categories.find((c) => c.id === expense.category)?.description || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Recibo: {expense.receipt || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fonte de Financiamento: {expense.funding_source || 'N/A'}
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