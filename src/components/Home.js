import React, {useState, useEffect} from "react";
import {View, Text, Alert, StyleSheet} from "react-native";
import {TextInput} from "react-native-gesture-handler";
import GlobalStyle from "../../utils/GlobalStyle";
import CustomButton from "./CustomButton";
import SQLite from "react-native-sqlite-storage";

import {useSelector, useDispatch} from "react-redux";
import {setName, setAge, increaseAge} from "../redux/actions";

const db = SQLite.openDatabase(
  {
    name: "MainDB",
    location: "default",
  },
  () => {},
  error => {
    console.log(error);
  },
);

const Home = ({navigation, route}) => {
  const {name, age} = useSelector(state => state.userReducer);
  const dispatch = useDispatch();

  // const [name, setName] = useState("");
  // const [age, setAge] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    try {
      db.transaction(tx => {
        tx.executeSql("SELECT Name, Age FROM Users", [], (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var userName = results.rows.item(0).Name;
            var userAge = results.rows.item(0).Age;
            dispatch(setName(userName));
            dispatch(setAge(userAge));
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateData = async () => {
    if (name.length != 0 && age.length != 0) {
      try {
        db.transaction(tx => {
          tx.executeSql(
            "UPDATE Users SET Name=?,Age=?",
            [name, age],
            () => {
              Alert.alert("Success!", "Your data has been updated.");
            },
            error => {
              console.log(error);
            },
          );
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      Alert.alert("Warning!", "Please enter your credentials.");
    }
  };

  const removeData = async () => {
    try {
      db.transaction(tx => {
        tx.executeSql(
          "DELETE FROM Users",
          [],
          () => {
            navigation.navigate("Login");
          },
          error => {
            console.log(error);
          },
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.body}>
      <Text style={[GlobalStyle.CustomFont, styles.text]}>
        Welcome back, {name}.
      </Text>
      <Text style={[GlobalStyle.CustomFont, styles.text]}>
        You are {age} years old.
      </Text>
      <TextInput
        style={styles.inputName}
        placeholder={"Enter new name"}
        onChangeText={value => dispatch(setName(value))}
      />

      <TextInput
        style={styles.inputAge}
        placeholder={"Enter new age"}
        onChangeText={value => dispatch(setAge(value))}
      />
      <CustomButton
        onPressFunction={updateData}
        title="Update"
        color="#ff7f00"
      />
      <CustomButton
        onPressFunction={removeData}
        title="Remove"
        color="#f40100"
        style={{marginTop: 10}}
      />
      <CustomButton
        onPressFunction={() => {
          dispatch(increaseAge());
        }}
        title="Increase Age"
        color="#0080ff"
        style={{marginTop: 10}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    margin: 10,
  },
  input: {
    width: 300,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    textAlign: "center",
    fontSize: 20,
    marginTop: 130,
    marginBottom: 10,
  },
  inputName: {
    width: 300,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 10,
    marginTop: 50,
  },
  inputAge: {
    width: 300,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    textAlign: "center",
    fontSize: 20,
    marginBottom: 20,
  },
});

export default Home;
