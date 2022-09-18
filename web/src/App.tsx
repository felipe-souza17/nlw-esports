import './styles/main.css'

import { useEffect, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'

// Importamos a imagem ao invés de utilizar um require ou especificar o caminho no source
import logoImg from './assets/logo-nlw-esports.svg'
import { GameBanner } from './components/GameBanner'
import { CreateAdBanner } from './components/CreateAdBanner'

import { CreateAdModal } from './components/CreateAdModal'
import axios from 'axios'

// Cria uma tipagem para dos dados que meus games possuem

export interface Game {
  id: string
  title: string
  bannerUrl: string
  _count: {
    ads: number
  }
}

function App() {
  // Declaro que minha variável "games" é um array do tipo Game e o estado inicial dela é um array vazio
  const [games, setGames] = useState<Game[]>([])

  /**
   *
   * Ao minha página renderizar uma vez busco meus dados na api,
   * retorno um json e depois seto os dados no meu array games.
   *
   * [] = É um hack para dizer que vai renderizar apenas uma vez aquele efeito.
   *
   * */
  useEffect(() => {
    axios('http://localhost:3333/games').then(response => {
      setGames(response.data)
    })
  }, [])

  return (
    <div className="max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} />

      <h1 className="text-6xl text-white font-black mt-20">
        Seu{' '}
        <span className="bg-nlw-gradient bg-clip-text text-transparent">
          duo
        </span>{' '}
        está aqui.
      </h1>

      <div className="grid grid-cols-6 gap-6 mt-16">
        {/* 
          Para cada jogo dentro do meu array eu retorno um game banner, que vai
          renderizar o jogo especifico, com foto, titulo e quantidade de anúncios.
          Cada um contendo uma chave.
        */}
        {games.map(game => {
          return (
            <GameBanner
              key={game.id}
              bannerUrl={game.bannerUrl}
              title={game.title}
              adsCount={game._count.ads}
            />
          )
        })}
      </div>

      <Dialog.Root>
        <CreateAdBanner />

        <CreateAdModal />
      </Dialog.Root>
    </div>
  )
}

export default App
