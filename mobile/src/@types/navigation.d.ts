export interface GameParams {
  id: string
  title: string
  bannerUrl: string
}

/**
 *
 * Dessa maneira, posso tipar dizendo para certas rotas
 * quais parâmetros é de se esperar.
 */
export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined
      game: GameParams
    }
  }
}
