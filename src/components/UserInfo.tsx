import { User } from '@/types/user'

export function UserInfo({ user }: { user: User }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Información del Usuario</h2>
      <div className="space-y-2">
        <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Código de Profesor:</strong> {user.codTeacher}</p>
      </div>
    </div>
  )
}
