const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "cg9053",
    database: "farmacia",
    port: 5432,
    allowExitOnIdle: true
});


const obtenerPersonal = async ({limit = 10}) => {

    const consulta = "SELECT * FROM personal LIMIT $1";
    const valores = [limit];
    const { rows } = await pool.query(consulta, valores); 
    return rows; 

};

module.exports = {obtenerPersonal};