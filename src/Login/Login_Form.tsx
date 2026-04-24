// ── Login_Form.tsx ──────────────────────────────────────────────
import { useState } from 'react'
import { loginUsuario } from '../api/usuario.js'
import style from './style.module.css'
import { useNavigate } from 'react-router-dom'

function Login_Form() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleLogin() {
    setErro('')
    setCarregando(true)

    try {
      const data = await loginUsuario(email, senha)

      // ── Salva no localStorage ──────────────────────────────────
      // token  → usado nos headers das próximas requisições
      // usuario → id, nome, email, tipo — usado pelo NavBar e guards
      localStorage.setItem('token',   data.token)
      localStorage.setItem('usuario', JSON.stringify(data.usuario))

      // ── Redireciona pelo tipo da conta ─────────────────────────
      const tipo = data.usuario?.tipo?.toLowerCase()

      if (tipo === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/aluno/dashboard')
      }

    } catch (err: any) {
      setErro(err.response?.data?.msg || 'Erro ao fazer login.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={style.page_wrapper}>
      <div className={style.bg_grid} />
      <div className={style.bg_glow} />

      <div className={style.Form_Login}>
        <div className={style.card_header}>
          <h1 className={style.title}>RANKING SALA</h1>
          <div className={style.header_line} />
          <p className={style.subtitle}>Acesse sua conta</p>
        </div>

        <div className={style.fields_wrapper}>
          <div className={style.inp_div_form}>
            <input
              className={style.input_form}
              type="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={style.inp_div_form}>
            <input
              className={style.input_form}
              type="password"
              placeholder="Senha..."
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <p className={style.erro}>{erro}</p>}

          <div className={style.forgot_link_wrapper}>
            <a className={style.forgot_link} href="#">Esqueceu a senha?</a>
          </div>
        </div>

        <div className={style.btn_div_form}>
          <button
            className={style.btn_form_c}
            onClick={handleLogin}
            disabled={carregando}
          >
            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </div>

        <div className={style.corner_tl} />
        <div className={style.corner_br} />
      </div>
    </div>
  )
}

export default Login_Form