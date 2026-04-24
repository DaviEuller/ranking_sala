import { useState, useEffect } from 'react'
import style from './style.module.css'
import {
  editarEquipe,
  adicionarPontos,
  adicionarMembros,
  removerMembros,
  listarMembros,
  buscarEquipe,
} from '../api/equipes.js'
import { listarUsuarios } from '../api/usuario.js'

interface Membro {
  id: number
  nome: string
  editando: boolean
  nomeTemp: string
}

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
  membros?: Membro[]
}

interface Props {
  equipe: Equipe
  onClose: () => void
  onSaved?: () => void
}

type Aba = 'dados' | 'status' | 'relatorio'

const PONTOS_CONFIG = [
  { key: 'pontos_diciplina',  label: 'Disciplina'   },
  { key: 'pontos_indisplina', label: 'Indisciplina' },
  { key: 'pontos_atraso',     label: 'Atraso'       },
  { key: 'pontos_entrega',    label: 'Entrega'      },
  { key: 'pontos_atitude',    label: 'Atitude'      },
] as const

type PontosKey = typeof PONTOS_CONFIG[number]['key']

const PONTOS_ZERO: Record<PontosKey, number> = {
  pontos_diciplina:  0,
  pontos_indisplina: 0,
  pontos_atraso:     0,
  pontos_entrega:    0,
  pontos_atitude:    0,
}

