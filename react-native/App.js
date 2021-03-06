import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Vibration, TouchableOpacity, Modal, Image, TextInput, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import { Camera } from 'expo-camera';
import axios from 'axios';
import * as SQLite from 'expo-sqlite'
import DBHelper from './components/DBHelper';
import {Share} from 'react-native';
import logo from './assets/logo.png'; 

const db = SQLite.openDatabase(
  {
    name: 'MainDB',
    location: 'default',
  },
  () => { },
  error => { console.error(error) }
);

const dbHelper = new DBHelper()

export default function App() {
  const [hasPermission, setHasPermission] = useState();
  const [type, setType] = useState(Camera.Constants.Type.front);

  const [modalCamara, setModalCamara] = useState(false);
  const [modalInicio, setModalInicio] = useState(false);
  const [modalSelfie, setModalSelfie] = useState(false);
  const [modalDNI, setModalDNI] = useState(false);
  const [modalFinalValido, setModalFinalValido] = useState(false);
  const [modalFinalInvalido, setModalFinalInvalido] = useState(false);
  const [modalCargando, setModalCargando] = useState(false);
  const [capturedPhotoDNI, setCapturedPhotoDNI] = useState(null);
  const [capturedPhotoSelfie, setCapturedPhotoSelfie] = useState(null);
  const [startCamara, setStartCamara] = useState(false);
  const [modalInicioValidado, setModalInicioValidado] = useState(false);
  const [modalLogin, setModalLogin] = useState(true);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRePassword] = useState("");
  const [dni, setDni] = useState("");
  const [saldo, setSaldo] = useState(1000);
  const [bitcoin, setBitcoin] = useState(0);
  const [ethereum, setEthereum] = useState(0);
  const [carga, setCarga] = useState(0);
  const [btcWallet, setBtcWallet] = useState("");
  const [ethWallet, setEthWallet] = useState("");
  const [modalCrypto, setModalCrypto] = useState(false);
  const [valorBtc, setValorBtc] = useState(50);
  const [valorEth, setValorEth] = useState(25);
  const [nuevoValorBtc, setNuevoValorBtc] = useState(0);
  const [nuevoValorEth, setNuevoValorEth] = useState(0);
  const [modalAdmin, setModalAdmin] = useState(false);
  const [valorVentaBtc, setValorVentaBtc] = useState(valorBtc*1.10)
  const [valorVentaEth, setValorVentaEth] = useState(valorEth*1.10)

  const shareMessage = (wallet, moneda) => {
    Share.share({
      message: 'CryptoFace. Te comparto mi wallet de '+moneda+': '+wallet
    })
      .then((result) => console.log(result))
      .catch((errorMsg) => console.log(errorMsg));
  };

  const cam = useRef();

  const getRandomString = () => {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    var length = 24;
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  const _takePicture = async () => {
    if (cam.current) {
      const option = { quality: 0.5, base64: true, skipProcessing: false };
      let photo = await cam.current.takePictureAsync(option);
      if (capturedPhotoSelfie == null) {
        setCapturedPhotoSelfie(photo);
        setModalSelfie(true);
      } else {
        setCapturedPhotoDNI(photo);
        setModalDNI(true);
      }
    }
  }


  const verificar = async () => {
    setModalCargando(true);
    cam.current.resumePreview();
    var newPhotoDni = {
      uri: capturedPhotoDNI.uri,
      type: 'image/jpeg',
      name: 'dni_front',
    };
    var newPhoto = {
      uri: capturedPhotoSelfie.uri,
      type: 'image/jpeg',
      name: 'photo',
    };
    var formData = new FormData();
    formData.append("dni_front", newPhotoDni);
    formData.append("photo", newPhoto);

    axios({
      method: "post",
      url: "http://192.168.0.31:8000/api/users/image_identification",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        setModalCargando(false);
        var data = JSON.stringify(response.data);
        var pos = data.search("Similarity");
        var respuesta = Number(data.substring(pos + 12, pos + 20));
        if (isNaN(respuesta) || respuesta < 80) {
          setModalFinalInvalido(true)
          Vibration.vibrate();
        } else {
          setModalFinalValido(true);
        }
      })
      .catch(function (response) {
        //handle error
        console.log("Ocurrio un error al validar");
        // modalInicio(true);
      });
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })(); setEthWallet(getRandomString()); setBtcWallet(getRandomString()) }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>

