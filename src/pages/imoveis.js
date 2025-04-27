import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Tabs,
  Tab,
  Box,
  Grid,
  TextField,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import apiClient from '../utils/apiClient';

export default function Imoveis() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    step1: {
      nome: '',
      cep: '',
      endereco: '',
      numero: '',
      tipoImovel: '',
      estado: '',
      finalidade: ''
    },
    step2: {
      valorLance: '',
      valorMercado: '',
      itbi: '',
      registro: '',
    },
    step3: {
      arrematadoSozinho: '',
      nomeInvestidor: '',
      valorInvestido: '',
    },
    step4: {
      condominioMensal: '',
      iptuAnual: '',
      dividaCondominio: '',
      dividaIptu: '',
      outrasDividas: '',
    },
    step5: {
      corretor: '',
      comissaoCorretor: '',
      previsaoMesesVenda: '',
      previsaoReforma: '',
      tipoTributacao: '',
    },
    step6: {
      resumoFinal: '',
    },
  });
  const [errors, setErrors] = useState({}); // Armazena os erros de validação
  const [imoveis, setImoveis] = useState([]); // Lista de imóveis cadastrados
  const [isModalOpen, setIsModalOpen] = useState(false); // Controle do modal

  const steps = [
    'Dados do Imóvel',
    'Dados da Compra',
    'Área de Investidores',
    'Custos',
    'Venda e Previsão de ROI',
    'Resumo Final',
  ];

  const handleInputChange = (step, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
      setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCepChange = async (cep) => {
    handleInputChange('step1', 'cep', cep);
  
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
  
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            step1: {
              ...prev.step1,
              endereco: data.logradouro || '',
              bairro: data.bairro || '',
              estado: data.uf || '',
            },
          }));
        } else {
          console.error('CEP inválido ou não encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar o endereço:', error);
      }
    }
  };

  const handleSubmit = async () => {
    console.log('Dados do formulário:', formData);
      const payload = {
        name: formData.step1.nome,
        postal_code: formData.step1.cep,
        address: formData.step1.endereco,
        number: formData.step1.numero,
        property_type: formData.step1.tipoImovel,
        state: formData.step1.estado,
        bid_value: parseFloat(formData.step2.valorLance) || 0,
        market_value: parseFloat(formData.step2.valorMercado) || 0,
        itbi: parseFloat(formData.step2.itbi) || 0,
        registration: parseFloat(formData.step2.registro) || 0,
        purchased_alone: formData.step3.arrematadoSozinho === 'Sim',
        investor_name: formData.step3.nomeInvestidor || null,
        invested_amount: parseFloat(formData.step3.valorInvestido) || 0,
        monthly_condo_fee: parseFloat(formData.step4.condominioMensal) || 0,
        annual_iptu: parseFloat(formData.step4.iptuAnual) || 0,
        condo_debt: parseFloat(formData.step4.dividaCondominio) || 0,
        iptu_debt: parseFloat(formData.step4.dividaIptu) || 0,
        other_debts: parseFloat(formData.step4.outrasDividas) || 0,
        broker_name: formData.step5.corretor || null,
        broker_commission: parseFloat(formData.step5.comissaoCorretor) || 0,
        expected_months_to_sell: parseFloat(formData.step5.previsaoMesesVenda) || 0,
        expected_renovation_cost: parseFloat(formData.step5.previsaoReforma) || 0,
        taxation_type: formData.step5.tipoTributacao,
        acquisition_date: new Date().toISOString(),
        purpose: formData.step1.finalidade,
      };

      console.log('Payload enviado:', payload);

      try {
        const response = await apiClient.post('/api/properties', payload);

        if (!response.message) {
          const errorData = await response.json();
          console.error('Erro ao cadastrar imóvel:', errorData.error);
          return;
        }

        setImoveis((prev) => [...prev, response.property]);

        // Fecha o modal e reseta o formulário
        setIsModalOpen(false);
        setFormData({
          step1: {
            nome: '',
            cep: '',
            endereco: '',
            numero: '',
            tipoImovel: '',
            estado: '',
            finalidade: '',
          },
          step2: {
            valorLance: '',
            valorMercado: '',
            itbi: '',
            registro: '',
          },
          step3: {
            arrematadoSozinho: '',
            nomeInvestidor: '',
            valorInvestido: '',
          },
          step4: {
            condominioMensal: '',
            iptuAnual: '',
            dividaCondominio: '',
            dividaIptu: '',
            outrasDividas: '',
          },
          step5: {
            corretor: '',
            comissaoCorretor: '',
            previsaoMesesVenda: '',
            previsaoReforma: '',
            tipoTributacao: '',
          },
          step6: {
            resumoFinal: '',
          },
        });
        setActiveStep(0); // Volta para o primeiro step
      } catch (error) {
        console.error('Erro no servidor:', error);
      }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await apiClient.get('/api/properties');
      setImoveis(response.data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    } 
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nome do Imóvel"
                value={formData.step1.nome}
                onChange={(e) => handleInputChange('step1', 'nome', e.target.value)}
                fullWidth
                error={!!errors.step1?.nome}
                helperText={errors.step1?.nome}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="CEP"
                value={formData.step1.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                fullWidth
                error={!!errors.step1?.cep}
                helperText={errors.step1?.cep}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Endereço"
                value={formData.step1.endereco}
                onChange={(e) => handleInputChange('step1', 'endereco', e.target.value)}
                fullWidth
                error={!!errors.step1?.endereco}
                helperText={errors.step1?.endereco}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Número"
                value={formData.step1.numero}
                onChange={(e) => handleInputChange('step1', 'numero', e.target.value)}
                fullWidth
                error={!!errors.step1?.numero}
                helperText={errors.step1?.numero}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Bairro"
                value={formData.step1.bairro}
                onChange={(e) => handleInputChange('step1', 'bairro', e.target.value)}
                fullWidth
                error={!!errors.step1?.bairro}
                helperText={errors.step1?.bairro}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Tipo de Imóvel"
                value={formData.step1.tipoImovel}
                onChange={(e) => handleInputChange('step1', 'tipoImovel', e.target.value)}
                fullWidth
                error={!!errors.step1?.tipoImovel}
                helperText={errors.step1?.tipoImovel}
              >
                <MenuItem value="Casa">Casa</MenuItem>
                <MenuItem value="Apartamento">Apartamento</MenuItem>
                <MenuItem value="Terreno">Terreno</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Estado"
                value={formData.step1.estado}
                onChange={(e) => handleInputChange('step1', 'estado', e.target.value)}
                fullWidth
                error={!!errors.step1?.estado}
                helperText={errors.step1?.estado}
              >
                <MenuItem value="AC">AC</MenuItem>
                <MenuItem value="AL">AL</MenuItem>
                <MenuItem value="AP">AP</MenuItem>
                <MenuItem value="AM">AM</MenuItem>
                <MenuItem value="BA">BA</MenuItem>
                <MenuItem value="CE">CE</MenuItem>
                <MenuItem value="DF">DF</MenuItem>
                <MenuItem value="ES">ES</MenuItem>
                <MenuItem value="GO">GO</MenuItem>
                <MenuItem value="MA">MA</MenuItem>
                <MenuItem value="MT">MT</MenuItem>
                <MenuItem value="MS">MS</MenuItem>
                <MenuItem value="MG">MG</MenuItem>
                <MenuItem value="PA">PA</MenuItem>
                <MenuItem value="PB">PB</MenuItem>
                <MenuItem value="PR">PR</MenuItem>
                <MenuItem value="PE">PE</MenuItem>
                <MenuItem value="PI">PI</MenuItem>
                <MenuItem value="RJ">RJ</MenuItem>
                <MenuItem value="RN">RN</MenuItem>
                <MenuItem value="RS">RS</MenuItem>
                <MenuItem value="RO">RO</MenuItem>
                <MenuItem value="RR">RR</MenuItem>
                <MenuItem value="SC">SC</MenuItem>
                <MenuItem value="SP">SP</MenuItem>
                <MenuItem value="SE">SE</MenuItem>
                <MenuItem value="TO">TO</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Finalidade"
                value={formData.step1.purpose}
                onChange={(e) => handleInputChange('step1', 'finalidade', e.target.value)}
                fullWidth
                error={!!errors.step1?.purpose}
                helperText={errors.step1?.purpose}
              >
                <MenuItem value="sale">Venda</MenuItem>
                <MenuItem value="rental">Aluguel</MenuItem>
                <MenuItem value="residence">Moradia</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Valor do Lance"
                type="number"
                value={formData.step2.valorLance}
                onChange={(e) => handleInputChange('step2', 'valorLance', e.target.value)}
                fullWidth
                error={!!errors.step2?.valorLance}
                helperText={errors.step2?.valorLance}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Valor de Mercado"
                type="number"
                value={formData.step2.valorMercado}
                onChange={(e) => handleInputChange('step2', 'valorMercado', e.target.value)}
                fullWidth
                error={!!errors.step2?.valorMercado}
                helperText={errors.step2?.valorMercado}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Arrematado Sozinho?"
                value={formData.step3.arrematadoSozinho}
                onChange={(e) => handleInputChange('step3', 'arrematadoSozinho', e.target.value)}
                fullWidth
                error={!!errors.step3?.arrematadoSozinho}
                helperText={errors.step3?.arrematadoSozinho}
              >
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Nome do Investidor"
                value={formData.step3.nomeInvestidor}
                onChange={(e) => handleInputChange('step3', 'nomeInvestidor', e.target.value)}
                fullWidth
                error={!!errors.step3?.nomeInvestidor}
                helperText={errors.step3?.nomeInvestidor}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Condomínio Mensal"
                type="number"
                value={formData.step4.condominioMensal}
                onChange={(e) => handleInputChange('step4', 'condominioMensal', e.target.value)}
                fullWidth
                error={!!errors.step4?.condominioMensal}
                helperText={errors.step4?.condominioMensal}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="IPTU Anual"
                type="number"
                value={formData.step4.iptuAnual}
                onChange={(e) => handleInputChange('step4', 'iptuAnual', e.target.value)}
                fullWidth
                error={!!errors.step4?.iptuAnual}
                helperText={errors.step4?.iptuAnual}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Dívida Condomínio"
                type="number"
                value={formData.step4.dividaCondominio}
                onChange={(e) => handleInputChange('step4', 'dividaCondominio', e.target.value)}
                fullWidth
                error={!!errors.step4?.dividaCondominio}
                helperText={errors.step4?.dividaCondominio}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Dívida IPTU"
                type="number"
                value={formData.step4.dividaIptu}
                onChange={(e) => handleInputChange('step4', 'dividaIptu', e.target.value)}
                fullWidth
                error={!!errors.step4?.dividaIptu}
                helperText={errors.step4?.dividaIptu}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Outras Dívidas"
                type="number"
                value={formData.step4.outrasDividas}
                onChange={(e) => handleInputChange('step4', 'outrasDividas', e.target.value)}
                fullWidth
                error={!!errors.step4?.outrasDividas}
                helperText={errors.step4?.outrasDividas}
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Terá Corretor?"
                value={formData.step5.corretor}
                onChange={(e) => handleInputChange('step5', 'corretor', e.target.value)}
                fullWidth
                error={!!errors.step5?.corretor}
                helperText={errors.step5?.corretor}
              >
                <MenuItem value="Sim">Sim</MenuItem>
                <MenuItem value="Não">Não</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="% Comissão"
                type="number"
                value={formData.step5.comissaoCorretor}
                onChange={(e) => handleInputChange('step5', 'comissaoCorretor', e.target.value)}
                fullWidth
                error={!!errors.step5?.comissaoCorretor}
                helperText={errors.step5?.comissaoCorretor}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Meses até Venda"
                type="number"
                value={formData.step5.previsaoMesesVenda}
                onChange={(e) => handleInputChange('step5', 'previsaoMesesVenda', e.target.value)}
                fullWidth
                error={!!errors.step5?.previsaoMesesVenda}
                helperText={errors.step5?.previsaoMesesVenda}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                label="Custo Reforma"
                type="number"
                value={formData.step5.previsaoReforma}
                onChange={(e) => handleInputChange('step5', 'previsaoReforma', e.target.value)}
                fullWidth
                error={!!errors.step5?.previsaoReforma}
                helperText={errors.step5?.previsaoReforma}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Tipo de Tributação"
                value={formData.step5.tipoTributacao}
                onChange={(e) => handleInputChange('step5', 'tipoTributacao', e.target.value)}
                fullWidth
                error={!!errors.step5?.tipoTributacao}
                helperText={errors.step5?.tipoTributacao}
              >
                <MenuItem value="CPF">CPF (15% lucro)</MenuItem>
                <MenuItem value="CNPJ">CNPJ (6% venda)</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 5:
        const valorLance = parseFloat(formData.step2.valorLance) || 0;
        const valorMercado = parseFloat(formData.step2.valorMercado) || 0;
        const previsaoReforma = parseFloat(formData.step5.previsaoReforma) || 0;
        const tipoTributacao = formData.step5.tipoTributacao;
        const comissaoCorretor = parseFloat(formData.step5.comissaoCorretor) || 0;

        let imposto = 0, lucro = 0;

        if (tipoTributacao === 'CPF') {
          lucro = valorMercado - (valorLance + previsaoReforma);
          imposto = lucro * 0.15;
        } else if (tipoTributacao === 'CNPJ') {
          imposto = valorMercado * 0.06;
          lucro = valorMercado - (valorLance + previsaoReforma + imposto);
        }

        const comissao = (comissaoCorretor / 100) * valorMercado;
        const lucroLiquido = lucro - comissao;
        const roi = ((lucroLiquido / (valorLance + previsaoReforma)) * 100).toFixed(2);

        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Resumo Final
            </Typography>
            <Typography>
              <strong>Imposto Estimado:</strong> R$ {imposto.toLocaleString('pt-BR')}<br />
              <strong>Lucro Líquido:</strong> R$ {lucroLiquido.toLocaleString('pt-BR')}<br />
              <strong>ROI:</strong> {roi}%
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Imóveis Cadastrados
      </Typography>
      <Button variant="contained" onClick={() => setIsModalOpen(true)} sx={{ mb: 4 }}>
        Cadastrar Novo Imóvel
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CEP</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Valor do Lance</TableCell>
              <TableCell>Valor de Mercado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {imoveis.map((imovel, index) => (
              <TableRow key={index}>
                <TableCell>{imovel.name}</TableCell>
                <TableCell>{imovel.postal_code}</TableCell>
                <TableCell>{imovel.address}</TableCell>
                <TableCell>{imovel.bid_value}</TableCell>
                <TableCell>{imovel.market_value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Cadastro */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={{ p: 2, maxWidth: 900, mx: 'auto', mt: 15, bgcolor: 'background.paper', borderRadius: 2, overflowY: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            Cadastro de Imóvel
          </Typography>
          <Tabs value={activeStep} variant="fullWidth">
            {steps.map((label, index) => (
              <Tab key={index} label={label} disabled={activeStep !== index} />
            ))}
          </Tabs>
          <Box sx={{ mt: 4 }}>{renderStepContent(activeStep)}</Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            {activeStep > 0 && (
              <Button variant="contained" onClick={handleBack}>
                Voltar
              </Button>
            )}
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Avançar
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Finalizar
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}