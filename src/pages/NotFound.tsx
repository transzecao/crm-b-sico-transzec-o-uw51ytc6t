/* 404 Page - Displays when a user attempts to access a non-existent route - translate to the language of the user */
import { useLocation, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const NotFound = () => {
  const location = useLocation()
  const logged = useRef(false)

  useEffect(() => {
    if (!logged.current && location.pathname !== '/') {
      console.error('404 Error: User attempted to access non-existent route:', location.pathname)
      logged.current = true
    }
  }, [location.pathname])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/50 p-6">
      <div className="text-center space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-6xl font-black text-slate-800 tracking-tight" aria-label="Erro 404">
          404
        </h1>
        <p className="text-lg text-slate-600 font-medium" aria-describedby="Página não encontrada">
          Oops! A página que você procura não foi encontrada.
        </p>
        <Link
          to="/"
          className="inline-block mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all active:scale-95"
          aria-label="Voltar para a página inicial"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  )
}

export default NotFound
