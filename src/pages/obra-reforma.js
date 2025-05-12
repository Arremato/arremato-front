import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Modal,
    Box,
    Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import apiClient from '../utils/apiClient';

export default function ObraReforma() {
    const [imoveis, setImoveis] = useState([]);
    const [constructions, setConstructions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [newTask, setNewTask] = useState({
        property_id: '',
        budget: 0,
        spent: 0,
        delivery_days: 0,
        responsible_name: '',
        responsible_phone: '',
    });

    // Função para buscar imóveis
    const fetchImoveis = async () => {
        try {
            const response = await apiClient.get('/api/properties');
            setImoveis(response.data);
        } catch (error) {
            console.error('Erro ao buscar imóveis:', error);
        }
    };

    // Função para buscar construções
    const fetchConstructions = async () => {
        try {
            const response = await apiClient.get('/api/constructions');
            setConstructions(response.data);
        } catch (error) {
            console.error('Erro ao buscar construções:', error);
        }
    };

    useEffect(() => {
        fetchImoveis();
        fetchConstructions();
    }, []);

    const handleInputChange = (field, value) => {
        setNewTask((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddConstruction = async () => {
        if (!newTask.name || !newTask.property_id || !newTask.budget || !newTask.delivery_days) {
            alert('Todos os campos obrigatórios devem ser preenchidos!');
            return;
        }

        try {
            if (editMode) {
                await apiClient.put(`/api/constructions/${currentTask.id}`, newTask);
                setConstructions((prev) =>
                    prev.map((construction) =>
                        construction.id === currentTask.id ? { ...construction, ...newTask } : construction
                    )
                );
            } else {
                const response = await apiClient.post('/api/constructions', newTask);
                setConstructions((prev) => [...prev, response.data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Erro ao salvar construção:', error);
        }
    };

    const handleEditConstruction = (construction) => {
        setEditMode(true);
        setCurrentTask(construction);
        setNewTask(construction);
        setModalOpen(true);
    };

    const handleDeleteConstruction = async (id) => {
        try {
            await apiClient.delete(`/api/constructions/${id}`);
            setConstructions((prev) => prev.filter((construction) => construction.id !== id));
        } catch (error) {
            console.error('Erro ao excluir construção:', error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditMode(false);
        setCurrentTask(null);
        setNewTask({
            property_id: '',
            budget: 0,
            spent: 0,
            delivery_days: 0,
            responsible_name: '',
            responsible_phone: '',
        });
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Obra & Reforma
            </Typography>

            {/* Botão para abrir o modal de criação */}
            <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mb: 4 }}>
                Adicionar Obra ou Reforma
            </Button>

            {/* Modal para criação/edição de construções */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        p: 4,
                        maxWidth: 500,
                        mx: 'auto',
                        mt: 10,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {editMode ? 'Editar Obra/Reforma' : 'Adicionar Obra/Reforma'}
                    </Typography>
                    <Grid container spacing={2}>
                        {/* Imóvel */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                label="Imóvel"
                                value={newTask.property_id}
                                onChange={(e) => handleInputChange('property_id', e.target.value)}
                                fullWidth
                            >
                                {imoveis.map((imovel) => (
                                    <MenuItem key={imovel.id} value={imovel.id}>
                                        {imovel.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Orçamento */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Orçamento"
                                type="number"
                                value={newTask.budget}
                                onChange={(e) => handleInputChange('budget', e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Valor Gasto */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Valor Gasto"
                                type="number"
                                value={newTask.spent}
                                onChange={(e) => handleInputChange('spent', e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Dias para Entrega */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Dias para Entrega"
                                type="number"
                                value={newTask.delivery_days}
                                onChange={(e) => handleInputChange('delivery_days', e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Nome do Responsável */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Nome do Responsável"
                                value={newTask.responsible_name}
                                onChange={(e) => handleInputChange('responsible_name', e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Telefone do Responsável */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Telefone do Responsável"
                                value={newTask.responsible_phone}
                                onChange={(e) => handleInputChange('responsible_phone', e.target.value)}
                                fullWidth
                            />
                        </Grid>

                        {/* Botão de Salvar */}
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Button variant="contained" color="primary" onClick={handleAddConstruction}>
                                {editMode ? 'Salvar Alterações' : 'Adicionar'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            {/* Lista de Obras & Reformas */}
            <Typography variant="h6" gutterBottom>
                Lista de Obras & Reformas
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Imóvel</TableCell>
                            <TableCell>Orçamento</TableCell>
                            <TableCell>Valor Gasto</TableCell>
                            <TableCell>Dias para Entrega</TableCell>
                            <TableCell>Responsável</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {constructions.map((construction) => (
                            <TableRow key={construction.id}>
                                {/* Imóvel */}
                                <TableCell>
                                    {imoveis.find((imovel) => imovel.id === construction.property_id)?.name || 'N/A'}
                                </TableCell>

                                {/* Orçamento */}
                                <TableCell>
                                    R$ {parseFloat(construction.budget || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </TableCell>

                                {/* Valor Gasto */}
                                <TableCell>
                                    R$ {parseFloat(construction.spent || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </TableCell>

                                {/* Dias para Entrega */}
                                <TableCell>{construction.delivery_days || 'N/A'}</TableCell>

                                {/* Responsável */}
                                <TableCell>{construction.responsible_name || 'N/A'}</TableCell>

                                {/* Ações */}
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleEditConstruction(construction)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteConstruction(construction.id)}>
                                        <DeleteIcon />
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