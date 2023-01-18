const express = require('express')
const app = express()
app.listen(3000, console.log('Server ON'))

const { obtenerJoyas, buscarJoyas, prepararHATEOAS } = require('./consultas')


app.use((req, res, next) => {
  const parametros = req.query;
  const url = req.url;
  console.log(`
  Hoy ${new Date()}
  Se ha recibido una consulta en la ruta ${url}
  con los parámetros:`, parametros);
  return next();
});

app.get('/joyas', async (req, res) => {

try {
const queryStrings = req.query;
const joyas = await obtenerJoyas(queryStrings);
const HATEOAS = await prepararHATEOAS(joyas)
res.json(HATEOAS); 
} catch {
  throw err;
}

})

app.get('/joyas/filtros', async (req, res) => {

  try {
  const queryStrings = req.query;
  const joyas = await buscarJoyas(queryStrings);
  res.json(joyas); 
  } catch {
    throw err;
}
  
})

