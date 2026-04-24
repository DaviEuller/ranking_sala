// ── ProtectedRoute.tsx ──────────────────────────────────────────
// Guard de rota: barra acesso se o usuário não estiver logado
// ou se o tipo dele não bater com o role exigido pela rota.
//
// Uso no App.tsx / Router:
//
//   <Route element={<ProtectedRoute allowedRole="admin" />}>
//     <Route path="/admin/dashboard" element={<AdminDashboard />} />
//     <Route path="/admin/alunos"    element={<Alunos />} />
//   </Route>
//
//   <Route element={<ProtectedRoute allowedRole="aluno" />}>
//     <Route path="/aluno/dashboard" element={<AlunoDashboard />} />
//     <Route path="/aluno/ranking"   element={<Ranking />} />
//   </Route>

import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  /** Role exigida para acessar as rotas filhas: 'admin' | 'aluno' */
  allowedRole: 'admin' | 'user' 
}

function getUsuarioLogado() {
  try {
    const raw = localStorage.getItem('usuario')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function ProtectedRoute({ allowedRole }: ProtectedRouteProps) {
  const usuario = getUsuarioLogado()

  // Não está logado → volta pro login
  if (!usuario) {
    return <Navigate to="/" replace />
  }

  const tipo = usuario.tipo?.toLowerCase()

  // Tipo não bate com o role da rota → redireciona pro dashboard correto
  if (tipo !== allowedRole) {
    const fallback = tipo === 'admin' ? '/admin/dashboard' : '/aluno/dashboard'
    return <Navigate to={fallback} replace />
  }

  // Tudo certo → renderiza as rotas filhas
  return <Outlet />
}