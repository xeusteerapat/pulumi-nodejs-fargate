const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.send({
    status: 'OK',
    message: 'Hello, Pulumi!',
  });
});

app.listen(80, () => console.log('server is running...'));