{modalLogin &&
<Modal>
    <View style={styles.container}>
    <Image source={logo} style={{ width: 200, height: 200, marginLeft: 100, marginTop: 40 }} />
        <Text style={{ textAlign: 'center', fontSize: 50 }}>CryptoFace </Text>
          <TextInput placeholder={"Ingresa tu DNI - ##.###.###"}
          onChangeText={(value) => setDni(value)}
          style={{ height: 42, width: "50%", borderBottomWidth: 1, marginLeft: 100, marginTop: "5%"}}
          />
          <TextInput secureTextEntry={true} placeholder={"Ingresa tu contrase??a"}
          onChangeText={(value) => setPassword(value)}
          style={{ height: 42, width: "50%", borderBottomWidth: 1, marginLeft: 100, marginTop: "5%"}}
          />
          <View style={{ marginTop: "10%", width: "50%"}}>
            <TouchableOpacity style={{ borderWidth: 1, height: 42, width: "80%", marginLeft: 200, 
                                       justifyContent: "center", alignItems: "center", borderRadius: 40
                                       , alignSelf: "center", textAlign: "center"}}
                                       onPress={()=> {
                                         if (dbHelper.getDataDB(password,dni)){
                                          if (dni == 'admin'){
                                            setModalLogin(false);
                                            setModalAdmin(true);
                                          } else {
                                            setModalLogin(false);
                                            setModalInicio(true);}
                                         } else {
                                           Vibration.vibrate(); 
                                           Alert.alert('Error!','Los datos ingresados no son correctos.')
                                          }
                                        }
                                      }
                                       >
            <Text style={{ color: "black" }}>Iniciar sesion</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={()=> {setModalLogin(false); setModalRegistro(true);}}>
              <Text style={{ marginLeft: 100, marginTop: "5%" }}>No tienes cuenta? Registrate.</Text>
            </TouchableOpacity>
          </View>
      </View>
</Modal>
}

{modalRegistro &&
<Modal>
<View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 150, fontSize: 50 }}>Registro </Text>
          <TextInput placeholder={"Ingresa tu nombre"}
          onChangeText={(value) => setNombre(value)}
          style={{ height: 42, width: "50%", borderBottomWidth: 1, marginLeft: 100, marginTop: "5%"}}
          />
          <TextInput secureTextEntry={true} placeholder={"Ingresa tu contrase??a"}
          onChangeText={(value) => setPassword(value)}
          style={{ height: 42, width: "50%", borderBottomWidth: 1, marginLeft: 100, marginTop: "5%"}}
          />
          <TextInput secureTextEntry={true} placeholder={"Repite tu contrase??a"}
          onChangeText={(value) => setRePassword(value)}
          style={{ height: 42, width: "50%", borderBottomWidth: 1, marginLeft: 100, marginTop: "5%"}}
          />
           <TextInput placeholder={"Ingresa tu dni - Con puntos: ##.###.###"}
          onChangeText={(value) => setDni(value)}
          style={{ height: 42, width: "50%", borderBottomWidth: 1, marginLeft: 100, marginTop: "5%"}}
          />
          <View style={{ marginTop: "10%", width: "50%"}}>
            <TouchableOpacity style={{ borderWidth: 1, height: 42, width: "80%", marginLeft: 200, 
                                       justifyContent: "center", alignItems: "center", borderRadius: 40
                                       , alignSelf: "center", textAlign: "center"}}
                                       onPress={()=> {
                                        if (dbHelper.newItem(nombre,password,dni,repassword)){
                                          setModalRegistro(false);
                                          setModalLogin(true);
                                         } // else { 
                                        //   Vibration.vibrate();
                                        //   Alert.alert('Error!','Los datos ingresados no son correctos.')
                                        //  }
                                       }
                                     }
                                       >
            <Text style={{ color: "black" }}>Registrarse</Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={()=> {setModalRegistro(false); setModalLogin(true);} }>
              <Text style={{ marginLeft: 100, marginTop: "5%" }}>Ya tienes cuenta? Inicia sesion.</Text>
            </TouchableOpacity>
          </View>
      </View>
