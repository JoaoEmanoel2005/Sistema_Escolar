const express = require('express');
const sqlite3 = require('sqlite3').verbose;
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.listen(port, () => {

console.log(`O servidor foi ativado e esta rodando em: http://localhost:${port}`);

});
