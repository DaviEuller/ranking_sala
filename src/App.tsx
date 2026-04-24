import Login_Form from './Login/Login_Form.tsx'
import CriarAluno_Form from './CriarAluno/criaraluno.tsx'
import Dashboard_Adm from './DashBoard/Dashboard.tsx'
import CriarEquipe_Form from './Criar_equipe/CriarEquipe_Form.tsx'
import Dashboard_Aluno from './Ranking/Ranking.tsx'
import ProtectedRoute from './Protectedroute.tsx'
import Container from './Container/index.tsx'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function CriarEquipe() {
  return <Container><CriarEquipe_Form /></Container>;
}

function Dashboard() {
  return <Container><Dashboard_Adm /></Container>;
}

function Ranking() {
  return <Container><Dashboard_Aluno /></Container>;
}

function Criar_Aluno() {
  return <Container><CriarAluno_Form /></Container>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login_Form />} />
        <Route path="/aluno/dashboard" element={<Ranking />} />

        {/* Rotas de ADMIN */}
        <Route element={<ProtectedRoute allowedRole="admin" />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/Caluno"          element={<Criar_Aluno />} />
          <Route path="/Cequipe"         element={<CriarEquipe />} />
        </Route>


        {/* Rotas exclusivas de ALUNO */}
        <Route element={<ProtectedRoute allowedRole="user" />}>
          {/* adicione aqui rotas que só aluno acessa */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App