</Modal>
}

{modalInicio &&
<Modal>
    <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 300, fontSize: 50 }}>Dashboard usuario sin validar</Text>
    </View>
    <TouchableOpacity style={{ marginLeft: 130 }} onPress={() => { setModalCamara(true); setStartCamara(true); setModalInicio(false) }}>
            <MaterialIcons style={{ marginLeft: 50, marginTop: 30}} name="assignment-ind" size={40} color={"#008000"} />
            <Text style={{fontSize: 18, color: 'black', marginRight: 100}}>Validar identidad</Text>
    </TouchableOpacity>
</Modal>
}

{modalInicioValidado &&
<Modal>
    <ScrollView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 20 }}>CryptoFace - Dashboard</Text>
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 25 }}>Saldo en dolares: U$S {saldo}</Text>
        <Text style={{ textAlign: 'center', marginTop: 60, fontSize: 25 }}>Recarga tu saldo:</Text>
        <TextInput placeholder={"Cuanto queres recargar?"}
          onChangeText={(value) => setCarga( parseInt(value, 10))}
          keyboardType='numeric'
          style={{ textAlign: 'center', width: "45%", borderBottomWidth: 1, marginLeft: 120, marginTop: "2%"}}
          />
        <TouchableOpacity style={{ marginLeft: 140 }} onPress={() => setSaldo(saldo+carga)}>
            <MaterialIcons style={{ marginLeft: 50, marginTop: 10}} name="control-point" size={35} color={"#008000"} />
            <Text style={{fontSize: 14, color: 'black', marginLeft: 25}}>Carga Saldo</Text>
        </TouchableOpacity>

        <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => {setModalInicioValidado(false); setModalCrypto(true);}}
              >
              <Text style={styles.buttonTextStyle}>
                Comprar Crypto
              </Text>
        </TouchableOpacity>

        </ScrollView>
</Modal>
}

{modalAdmin &&
  <Modal>
    <ScrollView>
      <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 30 }}>Admin Dashboard</Text>
      <Text style={{ marginTop: 50, fontSize: 15, marginLeft: 20 }}>Valor actual del BTC: {valorBtc}</Text>
      <Text style={{ marginTop: 10, fontSize: 15, marginLeft: 20 }}>Valor actual del ETH: {valorEth}</Text>
      <ScrollView contentContainerStyle={{ flexDirection: 'row'}}>
        <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 25, marginLeft: 100 }}>Valor BTC:</Text>
        <TextInput
            style={{ textAlign: 'center', width: "15%", marginLeft: 10, borderBottomWidth: 1}}
            onChangeText={(nuevoValorBtc) => setNuevoValorBtc(parseInt(nuevoValorBtc,10))}
        />
      </ScrollView>
      <TouchableOpacity style={{ marginLeft: 140 }} onPress={() => {setValorBtc(nuevoValorBtc); setValorVentaBtc(nuevoValorBtc*1.10)}}>
            <MaterialIcons style={{ marginLeft: 50, marginTop: 10}} name="control-point" size={35} color={"#008000"} />
            <Text style={{fontSize: 14, color: 'black', marginLeft: 25}}>Modificar BTC</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ flexDirection: 'row'}}>
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 25, marginLeft: 100 }}>Valor ETH:</Text>
        <TextInput
            style={{ textAlign: 'center', width: "15%", marginLeft: 10, borderBottomWidth: 1, marginTop: "2%"}}
            onChangeText={(nuevoValorEth) => setNuevoValorEth(parseInt(nuevoValorEth,10))}
        />
      </ScrollView>
      <TouchableOpacity style={{ marginLeft: 140 }} onPress={() => {setValorEth(nuevoValorEth); setValorVentaEth(nuevoValorEth*1.10)}}>
            <MaterialIcons style={{ marginLeft: 50, marginTop: 10}} name="control-point" size={35} color={"#008000"} />
            <Text style={{fontSize: 14, color: 'black', marginLeft: 25}}>Modificar ETH</Text>
      </TouchableOpacity>
      <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() => {setModalAdmin(false); setModalCrypto(true);}}
              >
              <Text style={styles.buttonTextStyle}>
                Comprar Crypto
              </Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} style={styles.buttonLogOut} onPress={() => {setModalAdmin(false); setModalLogin(true);}} >
        <Text style={styles.buttonTextLogOut}>Cerrar sesion</Text>
      </TouchableOpacity>
    </ScrollView>
  </Modal>
}

