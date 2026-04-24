import { useState } from 'react'
import style from './style.module.css'
import { criarEquipe } from '../api/equipes.js'
import NavBar from '../NavBar/NavBar.tsx'

function CriarEquipe_Form() {
  const [nomeEquipe, setNomeEquipe] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleCriar() {
    setErro('')

    if (!nomeEquipe) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    setCarregando(true)

    try {
      await criarEquipe(nomeEquipe)
      alert('Equipe criada com sucesso!')
    } catch (err: any) {
      setErro(err.response?.data?.msg || 'Erro ao criar equipe.')
    } finally {
      setCarregando(false)
    }
  }

  function handleLimpar() {
    setNomeEquipe('')
    setErro('')
  }

  return (
    <div className={style.page_wrapper}>
      <div className={style.bg_grid} />
      <div className={style.bg_glow} />

      {/* NAVBAR no topo */}
      <div className={style.navbar_slot}>
        <NavBar />
      </div>

      {/* CONTEÚDO centralizado abaixo da navbar */}
      <div className={style.content}>
        <div className={style.Form_CriarAluno}>
          <div className={style.card_header}>
            <h1 className={style.title}>CRIAR EQUIPE</h1>
            <div className={style.header_line} />
            <p className={style.subtitle}>Preencha os dados da nova equipe</p>
          </div>

          <div className={style.fields_wrapper}>
            <div className={style.inp_div_form}>
              <label className={style.inp_label}>
                Nome da Equipe <span className={style.required}>*</span>
              </label>
              <input
                className={style.input_form}
                type="text"
                placeholder="Nome da equipe..."
                value={nomeEquipe}
                onChange={(e) => setNomeEquipe(e.target.value)}
              />
            </div>

            {erro && <p className={style.erro}>{erro}</p>}
          </div>

          <div className={style.btn_div_form}>
            <button
              className={style.btn_form_c}
              onClick={handleCriar}
              disabled={carregando}
            >
              {carregando ? 'CRIANDO...' : 'CRIAR EQUIPE'}
            </button>

            <button
              className={style.btn_form_V}
              onClick={handleLimpar}
              disabled={carregando}
            >
              LIMPAR
            </button>
          </div>

          <div className={style.corner_tl} />
          <div className={style.corner_br} />
        </div>
      </div>
    </div>
  )
}

export default CriarEquipe_Form