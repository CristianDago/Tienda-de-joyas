const { Pool } = require("pg");
const format = require('pg-format');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "cg9053",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});

const obtenerJoyas = async ({ limits = 10, order_by = "id_ASC", page = 1}) => {
    const [campo, direccion] = order_by.split("_");
    const offset = (page - 1) * limits; 
    const formattedQuery = format('SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s', campo, direccion, limits, offset);
    const { rows: joyas } = await pool.query(formattedQuery)
    return joyas;
};  

const buscarJoyas = async({ precio_min, precio_max, categoria, metal }) => {
    let filtros = [];
    const values = [];
  
    function agregarFiltros(campo, comparador, valor) {
      values.push(valor);
      const {length} = filtros
      filtros.push(`${campo} ${comparador} $${length + 1}`) 
    }
  
    if(precio_min) agregarFiltros('precio', '>=', precio_min);
    if(precio_max) agregarFiltros('precio', '<=', precio_max);
    if(categoria) agregarFiltros('categoria', '=', categoria);
    if(metal) agregarFiltros('metal', '=', metal);
  
    let consulta = 'SELECT * FROM inventario';
    if(filtros.length > 0) {
      filtros = filtros.join(' AND ');
      consulta += ` WHERE ${filtros}`
    };
  
    const { rows: joyas } = await pool.query(consulta, values);
  
    return joyas;
  };
    
  const prepararHATEOAS = (joyas) => {
    const results = joyas.map((j) => {
      return {
        name: j.nombre,
        href: `joyas/joya/${j.id}`,
      }
    }).slice(0, 4);
    const total = joyas.length
    const stock =  joyas.reduce((total, j) => total + j.stock, 0);
    const HATEOAS = {
      total,
      stock,
      results
    }
    return HATEOAS;
  };


module.exports = {obtenerJoyas, buscarJoyas, prepararHATEOAS}