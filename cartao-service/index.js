var app = require('./src/config/custom-express')();


//Important: use process.env.PORT as the port and process.env.IP as the host in your scripts!
//Important: use process.env.PORT as the port and process.env.IP as the host in your scripts!
app.listen(process.env.PORT, process.env.IP, 1, () => {
  console.log('Servidor rodando na porta: '+ process.env.PORT);
});



// *******************************************************