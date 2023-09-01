import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('Hallö Wörld!');
});

app.get('/api/courses', (req, res) => {
    res.send([1,2,3]);
});

app.get('/api/courses/:year/:month', (req, res) => {
    res.send(req.query);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));