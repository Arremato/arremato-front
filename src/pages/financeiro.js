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
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import apiClient from '../utils/apiClient';

export default function Financeiro() {
  const [expenses, setExpenses] = useState([]);
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openRows, setOpenRows] = useState({}); // Controle das linhas expandidas

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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financeiro
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 4 }}>
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
    </Container>
  );
}