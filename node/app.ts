import express = require('express')
import dotenv = require('dotenv')
const bodyParser = require('body-parser')
import http = require('http')
const {
    multerI,
    multerImages
} = require('./src/modules/middleware/multer')
const corsMiddleware = require('./src/modules/middleware/corsMiddleware')
import {
    logRequest,
    logError
} from './src/modules/logger/logger'
const {
    AWS_S3_BUCKET_AVATAR_FOLDER,
    AWS_S3_BUCKET_FOLDER,
    AWS_S3_BUCKET_IDENTIFICATION_FOLDER,
    AWS_S3_ACCESS_KEY,
    AWS_S3_SECRET_KEY
} = require('./config')
const {
    MessageResponse
} = require('./src/helpers/messageResponse')
const {
    uploadS3,
    uploadMultipleFilesS3
} = require('./config/aws')
const AWS = require('aws-sdk');

const app = express()
let server = http.createServer(app)
dotenv.config()

//Routes
// const authRoutes = require('./src/modules/auth/routes')

const port = process.env.PORT_BACKEND || 8000

//Swagger
// const swaggerUi = require('swagger-ui-express')
// const swaggerDocs = require(process.env.NODE_ENV == "development" ? '../swagger/swagger.json' : './swagger/swagger.json')

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use(function (err: any, req: any, res: any, next: any) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

//CORS Middleware
app.use(corsMiddleware)

//Body Parse
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//AUTH Middleware
// app.use(jwtAuth)
// app.use(handleAuthError)

//RBAC Middleware
// app.use(rbacMiddleware)

const randomString = () => {
    const possible: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomNumber: string = '0';
    for (let i = 0; i < 6; i++) {
        randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randomNumber;
};

//Routes
app.post('/api/users/image_identification', multerImages, async function (req: any, res: any) {

    let response = logRequest(req)
    try {

        let dniFront
        let photoFile: any

        const { files } = req
        console.log('files ===>', files)
        if(!files) return res.status(400).send()
        
        files.forEach((file: any)  => {
            if (file.fieldname == 'dni_front') {
                dniFront = file
            } else if (file.fieldname == 'photo'){
                photoFile = file
            }
        });
        //Inicializamos la instancia de AWS Rekognition 
        const rekognition = new AWS.Rekognition({
            accessKeyId: AWS_S3_ACCESS_KEY,
            secretAccessKey: AWS_S3_SECRET_KEY,
            region: 'us-east-2',
            apiVersion: '2016-06-27'
        });


        const dniUrl = randomString()
        const photoUrl = randomString()


        await uploadS3(dniFront, AWS_S3_BUCKET_IDENTIFICATION_FOLDER, async (err: any, data: any) => {
            //an error occurred while uploading the file

            console.log(data)
            if (err) {
                return console.error(res)
            }

            await uploadS3(photoFile, AWS_S3_BUCKET_IDENTIFICATION_FOLDER, async (err: any, data: any) => {
                //an error occurred while uploading the file
                if (err) {
                    return console.error(res)
                }
    
                // Usando un FileStream para enviar a AWS
                const params = {
                    SimilarityThreshold: 0, 
                    SourceImage: {
                        S3Object: {
                            Bucket: "am-utn-frlp", 
                            Name: AWS_S3_BUCKET_IDENTIFICATION_FOLDER+'/'+dniUrl
                        }
                    }, 
                    TargetImage: {
                        S3Object: {
                            Bucket: "am-utn-frlp", 
                            Name: AWS_S3_BUCKET_IDENTIFICATION_FOLDER+'/'+photoUrl
                        }
                    }
                }

                const paramsText = {
                    Image: {
                        S3Object: {
                            Bucket: "am-utn-frlp", 
                            Name: AWS_S3_BUCKET_IDENTIFICATION_FOLDER+'/'+dniUrl
                        }
                    }
                }
    
                // Solicitamos el reconocimiento a AWS
                await rekognition.compareFaces(params, async function(err: any, data: any) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(data);

                    const texts = await rekognition.detectText(paramsText).promise();
                    const detections = texts.TextDetections.map((detects: any)=> detects.DetectedText)
                    
                    let resp = {
                        face: data,
                        text: detections
                    }

                    response.data = resp
                    //console.log(detections);
                    if (detections.includes('NICOLAS') && 
                    detections.includes('GALINANES') && 
                    detections.includes('39.096.325')) {
                        res.status(200).send(response)
                        console.log("Este es el DNI de Nicolas Galinanes")
                    } else {
                        res.status(200).send(response)
                        console.log("Este no es el DNI de Nicolas Galinanes")
                    }
                    
                    //res.status(200).send(response)
                });
    
            }, photoUrl)

        }, dniUrl)

        

    } catch (error: any) {
        console.log(error)
        logError(req, error)
        response.errors.push(error)
        res.status(500).send(response)
    }
})

app.get('/', (req: any, res: any) => { res.send("Hello, listening port: "+process.env.PORT_BACKEND) })
server.listen(port, () => console.log('Listening port: ' + port))