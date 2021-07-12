# FaceCrypto

Proyecto universitario. Aplicacion para la simulacion de compra y venta de criptomonedas. Requiere la validacion de identidad basado en reconocimiento facial con una imagen del rostro y otra del DNI, para poder realizar transacciones.

Tanto en el backend como el frontend primero es necesario correr "npm install" para descargar dependencias por primera vez.

## /node/.env

Debemos crear un archivo .env en /node/.env con los siguientes datos:

//AWS

AWS_S3_ACCESS_KEY=

AWS_S3_SECRET_KEY=

AWS_S3_BUCKET=

AWS_S3_BUCKET_IDENTIFICATION_FOLDER=identification

//Completar los datos con la informacion de acceso de IAM de AWS (Requiere full access para S3 y Rekognition)

## Datos de la API - /react-native/App.js

En este caso el servicio esta corriendo localmente apuntando a nuestra ip privada de la PC.

![image](https://user-images.githubusercontent.com/43970345/125346464-2eeab080-e330-11eb-8b6b-588def3a152b.png)

## Iniciar backend
### Desde node/

npm start

## Iniciar frontend
### Desde react-native/

expo start --android // En el caso de probarlo en un dispositivo android
