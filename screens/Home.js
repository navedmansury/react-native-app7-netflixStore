import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {
  Body,
  Button,
  CheckBox,
  Container,
  Fab,
  H1,
  Icon,
  Left,
  List,
  ListItem,
  Right,
  Spinner,
  Subtitle,
  Text,
  Title,
} from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';

const Home = ({navigation, route}) => {
  const [listOfSeasons, setListOfSeasons] = useState([]);
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();

  const getList = async () => {
    setLoading(true);

    const storedValue = await AsyncStorage.getItem('@season_list');

    if (!storedValue) {
      setListOfSeasons([]);
    } else {
      const list = JSON.parse(storedValue);
      setListOfSeasons(list);
    }

    setLoading(false);
  };

  const deleteSeason = async id => {
    const newList = await listOfSeasons.filter(list => list.id !== id);
    await AsyncStorage.setItem('@season_list', JSON.stringify(newList));

    setListOfSeasons(newList);
  };

  const markComplete = async id => {
    const newList = listOfSeasons.map(list => {
      if (list.id == id) {
        list.isWatched = !list.isWatched;
      }
      return list;
    });

    await AsyncStorage.setItem('@season_list', JSON.stringify(newList));
    setListOfSeasons(newList);
  };

  useEffect(() => {
    getList();
  }, [isFocused]);

  if (loading) {
    return (
      <Container style={styles.container}>
        <Spinner color="#00b7c2" />
      </Container>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {listOfSeasons.length === 0 ? (
        <Container style={styles.container}>
          <H1 style={styles.heading}>
            Watch list is empty. Please add a season.
          </H1>
        </Container>
      ) : (
        <>
          <H1 style={styles.heading}>Next series to watch</H1>
          <List>
            {listOfSeasons.map(season => (
              <ListItem key={season.id} style={styles.ListItem} noBorder>
                <Left>
                  <Button
                    style={styles.actionButton}
                    danger
                    onPress={() => deleteSeason(season.id)}>
                    <Icon name="trash" />
                  </Button>
                  <Button
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Edit', {season})}>
                    <Icon active name="edit" type="Feather" />
                  </Button>
                </Left>

                <Body>
                  <Title style={styles.seasonName}>{season.name}</Title>
                  <Text note>{season.totalNoSeason} season to watch</Text>
                </Body>
                <Right>
                  <CheckBox
                    checked={season.isWatched}
                    onPress={() => markComplete(season.id)}
                  />
                </Right>
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Fab
        style={{backgroundColor: '#5067ff'}}
        position="bottomRight"
        onPress={() => {
          return navigation.navigate('Add');
        }}>
        <Icon name="add" />
      </Fab>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
  },
  heading: {
    textAlign: 'center',
    color: '#00b7c2',
    marginVertical: 15,
    marginHorizontal: 5,
  },
  actionButton: {
    marginLeft: 5,
  },
  seasonName: {
    color: '#fdcb9e',
    textAlign: 'justify',
  },
  listItem: {
    marginLeft: 0,
    marginBottom: 20,
  },
});
