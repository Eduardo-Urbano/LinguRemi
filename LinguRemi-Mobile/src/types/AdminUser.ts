export type AdminUser = {
  idUsuarios: number
  nomeUsuarios: string
  emailUsuarios: string
  role: 'USER' | 'ADMIN'
  ativoUsuarios: boolean
}