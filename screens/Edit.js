import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Button, Container, Form, H1, Input, Item} from 'native-base';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Edit = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [totalNoSeason, setTotalNoSeason] = useState('');
  const [id, setId] = useState(null);

  const update = async () => {
    try {
      if (!name || !totalNoSeason) {
        return alert('Please enter value in both field');
        //TODO:add snackbar here
      }
      const seasontoUpdate = {
        id,
        name,
        totalNoSeason,
        isWatch: false,
      };

      const storedValue = await AsyncStorage.getItem('@season_list');

      const list = await JSON.parse(storedValue);

      list.map(singleSeason => {
        if (singleSeason.id == id) {
          singleSeason.name = name;
          singleSeason.totalNoSeason = totalNoSeason;
        }
        return singleSeason;
      });

      await AsyncStorage.setItem('@season_list', JSON.stringify(list));

      navigation.navigate('Home');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const {season} = route.params;
    const {id, name, totalNoSeason} = season;
    setId(id);
    setName(name);
    setTotalNoSeason(totalNoSeason);
  }, [route.params]);
  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <H1 style={styles.heading}>Add to watch List</H1>
        <Form>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="Season Name"
              style={{color: '#eee'}}
              value={name}
              onChangeText={text => setName(text)}
            />
          </Item>
          <Item rounded style={styles.formItem}>
            <Input
              placeholder="Total Number of Seasons"
              keyboardType="numeric"
              value={totalNoSeason}
              onChangeText={text => setTotalNoSeason(text)}
              style={{color: '#eee'}}
            />
          </Item>

          <Button rounded block onPress={update}>
            <Text style={{color: '#eee'}}>Update</Text>
          </Button>
        </Form>
      </ScrollView>
    </Container>
  );
};

export default Edit;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1b262c',
    flex: 1,
    justifyContent: 'flex-start',
  },
  heading: {
    textAlign: 'center',
    color: '#00b7c2',
    marginHorizontal: 5,
    marginTop: 50,
    marginBottom: 20,
  },
  formItem: {
    marginBottom: 20,
  },
});
