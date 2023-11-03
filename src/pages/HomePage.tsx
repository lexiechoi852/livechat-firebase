import Rooms from '../components/Rooms'
import UserList from '../components/UserList'

export default function HomePage() {
  return (
    <div className="container-xl mx-auto p-4 flex flex-col lg:flex-row">
      <Rooms />
      <UserList />
    </div>
  )
}
