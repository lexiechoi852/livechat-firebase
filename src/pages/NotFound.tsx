import notFoundLogo from '../assets/not-found.svg'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center">
      <div className='flex justify-center'>
        <img className="w-48 bg-white" src={notFoundLogo} alt="Not Found Icon" />
      </div>
      <div className="text-2xl text-white">Oops, looks like the page is lost.</div>
      <div className="text-xl text-white">This is not a fault, just an accident that was not intentional.</div>
    </div>
  )
}
