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

export default function Tarefas() {
    const [tasks, setTasks] = useState([]);
    const [imoveis, setImoveis] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [newTask, setNewTask] = useState({
        property_id: '',
        name: '',
        status: 'pending',
        priority: 'low', // Valor padrão
    });

    // Função para buscar tarefas e imóveis
    const fetchTasksAndImoveis = async () => {
        try {
            const [tasksResponse, imoveisResponse] = await Promise.all([
                apiClient.get('/api/tasks'),
                apiClient.get('/api/properties'),
            ]);
            setTasks(tasksResponse.data);
            setImoveis(imoveisResponse.data);
        } catch (error) {
            console.error('Erro ao buscar tarefas ou imóveis:', error);
        }
    };

    useEffect(() => {
        fetchTasksAndImoveis();
    }, []);

    const handleInputChange = (field, value) => {
        setNewTask((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAddTask = async () => {
        if (!newTask.name || !newTask.property_id || !newTask.priority) {
            alert('Nome, imóvel e prioridade são obrigatórios!');
            return;
        }

        try {
            if (editMode) {
                await apiClient.patch(`/api/tasks/${currentTask.id}`, newTask);
                setTasks((prev) =>
                    prev.map((task) =>
                        task.id === currentTask.id ? { ...task, ...newTask } : task
                    )
                );
            } else {
                console.log('Adicionando nova tarefa:', newTask);
                const response = await apiClient.post('/api/tasks', newTask);
                setTasks((prev) => [...prev, response.data.task]);
            }
            handleCloseModal();
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
        }
    };

    const handleEditTask = (task) => {
        setEditMode(true);
        setCurrentTask(task);
        setNewTask(task);
        setModalOpen(true);
    };

    const handleDeleteTask = async (id) => {
        try {
            await apiClient.delete(`/api/tasks/${id}`);
            setTasks((prev) => prev.filter((task) => task.id !== id));
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditMode(false);
        setCurrentTask(null);
        setNewTask({ property_id: '', name: '', status: 'pending', priority: 'low' });
    };

    const translateStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Não iniciada';
            case 'in progress':
                return 'Em andamento';
            case 'concluded':
                return 'Conluída';
            default:
                return 'N/A';
        }
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Gerenciamento de Tarefas
            </Typography>

            {/* Botão para abrir o modal de criação */}
            <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mb: 4 }}>
                Adicionar Tarefa
            </Button>

            {/* Modal para criação/edição de tarefas */}
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
                        {editMode ? 'Editar Tarefa' : 'Adicionar Tarefa'}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Tarefa"
                                value={newTask.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                fullWidth
                            />
                        </Grid>
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
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                label="Prioridade"
                                value={newTask.priority}
                                onChange={(e) => handleInputChange('priority', e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="low">Baixa</MenuItem>
                                <MenuItem value="medium">Média</MenuItem>
                                <MenuItem value="high">Alta</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                label="Status"
                                value={newTask.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="pending">Pendente</MenuItem>
                                <MenuItem value="in progress">Em Progresso</MenuItem>
                                <MenuItem value="completed">Concluída</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <Button variant="contained" color="primary" onClick={handleAddTask}>
                                {editMode ? 'Salvar Alterações' : 'Adicionar Tarefa'}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            {/* Lista de Tarefas */}
            <Typography variant="h6" gutterBottom>
                Lista de Tarefas
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tarefa</TableCell>
                            <TableCell>Prioridade</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Imóvel</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.name}</TableCell>
                                <TableCell>
                                    {task.priority === 'high' ? (
                                        <Chip label="Alta" color="warning" />
                                    ) : task.priority === 'medium' ? (
                                        <Chip label="Média" color="info" />
                                    ) : (
                                        <Chip label="Baixa" color="success" />
                                    )}
                                </TableCell>
                                <TableCell>{translateStatus(task.status)}</TableCell>
                                <TableCell>
                                    {imoveis.find((imovel) => imovel.id === task.property_id)?.name || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <IconButton color="primary" onClick={() => handleEditTask(task)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
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