export default function EditarEquipe({ equipe, onClose, onSaved }: Props) {
  const [aba, setAba] = useState<Aba>('dados')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const [nome, setNome] = useState(equipe.nome_equipe)
  const [totalAtual, setTotalAtual] = useState(equipe.total ?? 0)

  const [membrosOriginais, setMembrosOriginais] = useState<Membro[]>([])
  const [membros, setMembros] = useState<Membro[]>([])
  const [novoMembro, setNovoMembro] = useState('')

  const [usuarios, setUsuarios] = useState([])

  const [pontos, setPontos]                 = useState<Record<PontosKey, number>>(PONTOS_ZERO)
  const [pontosOriginais, setPontosOriginais] = useState<Record<PontosKey, number>>(PONTOS_ZERO)

  // Lista de usuários cadastrados (datalist)
  useEffect(() => {
    listarUsuarios().then(setUsuarios)
  }, [])

  // Carrega equipe detalhada + membros ao abrir
  useEffect(() => {
    buscarEquipe(equipe.id).then((eq: Equipe) => {
      setNome(eq.nome_equipe)
      setTotalAtual(eq.total ?? 0)
      const base: Record<PontosKey, number> = {
        pontos_diciplina:  eq.pontos_diciplina  ?? 0,
        pontos_indisplina: -Math.abs(eq.pontos_indisplina ?? 0),
        pontos_atraso:     -Math.abs(eq.pontos_atraso     ?? 0),
        pontos_entrega:    eq.pontos_entrega    ?? 0,
        pontos_atitude:    eq.pontos_atitude    ?? 0,
      }
      setPontos(base)
      setPontosOriginais(base)
    }).catch(() => {})

    listarMembros(equipe.id).then((dados: { id: number; nome: string }[]) => {
      const lista: Membro[] = dados.map(m => ({
        id: m.id, nome: m.nome, editando: false, nomeTemp: m.nome,
      }))
      setMembros(lista)
      setMembrosOriginais(lista)
    }).catch(() => {})
  }, [equipe.id])

  const deltas = {
    p_disciplina:   pontos.pontos_diciplina  - pontosOriginais.pontos_diciplina,
    p_indisciplina: pontos.pontos_indisplina - pontosOriginais.pontos_indisplina,
    p_atraso:       pontos.pontos_atraso     - pontosOriginais.pontos_atraso,
    p_entrega:      pontos.pontos_entrega    - pontosOriginais.pontos_entrega,
    p_atitude:      pontos.pontos_atitude    - pontosOriginais.pontos_atitude,
  }

  const total  = Object.values(deltas).reduce((acc, v) => acc + v, 0)
  const maxAbs = Math.max(...Object.values(deltas).map(v => Math.abs(v)), 1)

  /* ── MEMBROS ── */
  function iniciarEdicao(id: number) {
    setMembros(prev => prev.map(m => m.id === id ? { ...m, editando: true, nomeTemp: m.nome } : m))
  }
  function confirmarEdicao(id: number) {
    setMembros(prev => prev.map(m => m.id === id ? { ...m, editando: false, nome: m.nomeTemp } : m))
  }
  function atualizarTemp(id: number, valor: string) {
    setMembros(prev => prev.map(m => m.id === id ? { ...m, nomeTemp: valor } : m))
  }
  function removerMembroLocal(id: number) {
    setMembros(prev => prev.filter(m => m.id !== id))
  }
  function adicionarMembroLocal() {
    const nomeNovo = novoMembro.trim()
    if (!nomeNovo) return
    setMembros(prev => [...prev, { id: Date.now(), nome: nomeNovo, editando: false, nomeTemp: nomeNovo }])
    setNovoMembro('')
  }

  /* ── SAVE ── */
  async function handleSave() {
    setSalvando(true)
    setErro(null)
    try {
      try {
        await editarEquipe(equipe.id, { nome_equipe: nome })
      } catch (e: any) {
        if (e?.response?.status !== 304) throw e
      }

      const payloadPontos = {
        p_disciplina:   Number(deltas.p_disciplina)   || 0,
        p_indisciplina: Number(deltas.p_indisciplina) || 0,
        p_atraso:       Number(deltas.p_atraso)       || 0,
        p_entrega:      Number(deltas.p_entrega)      || 0,
        p_atitude:      Number(deltas.p_atitude)      || 0,
      }
      if (Object.values(payloadPontos).some(v => v !== 0)) {
        try {
          await adicionarPontos(equipe.id, payloadPontos)
        } catch (e: any) {
          if (e?.response?.status !== 304) throw e
        }
      }

      const idsOriginais = new Set(membrosOriginais.map(m => m.id))
      const idsAtuais    = new Set(membros.map(m => m.id))
      const removidos    = membrosOriginais.filter(m => !idsAtuais.has(m.id)).map(m => m.id)
      const adicionados  = membros.filter(m => !idsOriginais.has(m.id)).map(m => m.nome)

      if (removidos.length > 0) {
        try { await removerMembros(equipe.id, removidos) }
        catch (e: any) { if (e?.response?.status !== 304) throw e }
      }
      if (adicionados.length > 0) {
        try { await adicionarMembros(equipe.id, adicionados) }
        catch (e: any) { if (e?.response?.status !== 304) throw e }
      }

      onSaved?.()
      onClose()
    } catch (e: any) {
      setErro(e?.response?.data?.msg ?? 'Erro ao salvar equipe')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className={style.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={style.modal}>
        <div className={style.corner_tl} />
        <div className={style.corner_br} />

        <div className={style.modal_header}>
          <p className={style.modal_title}>
            Editar <span className={style.title_accent}>/ equipe</span>
          </p>
          <button className={style.btn_close} onClick={onClose}>✕</button>
        </div>

        <div className={style.tabs}>
          {(['dados', 'status', 'relatorio'] as Aba[]).map(a => (
            <button
              key={a}
              className={`${style.tab} ${aba === a ? style.tab_active : ''}`}
              onClick={() => setAba(a)}
            >
              {a === 'dados' ? 'Dados' : a === 'status' ? 'Pontos' : 'Relatório'}
            </button>
          ))}
        </div>

        <div className={style.scroll_area}>
          {aba === 'dados' && (
            <>
              <div className={style.section}>
                <p className={style.section_label}>Nome da equipe</p>
                <input
                  className={style.input}
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Nome da equipe..."
                />
              </div>

              <div className={style.section}>
                <p className={style.section_label}>Participantes</p>
                <div className={style.members_list}>
                  {membros.map(m => (
                    <div key={m.id} className={style.member_row}>
                      {m.editando ? (
                        <input
                          className={style.member_input}
                          value={m.nomeTemp}
                          onChange={e => atualizarTemp(m.id, e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && confirmarEdicao(m.id)}
                          autoFocus
                        />
                      ) : (
                        <span className={style.member_name_text}>{m.nome}</span>
                      )}
                      <div className={style.member_btns}>
                        {m.editando ? (
                          <button className={style.btn_edit} onClick={() => confirmarEdicao(m.id)}>OK</button>
                        ) : (
                          <button className={style.btn_edit} onClick={() => iniciarEdicao(m.id)}>Edit</button>
                        )}
                        <button className={style.btn_del} onClick={() => removerMembroLocal(m.id)}>Del</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    className={style.input}
                    value={novoMembro}
                    onChange={e => setNovoMembro(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && adicionarMembroLocal()}
                    placeholder="Nome exato do usuário cadastrado..."
                    list="usuarios"
                  />
                  <datalist id="usuarios">
                    {usuarios.map((u: any) => <option key={u.id} value={u.nome} />)}
                  </datalist>
                  <button
                    className={style.btn_add_member}
                    style={{ width: 'auto', padding: '0 12px' }}
                    onClick={adicionarMembroLocal}
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}

          {aba === 'status' && (
            <div className={style.section}>
              <p className={style.section_label}>Pontos atuais</p>
              <div className={style.points_grid}>
                {PONTOS_CONFIG.map(({ key, label }) => (
                  <div key={key} className={style.point_card}>
                    <p className={style.point_label}>{label}</p>
                    <input
                      type="number"
                      className={style.point_input}
                      value={Math.abs(pontos[key])}
                      onChange={e => {
                        const isNegative = key === 'pontos_indisplina' || key === 'pontos_atraso'
                        setPontos(prev => ({
                          ...prev,
                          [key]: isNegative
                            ? -Math.abs(Number(e.target.value))
                            :  Math.abs(Number(e.target.value)),
                        }))
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className={style.total_row}>
                <span className={style.total_label}>Delta desta edição</span>
                <span className={style.total_value}>{total} pts</span>
              </div>
            </div>
          )}

          {aba === 'relatorio' && (
            <>
              <div className={style.section}>
                <p className={style.section_label}>Histórico de pontos</p>
                <div className={style.report_list}>
                  {PONTOS_CONFIG.map(({ key, label }) => {
                    const map: Record<PontosKey, keyof typeof deltas> = {
                      pontos_diciplina:  'p_disciplina',
                      pontos_indisplina: 'p_indisciplina',
                      pontos_atraso:     'p_atraso',
                      pontos_entrega:    'p_entrega',
                      pontos_atitude:    'p_atitude',
                    }
                    const val = deltas[map[key]]
                    const isPos = val >= 0
                    const pct = Math.round((Math.abs(val) / maxAbs) * 100)
                    return (
                      <div key={key} className={style.report_item}>
                        <div className={style.report_row}>
                          <span className={style.report_name}>{label}</span>
                          <span className={`${style.report_pts} ${isPos ? style.report_pts_pos : style.report_pts_neg}`}>
                            {isPos ? '+' : ''}{val} pts
                          </span>
                        </div>
                        <div className={style.bar_wrap}>
                          <div
                            className={`${style.bar_fill} ${isPos ? style.bar_pos : style.bar_neg}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={style.report_summary}>
                <span className={style.report_summary_label}>Total acumulado</span>
                <span className={style.report_summary_value}>{totalAtual + total} pts</span>
              </div>
            </>
          )}
        </div>

        {erro && (
          <p style={{ color: '#E01020', fontSize: '0.8rem', padding: '0 16px' }}>{erro}</p>
        )}

        <div className={style.modal_footer}>
          <button className={style.btn_cancel} onClick={onClose}>Cancelar</button>
          <button className={style.btn_save} onClick={handleSave} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Equipe'}
          </button>
        </div>
      </div>
    </div>
  )
}
