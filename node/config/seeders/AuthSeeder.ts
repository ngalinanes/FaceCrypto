import bcryptjs from "bcryptjs"
const db = require('../../src/modules/db').default

export const authSeeder = async () => {

    let salt = bcryptjs.genSaltSync(10)
    let hashPassword = bcryptjs.hashSync('123123', salt)

    await db.identification_types.bulkCreate([{
            type: 'dni',
        },
        {
            type: 'ci',
        },
        {
            type: 'lc',
        },
        {
            type: 'le',
        },
        {
            type: 'pasaporte',
        }
    ]);

    await db.genders.create({
        name: 'masculino',
    });
    await db.genders.create({
        name: 'femenino',
    });

    await db.roles.create({
        name: 'admin',
    });
    await db.roles.create({
        name: 'user',
    });

    await db.users.create({
        email: 'admin@gmail.com',
        name: 'admin',
        lastname: 'root',
        password: hashPassword,
        gender_id: 1,
        role_id: 1,
        active: 1,
    });
    await db.users.create({
        email: 'martin@tixcode.co',
        name: 'Martin',
        lastname: 'Tito',
        password: hashPassword,
        identification_number: 41801012,
        gender_id: 1,
        role_id: 1,
        active: 1,
    });
}