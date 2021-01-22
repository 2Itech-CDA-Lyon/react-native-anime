import React, { FC } from 'react';
import { AllAnime, AnimeDetails } from './screens';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './navigation';
import { AnimesContext } from './contexts';
import { IAnime, IAnimesContextValue } from './models';



const RootStack = createStackNavigator<RootStackParamList>();

const addInStore = (anime: IAnime) => {
  contextValue.store[anime.id] = anime
}

const contextValue: IAnimesContextValue = {
  store: { } ,
  actions: {
    addInStore
  }
}

const App: FC = () => {
  return (
    <AnimesContext.Provider value={contextValue}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Home">
          <RootStack.Screen name="Home" component={AllAnime} />
          <RootStack.Screen name="AnimeDetails" options={({ route }) => ({ title: route.params.title })} component={AnimeDetails} />
        </RootStack.Navigator>
      </NavigationContainer>
    </AnimesContext.Provider>
  );
};

export default App;
