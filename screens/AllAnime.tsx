import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useEffect, useState, useContext } from 'react';
import { StatusBar, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import AnimeList from '../components/AnimeList';
import { IAnime, ICollectionApiResponse } from '../models';
import { RootStackParamList } from '../navigation';
import { AnimesContext } from '../contexts'
import RequestState from '../request-state';
import { FetchedContent } from '../components';


// Avec react-navigation, les composants qui représentent des écrans reçoivent automatiquement deux props:
// - navigation: qui contient un ensemble de fonctions permettant de changer d'écran
// - route: qui contient des informations sur la route actuelle, et notamment les paramètres passés par l'écran précédent
// Ce code permet de typer ces deux props, afin de pouvoir bénéficier de l'apport de TypeScript
// (notamment, s'assurer que le code du composant est compatible avec les paramètres attendus par la route),
// et dit en substance: le prop navigation dépend de la structure des routes déclarée dans RootStackParamList,
// ainsi que du nom de route auquel est lié le compoasnt.
// NOTE: ce code n'est absolument pas indispensable au bon fonctionnement de l'application et peut être omis.
// Il permet simplement d'améliorer l'expérience de développement et de réduire l'erreur humaine.
type AllAnimeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type AllAnimeRouteProp = RouteProp<RootStackParamList, 'Home'>;

interface AllAnimeProps {
  navigation: AllAnimeNavigationProp;
  route: AllAnimeRouteProp;
}

const AllAnime: FC<AllAnimeProps> = () => {
  // Retient l'état actuel de la liste des animés d'une exécution du composant à l'autre
  const [animes, setAnimes] = useState<IAnime[]>([]);
  const [requestState, setRequestState] = useState(RequestState.Idle);
  const { actions } = useContext(AnimesContext);
  // Associe un comportement à la création du composant
  useEffect(
    () => {
      setRequestState(RequestState.Pending);
      // Envoie une requête AJAX pour récupérer la liste des animés
      fetch('https://kitsu.io/api/edge/trending/anime')
      // Dès que la requête a répondu, transforme son contenu en objets JavaScript
      .then( response => response.json() )
      // Dès que la transformation est terminée, range le résultat dans la liste des animés
      .then( (json: ICollectionApiResponse<IAnime>) => {
        setRequestState(RequestState.Success);
        setAnimes(json.data)
        for(let anime of json.data){
          actions.addInStore(anime);
        }
      });
    },
    // Liste de dépendances, tableau vide = le comportement s'exécutera une seule fois, à la création du composant
    []
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic">

          <FetchedContent requestState={requestState}>
            <AnimeList animes={animes} />
          </FetchedContent>

        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default AllAnime;
