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

function findCourse(req) {
    return courses.find(c => c.id === parseInt(req.params.id));
}

function getCourseId(req) {
    return parseInt(req.params.id);
}

app.get('/api/courses/:id', (req, res) => {
    const course = findCourse(req);
    if (!course) {
        return res.status(404).send(error404(getCourseId(req)));
    }
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const {error} = validateCourse(req.body);
    if (error)  {
        const concatenatedMessages = error.details.map(item => item.message).join(' ');
        return res.status(400).send(concatenatedMessages);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    let course = findCourse(req);
    if (!course) {
        return res.status(404).send(error404(getCourseId(req)));
    }

    const {error} = validateCourse(req.body);
    if (error)  {
        const concatenatedMessages = error.details.map(item => item.message).join(' ');
        return res.status(400).send(concatenatedMessages);
    }

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = findCourse(req);
    if (!course) {
        return res.status(404).send(error404(getCourseId(req)));
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const { error} = schema.validate(course);
    return { error };
}

function error404(id) {
    return `Course ${id} not found`;
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));