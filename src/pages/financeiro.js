import { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../utils/apiClient';

export default function Financeiro() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openRows, setOpenRows] = useState({});
  const [selectedExpense, setSelectedExpense] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const toggleRow = (propertyId) => {
    setOpenRows((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const getExpensesByProperty = (propertyId) => {
    return expenses.filter((expense) => expense.property_id === propertyId);
  };

  const handleEditExpense = (expenseId) => {
    const expense = expenses.find((e) => e.id === expenseId);
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleViewExpense = (expenseId) => {
    const expense = expenses.find((e) => e.id === expenseId);
    setSelectedExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await apiClient.delete(`/api/transactions/${expenseId}`);
      fetchExpenses();
    } catch (error) {
      console.error('Erro ao excluir despesa:', error);
    }
  };

  const handleSaveExpense = async () => {
    try {
      await apiClient.put(`/api/transactions/${selectedExpense.id}`, selectedExpense);
      fetchExpenses();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
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
      setIsAddModalOpen(false); 
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
    } catch (error) {
      console.error('Erro ao cadastrar despesa:', error);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financeiro
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 4 }}
        onClick={() => setIsAddModalOpen(true)}
      >
        Cadastrar Nova Despesa
      </Button>

      {/* Tabela de Imóveis e Despesas */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Imóvel</TableCell>
              <TableCell>Localização</TableCell>
              <TableCell>Valor de Avaliação</TableCell>
              <TableCell>Total de Despesas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {properties.map((property) => {
              const totalExpenses = getExpensesByProperty(property.id).reduce(
                (sum, expense) => sum + parseFloat(expense.amount || 0),
                0
              );

              return (
                <>
                  {/* Linha principal do imóvel */}
                  <TableRow key={property.id}>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(property.id)}
                      >
                        {openRows[property.id] ? (
                          <KeyboardArrowUp />
                        ) : (
                          <KeyboardArrowDown />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{property.name}</TableCell>
                    <TableCell>{property.location || 'N/A'}</TableCell>
                    <TableCell>
                      R$ {parseFloat(property.valuation || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      R$ {totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>

                  {/* Linhas expansíveis com despesas */}
                  <TableRow>
                    <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={openRows[property.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Despesas
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Categoria</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Ações</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {getExpensesByProperty(property.id).map((expense) => (
                                <TableRow key={expense.id}>
                                  <TableCell>{expense.date}</TableCell>
                                  <TableCell>
                                    {categories.find((c) => c.id === expense.category)?.name || 'N/A'}
                                  </TableCell>
                                  <TableCell>{expense.description || 'N/A'}</TableCell>
                                  <TableCell>
                                    R$ {parseFloat(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </TableCell>
                                  <TableCell>
                                    {/* Botões de ação */}
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                      <IconButton
                                        size="small"
                                        sx={{
                                          backgroundColor: '#1976d2',
                                          color: '#fff',
                                          borderRadius: 1,
                                          '&:hover': { backgroundColor: '#1565c0' },
                                        }}
                                        onClick={() => handleEditExpense(expense.id)}
                                      >
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        sx={{
                                          backgroundColor: '#2e7d32',
                                          color: '#fff',
                                          borderRadius: 1,
                                          '&:hover': { backgroundColor: '#1b5e20' },
                                        }}
                                        onClick={() => handleViewExpense(expense.id)}
                                      >
                                        <VisibilityIcon />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        sx={{
                                          backgroundColor: '#d32f2f',
                                          color: '#fff',
                                          borderRadius: 1,
                                          '&:hover': { backgroundColor: '#c62828' },
                                        }}
                                        onClick={() => handleDeleteExpense(expense.id)}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Editar Despesa</DialogTitle>
        <DialogContent>
          <TextField
            label="Data"
            type="date"
            fullWidth
            margin="normal"
            value={selectedExpense?.date || ''}
            onChange={(e) => setSelectedExpense({ ...selectedExpense, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Valor"
            type="number"
            fullWidth
            margin="normal"
            value={selectedExpense?.amount || ''}
            onChange={(e) => setSelectedExpense({ ...selectedExpense, amount: e.target.value })}
          />
          <TextField
            select
            label="Categoria"
            fullWidth
            margin="normal"
            value={selectedExpense?.category || ''}
            onChange={(e) => setSelectedExpense({ ...selectedExpense, category: e.target.value })}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            value={selectedExpense?.description || ''}
            onChange={(e) => setSelectedExpense({ ...selectedExpense, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSaveExpense} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Visualização */}
      <Dialog open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Visualizar Despesa</DialogTitle>
        <DialogContent>
          <Typography>Data: {selectedExpense?.date || 'N/A'}</Typography>
          <Typography>Valor: R$ {parseFloat(selectedExpense?.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</Typography>
          <Typography>Categoria: {categories.find((c) => c.id === selectedExpense?.category)?.name || 'N/A'}</Typography>
          <Typography>Descrição: {selectedExpense?.description || 'N/A'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewModalOpen(false)} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Cadastro */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Cadastrar Nova Despesa</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Imóvel"
            fullWidth
            margin="normal"
            value={newExpense.property_id}
            onChange={(e) => setNewExpense({ ...newExpense, property_id: e.target.value })}
          >
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Data"
            type="date"
            fullWidth
            margin="normal"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Valor"
            type="number"
            fullWidth
            margin="normal"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          />
          <TextField
            select
            label="Categoria"
            fullWidth
            margin="normal"
            value={newExpense.category}
            onChange={(e) => {
              const selectedCategory = categories.find((category) => category.id === e.target.value);
              setNewExpense({
                ...newExpense,
                category: e.target.value,
                description: selectedCategory ? selectedCategory.description : '', // Atualiza a descrição automaticamente
              });
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            value={newExpense.description}
            InputProps={{
              readOnly: true, // Torna o campo de descrição somente leitura
            }}
          />
          <TextField
            label="Recibo"
            type="text"
            fullWidth
            margin="normal"
            value={newExpense.receipt}
            onChange={(e) => setNewExpense({ ...newExpense, receipt: e.target.value })}
          />
          <TextField
            select
            label="Tipo de Pagamento"
            fullWidth
            margin="normal"
            value={newExpense.type}
            onChange={(e) => setNewExpense({ ...newExpense, funding_source: e.target.value })}
          >
            <MenuItem value="tipo 1">Tipo 1</MenuItem>
            <MenuItem value="tipo 2">Tipo 2</MenuItem>
            <MenuItem value="tipo 3">Tipo 3</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddModalOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddExpense} color="primary">
            Cadastrar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}