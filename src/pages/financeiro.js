import { useState, useEffect } from 'react';
import {
  Typography,
  Container,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import apiClient from '../utils/apiClient';

export default function Financeiro() {
  const [transactions, setTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    id: null,
    property_id: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0], // Data atual no formato 'YYYY-MM-DD'
    amount: 0,
    status: 'pending',
    payment_method: 'cash',
    total_installments: 1,
    current_installment: 1,
    installment_value: '',
    description: '',
  });
  const [editMode, setEditMode] = useState(false); // Define se estamos editando ou criando

  const fetchTransactions = async () => {
    try {
      const response = await apiClient.get('/api/finances');
      setTransactions(response.data);
    } catch (error) {
      console.error('Erro ao buscar transações financeiras:', error);
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
      const response = await apiClient.get('/api/categories'); // Atualizado para o endpoint correto
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setNewTransaction((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTransaction = async () => {
    try {
      const transactionData = { ...newTransaction };

      // Garantir que a data seja a atual se não for escolhida
      if (!transactionData.date) {
        transactionData.date = new Date().toISOString().split('T')[0];
      }

      if (editMode) {
        // Atualizar transação existente (remover o ID do corpo)
        const { id, ...dataWithoutId } = transactionData;
        await apiClient.put(`/api/finances/${id}`, dataWithoutId);
      } else {
        // Criar nova transação
        if (transactionData.payment_method === 'installment') {
          await apiClient.post('/api/finances/installments', transactionData);
        } else {
          await apiClient.post('/api/finances', transactionData);
        }
      }

      fetchTransactions();
      setIsAddModalOpen(false);
      resetTransactionForm();
      setEditMode(false); // Reseta o modo de edição
    } catch (error) {
      console.error('Erro ao salvar transação financeira:', error);
    }
  };

  const handleEditTransaction = (transaction) => {
    setNewTransaction({
      id: transaction.id || null,
      property_id: transaction.property_id || '',
      type: transaction.type || 'expense',
      category_id: transaction.category_id || '',
      date: transaction.date || new Date().toISOString().split('T')[0],
      amount: transaction.amount || 0,
      status: transaction.status || 'pending',
      payment_method: transaction.payment_method || 'cash',
      total_installments: transaction.total_installments || 1,
      current_installment: transaction.current_installment || 1,
      installment_value: transaction.installment_value || '',
      description: transaction.description || '',
    });
    setEditMode(true); // Ativa o modo de edição
    setIsAddModalOpen(true); // Abre o modal
  };

  const resetTransactionForm = () => {
    setNewTransaction({
      property_id: '',
      type: 'expense',
      category_id: '',
      date: '',
      amount: 0,
      status: 'pending',
      payment_method: 'cash',
      total_installments: 1,
      current_installment: 1,
      installment_value: '', // Resetar o valor da parcela
      description: '',
    });
  };

  useEffect(() => {
    fetchTransactions();
    fetchProperties();
    fetchCategories(); // Chama a função para buscar as categorias
  }, []);

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
        Cadastrar Nova Transação
      </Button>

      {/* Total Receitas, Despesas, Saldo e Total Parcelado */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        {/* Total Receitas */}
        <Box
          sx={{
            backgroundColor: '#e8f5e9',
            padding: 2,
            borderRadius: 2,
            textAlign: 'center',
            flex: 1,
            marginRight: 2,
          }}
        >
          <Typography variant="subtitle1" color="green" fontWeight="bold">
            Total Receitas
          </Typography>
          <Typography variant="h6" color="green" fontWeight="bold">
            +R$ {transactions
              .filter((transaction) => transaction.type === 'income')
              .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
              .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>

        {/* Total Despesas */}
        <Box
          sx={{
            backgroundColor: '#ffebee',
            padding: 2,
            borderRadius: 2,
            textAlign: 'center',
            flex: 1,
            marginRight: 2,
          }}
        >
          <Typography variant="subtitle1" color="red" fontWeight="bold">
            Total Despesas
          </Typography>
          <Typography variant="h6" color="red" fontWeight="bold">
            -R$ {transactions
              .filter((transaction) => transaction.type === 'expense')
              .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
              .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>

        {/* Saldo */}
        <Box
          sx={{
            backgroundColor: '#f3e5f5',
            padding: 2,
            borderRadius: 2,
            textAlign: 'center',
            flex: 1,
            marginRight: 2,
          }}
        >
          <Typography variant="subtitle1" color="black" fontWeight="bold">
            Saldo
          </Typography>
          <Typography variant="h6" color="black" fontWeight="bold">
            R$ {(
              transactions
                .filter((transaction) => transaction.type === 'income')
                .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0) -
              transactions
                .filter((transaction) => transaction.type === 'expense')
                .reduce((sum, transaction) => sum + parseFloat(transaction.amount || 0), 0)
            ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>

        {/* Total Parcelado */}
        <Box
          sx={{
            backgroundColor: '#e3f2fd',
            padding: 2,
            borderRadius: 2,
            textAlign: 'center',
            flex: 1,
          }}
        >
          <Typography variant="subtitle1" color="blue" fontWeight="bold">
            Total Parcelado
          </Typography>
          <Typography variant="h6" color="blue" fontWeight="bold">
            R$ {transactions
              .filter((transaction) => transaction.payment_method === 'installment')
              .reduce((sum, transaction) => sum + parseFloat(transaction.installment_value || 0), 0)
              .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      </Box>

      {/* Modal de Cadastro */}
      <Dialog open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Editar Transação" : "Cadastrar Nova Transação"}</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Imóvel"
            fullWidth
            margin="normal"
            value={newTransaction.property_id}
            onChange={(e) => handleInputChange('property_id', e.target.value)}
          >
            <MenuItem value="">Nenhum</MenuItem>
            {properties.map((property) => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Tipo"
            fullWidth
            margin="normal"
            value={newTransaction.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
          >
            <MenuItem value="expense">Despesa</MenuItem>
            <MenuItem value="income">Receita</MenuItem>
          </TextField>
          <TextField
            select
            label="Categoria"
            fullWidth
            margin="normal"
            value={newTransaction.category_id}
            onChange={(e) => handleInputChange('category_id', e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Data"
            type="date"
            fullWidth
            margin="normal"
            value={newTransaction.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Valor"
            type="number"
            fullWidth
            margin="normal"
            value={newTransaction.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
          />
          <TextField
            select
            label="Status"
            fullWidth
            margin="normal"
            value={newTransaction.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <MenuItem value="paid">Pago</MenuItem>
            <MenuItem value="pending">Pendente</MenuItem>
          </TextField>
          <TextField
            select
            label="Método de Pagamento"
            fullWidth
            margin="normal"
            value={newTransaction.payment_method}
            onChange={(e) => handleInputChange('payment_method', e.target.value)}
          >
            <MenuItem value="cash">À Vista</MenuItem>
            <MenuItem value="financed">Financiado</MenuItem>
            <MenuItem value="installment">Parcelado</MenuItem>
          </TextField>

          {/* Campos adicionais para Financiado e Parcelado */}
          {(newTransaction.payment_method === 'installment' || newTransaction.payment_method === 'financed') && (
            <>
              <TextField
                label="Total de Parcelas"
                type="number"
                fullWidth
                margin="normal"
                value={newTransaction.total_installments}
                onChange={(e) => handleInputChange('total_installments', e.target.value)}
              />
              <TextField
                label="Parcela Atual"
                type="number"
                fullWidth
                margin="normal"
                value={newTransaction.current_installment}
                onChange={(e) => handleInputChange('current_installment', e.target.value)}
              />
              <TextField
                label="Valor da Parcela"
                type="number"
                fullWidth
                margin="normal"
                value={newTransaction.installment_value}
                onChange={(e) => handleInputChange('installment_value', e.target.value)}
              />
            </>
          )}
          <TextField
            label="Descrição"
            fullWidth
            margin="normal"
            value={newTransaction.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddModalOpen(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleAddTransaction} color="primary">
            {editMode ? 'Salvar Alterações' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tabela de Transações */}
      <Typography variant="h6" gutterBottom>
        Lista de Transações
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vencimento</TableCell>
              <TableCell>Imóvel</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Método de Pagamento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  {properties.find((property) => property.id === transaction.property_id)?.name || 'Nenhum'}
                </TableCell>
                <TableCell>
                  {transaction.type === 'expense' ? (
                    <Chip label="Despesa" color="error" />
                  ) : (
                    <Chip label="Receita" color="success" />
                  )}
                </TableCell>
                <TableCell>
                  {categories.find((category) => category.id === transaction.category_id)?.name || 'N/A'}
                </TableCell>
                <TableCell>
                  R$ {parseFloat(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  {transaction.status === 'paid' ? (
                    <Chip label="Pago" color="success" />
                  ) : (
                    <Chip label="Pendente" color="error" />
                  )}
                </TableCell>
                <TableCell>
                  {transaction.payment_method === 'cash'
                    ? 'À Vista'
                    : transaction.payment_method === 'financed'
                      ? 'Financiado'
                      : 'Parcelado'}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditTransaction(transaction)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}