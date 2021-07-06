const Sequelize = require('sequelize');
const {authSeeder} = require('./seeders/AuthSeeder')
const { DBURL } = require('./index')

// const sequelize = new Sequelize(DBURL);

// sequelize.sync()
//     .then(async () => {
//         console.warn('Conexion con MySql mediante Sequelize')
        
//         await authSeeder()

//         return console.warn('Migration success');
//     }).catch( (error: any) => {
//         console.log(error)
//     })

// export default sequelize