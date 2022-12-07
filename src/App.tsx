import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import { AudioContextProvider } from './context/audio'

import Layout from './components/shared/Layout'

import Login from './screens/login'
import Registro from './screens/registro'

import Inicio from './screens/inicio'
import Colecoes from './screens/colecoes'
import Favoritas from './screens/favoritas'
import Playlists from './screens/playlists'
import Perfil from './screens/perfil'
import Musica from './screens/musica'
import Artista from './screens/artista'

function App() {
  return (
    <div>
      <AuthContextProvider>
        <AudioContextProvider>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route index element={<Inicio />} />
                <Route path='/colecoes' element={<Colecoes />} />
                <Route path='/playlists' element={<Playlists />} />
                <Route path='/favoritas' element={<Favoritas />} />
                <Route path='/perfil' element={<Perfil />} />
                <Route path='/:id' element={<Artista />} />
              </Route>
              <Route path='/login' element={<Login />} />
              <Route path='/registro' element={<Registro />} />
              <Route path='/musica' element={<Musica />} />
            </Routes>
          </BrowserRouter>
        </AudioContextProvider>
      </AuthContextProvider>
    </div>
  )
}

export default App
