import React from 'react';

import * as SQLite from 'expo-sqlite'
import { Alert } from 'react-native';
const db = SQLite.openDatabase('db.testDb') // returns Database object

class DBHelper extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        name: "",
        password: "",
        dni: "",
      }
      // Check if the Users table exists if not create it
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, password TEXT, dni TEXT)'
        )
      })
    }

    getDataDB = (password, dni) => {
        db.transaction(tx => {
          tx.executeSql('SELECT password,name,dni FROM Users WHERE dni=?', 
          [dni], 
            (txObj, resultSet) => {
              var userPassword = resultSet.rows.item(0).password;
              var userDni = resultSet.rows.item(0).dni;
              var userNombre = resultSet.rows.item(0).name;
              this.state.password = userPassword;
              this.state.dni = userDni;
              this.state.name = userNombre;
            },
            (txObj, error) => console.log('Error ', error)
            );
      })
      console.log(this.state);
        if (this.state.password == password){
          return true
        } else {
          return false
        }
    }

      newItem = (name,password,dni,repassword) => {
        if (name.length == 0 || password.length == 0 || repassword.length == 0 || dni.length == 0){
            Alert.alert('Warning!', 'Debes completar todos los campos')
            return false
          } else if(password != repassword) {
            Alert.alert('Warning!', 'Las contraseñas no coinciden')
            return false
          } else {
              db.transaction(tx => {
                tx.executeSql(
                    'INSERT INTO Users (name, password, dni) values (?,?,?)', 
                    [name, password, dni],
                    (txObj, resultSet) => {
                    this.state.password = password;
                    this.state.dni = dni;
                    this.state.name = name;},
                    (txObj, error) => {console.log('Error', error)}
              )})
              console.log(this.state);
              return true
  }
}
}
  export default DBHelper