import { useState } from 'react'
import style from './style.module.css'
import NavBar from '../NavBar/NavBar.tsx'
import { criarUsuario } from '../api/usuario.js'

function CriarAluno() {
  const [nome,               setNome]               = useState('')
  const [email,              setEmail]              = useState('')
  const [senha,              setSenha]              = useState('')
  const [numeroChamada,      setNumeroChamada]      = useState('')
  const [idade,              setIdade]              = useState('')
  const [empresa,            setEmpresa]            = useState('')
  const [numeroVerificacao,  setNumeroVerificacao]  = useState('')
  const [tipo,               setTipo]               = useState('user')
  const [equipeId,           setEquipeId]           = useState('')
  const [erro,               setErro]               = useState('')
  const [carregando,         setCarregando]         = useState(false)

  async function handleCriar() {
    setErro('')

    if (!nome || !email || !senha) {
      setErro('Nome, email e senha são obrigatórios.')
      return
    }

    setCarregando(true)

    try {
      await criarUsuario({
        nome,
        email,
        senha,
        numero_chamada:      numeroChamada      || null,
        idade:               idade              || null,
        empresa:             empresa            || null,
        numero_verificacao:  numeroVerificacao  || null,
        tipo,
      })
      alert('Aluno criado com sucesso!')
      handleLimpar()
    } catch (err: any) {
      setErro(err.response?.data?.msg || 'Erro ao criar aluno.')
    } finally {
      setCarregando(false)
    }
  }

  function handleLimpar() {
    setNome('')
    setEmail('')
    setSenha('')
    setNumeroChamada('')
    setIdade('')
    setEmpresa('')
    setNumeroVerificacao('')
    setTipo('user')
    setEquipeId('')
    setErro('')
  }

  return (
    <div className={style.page_wrapper}>
      <div className={style.bg_grid} />
      <div className={style.bg_glow} />

      <div className={style.navbar_slot}>
        <NavBar />
      </div>

      <div className={style.content}>
        <div className={style.Form_CriarAluno}>
          <div className={style.corner_tl} />
          <div className={style.corner_br} />

          <div className={style.card_header}>
            <h1 className={style.title}>Criar Aluno</h1>
            <div className={style.header_line} />
            <p className={style.subtitle}>Preencha os dados do novo aluno</p>
          </div>

          <div className={style.fields_wrapper}>

            <div className={style.fields_row}>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Nome <span className={style.required}>*</span></label>
                <input
                  className={style.input_form}
                  type="text"
                  placeholder="Nome completo"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                />
              </div>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Email <span className={style.required}>*</span></label>
                <input
                  className={style.input_form}
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className={style.fields_row}>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Senha <span className={style.required}>*</span></label>
                <input
                  className={style.input_form}
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                />
              </div>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Nº Chamada</label>
                <input
                  className={style.input_form}
                  type="number"
                  placeholder="Ex: 12"
                  value={numeroChamada}
                  onChange={e => setNumeroChamada(e.target.value)}
                />
              </div>
            </div>

            <div className={style.fields_row}>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Idade</label>
                <input
                  className={style.input_form}
                  type="number"
                  placeholder="Ex: 16"
                  value={idade}
                  onChange={e => setIdade(e.target.value)}
                />
              </div>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Empresa</label>
                <input
                  className={style.input_form}
                  type="text"
                  placeholder="Nome da empresa"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                />
              </div>
            </div>

            <div className={style.fields_row}>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Nº Verificação</label>
                <input
                  className={style.input_form}
                  type="text"
                  placeholder="Código"
                  value={numeroVerificacao}
                  onChange={e => setNumeroVerificacao(e.target.value)}
                />
              </div>
              <div className={style.inp_div_form}>
                <label className={style.inp_label}>Tipo</label>
                <select
                  className={`${style.input_form} ${style.select_form}`}
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                >
                  <option value="user">Aluno</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>


            {erro && <p className={style.erro}>{erro}</p>}

          </div>

          <div className={style.btn_div_form}>
            <button
              className={style.btn_form_c}
              onClick={handleCriar}
              disabled={carregando}
            >
              {carregando ? 'CRIANDO...' : 'CRIAR ALUNO'}
            </button>
            <button
              className={style.btn_form_V}
              onClick={handleLimpar}
              disabled={carregando}
            >
              LIMPAR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CriarAluno