import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHourStringToMinute } from './utils/convert-hour-string-to-minute'
import { convertMinutesToHourString } from './utils/convert-minutes-to-hour-string'

const app = express()

app.use(express.json())
app.use(cors())

// Faz a conexão com o banco automaticamente
const prisma = new PrismaClient()

/**
 * Executa uma função anônima assíncrona
 * Acessa a tabela game e o método findMany ( Como se fosse o select )
 * Ou seja, aqui estou selecionando os jogos e fazendo um join com os anúncios dele contando quantos anúncios possuem
 */
app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  })

  // Envia nossa responsa em JSON.
  return response.json(games)
})

/**
 * 
 * Pega os parâmetros enviados através do body.
 * Cria um Ad ( Anúncio )
 * 
 */
app.post('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id
  const body = request.body
  
  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weekDays: body.weekDays.join(','),
      hourStart: convertHourStringToMinute(body.hourStart),
      hourEnd: convertHourStringToMinute(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel,
    },
  })

  return response.status(201).json(ad)
})

/**
 * 
 * Procura todo os anúncios do game passado através do gameId.
 * Faz um SELECT onde diz:
 * "SELECIONE os atributos abaixo ONDE o gameId(ad) seja IGUAL a gameId(param) e ordene de forma DESC."
 *  
 */
app.get('/games/:id/ads', async (request, response) => {
  const gameId = request.params.id

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weekDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return response.json(ads.map(ad => {
    return {
      ...ad,
      weekDays: ad.weekDays.split(','),
      hourStart: convertMinutesToHourString(ad.hourStart),
      hourEnd: convertMinutesToHourString(ad.hourEnd)
    }
  }))
})

/**
 * 
 * Pega o discord de determinado anúncio onde o id(ad) seja igual ao adId(param)
 * Usamos findUnique quando queremos achar apenas um.
 * Mas usando orThrow porque o usuário pode acabar inserindo um id nulo, que não existe.
 * 
 */
app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId
    }
  })
  return response.json({
    discord: ad.discord,
  })
})

app.listen(3333)
