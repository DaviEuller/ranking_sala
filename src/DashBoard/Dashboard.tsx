import { useState, useEffect } from 'react'
import style from './style.module.css'
import { useNavigate } from 'react-router-dom'
import { listarEquipes, deletarEquipe } from '../api/equipes.js'
import EditarEquipeForm from '../Editarequipe/EditarEquipe.tsx'

interface Equipe {
  id: number
  nome_equipe: string
  total: number
  status: string
  pontos_diciplina?: number
  pontos_indisplina?: number
  pontos_atraso?: number
  pontos_entrega?: number
  pontos_atitude?: number
  membros?: { id: number; nome: string; editando: boolean; nomeTemp: string }[]
}

function getRankClass(index: number) {
  if (index === 0) return style.rank_gold
  if (index === 1) return style.rank_silver
  if (index === 2) return style.rank_bronze
  return ''
}

export default function Dashboard_Adm() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState<Equipe[]>([])
  const [equipeEditando, setEquipeEditando] = useState<Equipe | null>(null)

  const fetchTeams = async () => {
    const data = await listarEquipes()
    const sorted = [...data].sort((a: Equipe, b: Equipe) => (b.total ?? 0) - (a.total ?? 0))
    setTeams(sorted)
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  return (
    <div className={style.page_wrapper}>

      {/* ── PAINEL ESQUERDO — RANKING ── */}
      <div className={style.panel_ranking}>
        <div className={style.corner_tl}></div>
        <div className={style.corner_br}></div>
        <div className={style.fade_top}></div>
        <div className={style.fade_bottom}></div>

        <p className={style.panel_title}>
          Ranking <span className={style.title_accent}>/ equipes</span>
        </p>

        <div className={style.scroll_area}>
          <div className={style.rank_list}>
            {teams.map((team, index) => (
              <div key={team.id} className={style.team_card}>

                <div className={style.team_header}>
                  <div className={`${style.rank_badge} ${getRankClass(index)}`}>
                    {index + 1}
                  </div>
                  <span className={style.team_name}>{team.nome_equipe}</span>
                  <span className={style.team_pts}>{team.total} pts</span>
                </div>

                <div className={style.team_actions}>
                  <button
                    className={`${style.btn_team} ${style.btn_team_edit}`}
                    onClick={() => setEquipeEditando(team)}
                  >
                    Editar Equipe
                  </button>
                  <button
                    className={`${style.btn_team} ${style.btn_team_del}`}
                    onClick={async () => {
                      if (window.confirm(`Tem certeza que deseja excluir a equipe "${team.nome_equipe}"?`)) {
                        await deletarEquipe(team.id)
                        setTeams(prev => prev.filter(t => t.id !== team.id))
                      }
                    }}
                  >
                    Excluir Equipe
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COLUNA DIREITA ── */}
      <div className={style.right_col}>
        <div className={style.panel_actions}>
          <div className={style.corner_tl}></div>
          <div className={style.corner_br}></div>

          <p className={style.panel_title}>
            Ações <span className={style.title_accent}>/ admin</span>
          </p>

          <div className={style.create_btns}>
            <button
              className={style.btn_create_primary}
              onClick={() => navigate('/Caluno')}
            >
              + Criar Aluno
            </button>
            <button
              className={style.btn_create_secondary}
              onClick={() => navigate('/Cequipe')}
            >
              + Criar Equipe
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL EDITAR EQUIPE ── */}
      {equipeEditando && (
        <EditarEquipeForm
          equipe={equipeEditando}
          onClose={() => setEquipeEditando(null)}
          onSaved={() => {
            setEquipeEditando(null)
            fetchTeams()
          }}
        />
      )}

    </div>
  )
}