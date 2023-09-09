import express from 'express';
import Joi from "joi";

const app = express();
app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'}
];

app.get('/', (req, res) => {
    res.send('Hallö Wörld!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send(`Course ${req.params.id} not found`)
        return;
    }
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);
    if (error)  {
        const concatenatedMessages = error.details.map(item => item.message).join(' ');
        res.status(400).send(concatenatedMessages);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) {
        res.status(404).send(`Course ${req.params.id} not found`)
        return;
    }

    const {error} = validateCourse(req.body);
    if (error)  {
        const concatenatedMessages = error.details.map(item => item.message).join(' ');
        res.status(400).send(concatenatedMessages);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const { error, value } = schema.validate(course);
    return { error, value };
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));