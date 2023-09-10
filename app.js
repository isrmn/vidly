import express from 'express';
import Joi from "joi";

const app = express();
app.use(express.json());

const PATH = '/api/genres';
const PATH_TO_RESOURCE = PATH + '/:id';

const genres = [
    {id: 1, name: 'rock'},
    {id: 2, name: 'pop'},
    {id: 3, name: 'jazz'}
];

function getGenreId(req) {
    return parseInt(req.params.id);
}

function findGenre(req) {
    return genres.find(c => c.id === getGenreId(req));
}

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const { error} = schema.validate(genre);
    return { error };
}

function validateInput(req, res, next) {
    const { error } = validateGenre(req.body);
    if (error) {
        const concatenatedMessages = error.details.map(item => item.message).join(' ');
        return res.status(400).send(concatenatedMessages);
    }
    next();
}

function error404(id) {
    return `Genre with ID ${id} not found`;
}

app.get('/', (req, res) => {
    res.send('Hallö Wörld!');
});

app.get(PATH, (req, res) => {
    res.send(genres);
});

app.get(PATH_TO_RESOURCE, (req, res) => {
    const genre = findGenre(req);
    if (!genre) {
        return res.status(404).send(error404(getGenreId(req)));
    }
    res.send(genre);
});

app.post(PATH, validateInput, (req, res) => {
    const genre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(genre);
    res.send(genre);
});

app.put(PATH_TO_RESOURCE, validateInput, (req, res) => {
    let genre = findGenre(req);
    if (!genre) {
        return res.status(404).send(error404(getGenreId(req)));
    }

    genre.name = req.body.name;
    res.send(genre);
});

app.delete(PATH_TO_RESOURCE, (req, res) => {
    const genre = findGenre(req);
    if (!genre) {
        return res.status(404).send(error404(getGenreId(req)));
    }

    const index = genres.indexOf(genre);
    genres.splice(index, 1);

    res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));