{modalCrypto &&
  <Modal>
    <ScrollView>
    <Text style={{ textAlign: 'center', marginTop: 40, fontSize: 25 }}>Saldo en dolares: U$S {saldo}</Text>
    <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 15 }}>Bitcoin - Precio de compra: U$S {valorBtc}</Text>
        <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 15 }}>Bitcoin - Precio de venta: U$S {valorVentaBtc.toFixed(0)}</Text>
        <ScrollView contentContainerStyle={{ flexDirection: 'row'}}>
        <TouchableOpacity style={{ marginLeft: 90 }} onPress={() => {if (saldo < valorBtc) {
          Vibration.vibrate();
          Alert.alert('Banca!', 'No tenes saldo suficiente');
        } else {
          setSaldo(saldo-valorBtc); setBitcoin(bitcoin+1)}}
          }>
            <MaterialIcons style={{ marginLeft: 35, marginTop: 10}} name="add-circle-outline" size={35} color={"#008000"} />
            <Text style={{fontSize: 14, color: 'black'}}>Comprar BTC</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {if (bitcoin < 1) {
          Vibration.vibrate();
          Alert.alert('Banca!', 'No tenes saldo suficiente.');
        } else {
          setSaldo(saldo+48); setBitcoin(bitcoin-1)}}
          }>
            <MaterialIcons style={{ marginLeft: 35, marginTop: 10, marginLeft: 40}} name="remove-circle-outline" size={35} color={"red"} />
            <Text style={{fontSize: 14, color: 'black', marginLeft: 20}}>Vender BTC</Text>
        </TouchableOpacity>
        </ScrollView>
        <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 15, fontWeight: "bold" }}>Saldo en Bitcoins: {bitcoin}</Text>
        <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>BTC Wallet: {btcWallet}</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.buttonStyle}
            onPress={() => shareMessage(btcWallet,'BTC')}
            >
            <Text style={styles.buttonTextStyle}>
              BTC - Compartir tu wallet
            </Text>
          </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 15 }}>Ethereum - Precio de compra: U$S {valorEth}</Text>
        <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 15 }}>Ethereum - Precio de venta: U$S {valorVentaEth.toFixed(0)}</Text>
        <ScrollView contentContainerStyle={{ flexDirection: 'row'}}>
        <TouchableOpacity style={{ marginLeft: 90 }} onPress={() => {if (saldo < valorEth) {
          Vibration.vibrate();
          Alert.alert('Banca!', 'No tenes saldo suficiente');
        } else {
          setSaldo(saldo-valorEth); setEthereum(ethereum+1)}}
          }>
            <MaterialIcons style={{ marginLeft: 35, marginTop: 10}} name="add-circle-outline" size={35} color={"#008000"} />
            <Text style={{fontSize: 14, color: 'black'}}>Comprar ETH</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {if (ethereum < 1) {
          Vibration.vibrate();
          Alert.alert('Banca!', 'No tenes saldo suficiente.');
        } else {
          setSaldo(saldo+21); setEthereum(ethereum-1)}}
          }>
            <MaterialIcons style={{ marginLeft: 35, marginTop: 10, marginLeft: 40}} name="remove-circle-outline" size={35} color={"red"} />
            <Text style={{fontSize: 14, color: 'black', marginLeft: 20}}>Vender ETH</Text>
        </TouchableOpacity>
        </ScrollView>
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 15, fontWeight: 'bold' }}>Saldo en Ethereum: {ethereum}</Text>
        <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>ETH Wallet: {ethWallet}</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonStyle} onPress={() => shareMessage(ethWallet,'ETH')} >
          <Text style={styles.buttonTextStyle}>ETH - Compartir tu wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonDashboard} onPress={() => {setModalCrypto(false); setModalInicioValidado(true);}} >
          <Text style={styles.buttonTextDashboard}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.buttonLogOut} onPress={() => {setModalCrypto(false); setModalLogin(true);}} >
          <Text style={styles.buttonTextLogOut}>Cerrar sesion</Text>
        </TouchableOpacity>
    </ScrollView>
  </Modal>
}

