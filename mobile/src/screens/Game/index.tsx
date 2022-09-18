import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, useNavigation } from '@react-navigation/native'
import { Background } from '../../components/Background'

import { View, TouchableOpacity, Image, FlatList, Text } from 'react-native'
import { Entypo } from '@expo/vector-icons'

import { styles } from './styles'
import { THEME } from '../../theme'
import logoImg from '../../assets/logo-nlw-esports.png'

import { GameParams } from '../../@types/navigation'
import { Heading } from '../../components/Heading'
import { DuoCard, DuoCardProps } from '../../components/DuoCard'
import { DuoMatch } from '../../components/DuoMatch'

import config from '../../../config'

export function Game() {
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuoSelected, setDiscordDuoSelected] = useState('')

  const route = useRoute()
  const game = route.params as GameParams
  const navigation = useNavigation()

  useEffect(() => {
    fetch(`${config.API_URL}:${config.API_PORT}/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => {
        setDuos(data)
      })
  }, [])

  function handleGoBack() {
    navigation.goBack()
  }

  async function getDiscordUser(adsId: string) {
    fetch(`${config.API_URL}:${config.API_PORT}/ads/${adsId}/discord`)
      .then(response => response.json())
      .then(data => {
        setDiscordDuoSelected(data.discord)
      })
  }

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo} />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={[
            duos.length > 0 ? styles.contentList : styles.emptyListContent
          ]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda.
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  )
}
