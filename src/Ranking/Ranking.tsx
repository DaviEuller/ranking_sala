import { useEffect, useState } from 'react'
import style from './style.module.css'
import { listarEquipes } from '../api/equipes.js'

interface Equipe {
  id: number
  nome_equipe: string
  total: number
  status: string
  pontos_disciplina?: number
  pontos_indisciplina?: number
  pontos_atraso?: number
  pontos_entrega?: number
  pontos_atitude?: number
  membros?: { id: number; nome: string }[]
}

// ID da equipe do aluno logado — substituir pelo dado real da sessão
const MY_TEAM_ID = 1

function getBadgeClass(index: number, style: Record<string, string>) {
  if (index === 0) return style.rank_gold
  if (index === 1) return style.rank_silver
  if (index === 2) return style.rank_bronze
  return style.rank_default
}

export default function Dashboard_Aluno() {
  const [teams, setTeams] = useState<Equipe[]>([])

  useEffect(() => {
    listarEquipes().then((data: Equipe[]) => {
      const sorted = [...data].sort((a, b) => (b.total ?? 0) - (a.total ?? 0))
      setTeams(sorted)
    })
  }, [])

  const myTeam = teams.find(t => t.id === MY_TEAM_ID)
  const myRank = teams.findIndex(t => t.id === MY_TEAM_ID)
  const maxTotal = Math.max(...teams.map(t => t.total ?? 0), 1)

  const posTotal = (myTeam?.pontos_disciplina ?? 0)
    + (myTeam?.pontos_entrega ?? 0)
    + (myTeam?.pontos_atitude ?? 0)

  const negTotal = (myTeam?.pontos_indisciplina ?? 0)
    + (myTeam?.pontos_atraso ?? 0)

  return (
    <div className={style.page_wrapper}>

      {/* ── PAINEL ESQUERDO — RANKING ── */}
      <div className={style.panel_ranking}>
        <div className={style.corner_tl} />
        <div className={style.corner_br} />
        <div className={style.fade_top} />
        <div className={style.fade_bottom} />

        <p className={style.panel_title}>
          Ranking <span className={style.title_accent}>/ equipes</span>
        </p>

        <div className={style.scroll_area}>
          <div className={style.rank_list}>
            {teams.map((team, index) => {
              const isMe = team.id === MY_TEAM_ID
              return (
                <div
                  key={team.id}
                  className={`${style.team_card} ${isMe ? style.team_card_mine : ''}`}
                >
                  <div className={style.team_header}>
                    <div className={`${style.rank_badge} ${getBadgeClass(index, style)}`}>
                      {index + 1}
                    </div>
                    <span className={style.team_name}>{team.nome_equipe}</span>
                    {isMe && <span className={style.you_tag}>sua equipe</span>}
                    <span className={style.team_pts}>{team.total} pts</span>
                  </div>

                  <div className={style.mini_bar}>
                    <div
                      className={style.mini_fill}
                      style={{ width: `${Math.round((team.total / maxTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── PAINEL DIREITO — MINHA EQUIPE ── */}
      <div className={style.panel_detail}>
        <div className={style.corner_tl} />
        <div className={style.corner_br} />

        <p className={style.panel_title}>
          Minha equipe <span className={style.title_accent}>/ visão geral</span>
        </p>

        {myTeam ? (
          <div className={style.detail_body}>

            {/* Header da equipe */}
            <div className={style.team_title_row}>
              <div className={`${style.team_big_badge} ${getBadgeClass(myRank, style)}`}>
                {myRank + 1}
              </div>
              <div>
                <div className={style.team_big_name}>{myTeam.nome_equipe}</div>
                <div className={style.team_big_pts}>
                  {myTeam.total} pontos totais
                  {myTeam.membros ? ` • ${myTeam.membros.length} membros` : ''}
                  {myTeam.status ? ` • ${myTeam.status}` : ''}
                </div>
              </div>
            </div>

            <div className={style.divider} />

            {/* Estatísticas */}
            <div className={style.stats_col}>
              <p className={style.section_lbl}>Estatísticas</p>
              <div className={style.stats_grid}>
                {[
                  { lbl: 'Disciplina', val: myTeam.pontos_disciplina ?? 0, max: 100 },
                  { lbl: 'Entrega',    val: myTeam.pontos_entrega    ?? 0, max: 100 },
                  { lbl: 'Atitude',    val: myTeam.pontos_atitude    ?? 0, max: 100 },
                  { lbl: 'Indisciplina', val: myTeam.pontos_indisciplina ?? 0, max: 30 },
                  { lbl: 'Atraso',     val: myTeam.pontos_atraso     ?? 0, max: 30 },
                  { lbl: 'Total',      val: myTeam.total              ?? 0, max: maxTotal },
                ].map(stat => (
                  <div key={stat.lbl} className={style.stat_box}>
                    <div className={style.stat_lbl}>{stat.lbl}</div>
                    <div className={style.stat_val}>{stat.val}</div>
                    <div className={style.stat_bar_wrap}>
                      <div
                        className={style.stat_bar_fill}
                        style={{ width: `${Math.round((stat.val / stat.max) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relatório */}
            <div className={style.report_col}>
              <p className={style.section_lbl}>Relatório</p>
              <div className={style.report_rows}>
                {[
                  { icon: '◈', lbl: 'Status',           val: myTeam.status ?? '-',        cls: style.val_green },
                  { icon: '◆', lbl: 'Posição no ranking', val: `#${myRank + 1} lugar`,     cls: style.val_white },
                  { icon: '▲', lbl: 'Pontos positivos',  val: `+${posTotal} pts`,          cls: style.val_green },
                  { icon: '▼', lbl: 'Pontos negativos',  val: `-${negTotal} pts`,          cls: style.val_red },
                  { icon: '✦', lbl: 'Melhor categoria',  val: 'Entrega',                   cls: style.val_blue },
                  { icon: '◉', lbl: 'Total de membros',  val: `${myTeam.membros?.length ?? 0} alunos`, cls: style.val_white },
                ].map(r => (
                  <div key={r.lbl} className={style.report_row}>
                    <span className={style.report_icon}>{r.icon}</span>
                    <span className={style.report_lbl}>{r.lbl}</span>
                    <span className={`${style.report_val} ${r.cls}`}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={style.divider} />

            {/* Membros */}
            {myTeam.membros && myTeam.membros.length > 0 && (
              <div className={style.members_col}>
                <p className={style.section_lbl}>Membros</p>
                <div className={style.members_list}>
                  {myTeam.membros.map(m => (
                    <div key={m.id} className={style.member_row}>
                      <div className={style.member_dot} />
                      <span className={style.member_name}>{m.nome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className={style.empty_state}>
            <div className={style.empty_icon}>◈</div>
            <p className={style.empty_txt}>Carregando equipe...</p>
          </div>
        )}
      </div>

    </div>
  )
}