{startCamara &&
<Modal animationType="slide" transparent={false} visible={modalCamara}>
            <Camera ref={cam} style={styles.camera} type={type}>
              <View style={styles.buttonContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', alignContent: 'center' }}>
                  <View>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => _takePicture()}>
                      <MaterialIcons name="camera" size={60} color={"#fff"} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Camera>
            </Modal>
}

{capturedPhotoSelfie &&
  <Modal animationType="slide" transparent={false} visible={modalSelfie}>
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', margin: 20 }}>
      <Image style={{ width: '100%', height: 300, borderRadius: 20 }}
        source={{ uri: capturedPhotoSelfie.uri }}>
      </Image>
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <TouchableOpacity style={{ margin: 10 }} onPress={() => { setModalSelfie(false); setCapturedPhotoSelfie(null) }}>
            <MaterialIcons name="arrow-back" size={40} color={"#FF0000"} />
            <Text style={styles.text}>Volver a tomar selfie</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => { setModalSelfie(false); setType(Camera.Constants.Type.back) }}>
            <MaterialIcons name="check" size={40} color={"#008000"} />
            <Text style={styles.text}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
}

{capturedPhotoDNI &&
  <Modal animationType="slide" transparent={false} visible={modalDNI}>
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', margin: 20 }}>
      <Image style={{ width: '100%', height: 300, borderRadius: 20 }}
        source={{ uri: capturedPhotoDNI.uri }}>
      </Image>

      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <TouchableOpacity style={{ margin: 10 }} onPress={() => { setModalDNI(false); setCapturedPhotoDNI(null) }}>
            <MaterialIcons name="arrow-back" size={40} color={"#FF0000"} />
            <Text style={styles.text}>Volver a tomar DNI</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => { setModalDNI(false); verificar(); setType(Camera.Constants.Type.front) }}>
            <MaterialIcons name="check" size={40} color={"#008000"} />
            <Text style={styles.text}>Contiunar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
}

{modalFinalValido &&
  <Modal animationType="slide" transparent={false} visible={modalFinalValido}>
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', margin: 25 }}>
      <MaterialIcons name="check-circle" size={300} color={"#008000"} />
      <Text style={{textAlign:'center'}}>Su identidad fue validada.</Text>
    </View>
    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-end' }}>
      <View>
        <TouchableOpacity style={{ margin: 10 }} onPress={() => { setModalFinalValido(false); setCapturedPhotoDNI(null); setCapturedPhotoSelfie(null), setModalInicioValidado(true); setModalInicio(false); }}>
          <MaterialIcons name="repeat" size={40} color={"#008000"} />
          <Text>Ir al Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
}

{modalFinalInvalido &&
  <Modal animationType="slide" transparent={false} visible={modalFinalInvalido}>
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', margin: 25 }}>
      <MaterialIcons name="error" size={300} color={"#FF0000"} />
      <Text style={{textAlign:'center'}}>No se pudo validar su identidad.</Text>
    </View>
    <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'flex-end' }}>
      <View>
        <TouchableOpacity style={{ margin: 10 }} onPress={() => { setModalFinalInvalido(false); setCapturedPhotoDNI(null); setCapturedPhotoSelfie(null); }}>
          <MaterialIcons name="repeat" size={40} color={"#008000"} /><Text>Volver a intentar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
}

{modalCargando &&
  <Modal animationType="slide" transparent={false} visible={modalCargando}>
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', margin: 25 }}>
      <MaterialIcons name="cloud-upload" size={300} color="black" />
      <Text style={{textAlign:'center'}}>Cargando imagenes...</Text>
    </View>
  </Modal>
}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'flex-end', alignContent: 'center',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonDashboard: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 10,
    backgroundColor: 'black',
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextDashboard: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18
  },
  buttonLogOut: {
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextLogOut: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18
  }
});