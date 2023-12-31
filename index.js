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

function getCourseId(req) {
    return parseInt(req.params.id);
}

function findCourse(req) {
    return courses.find(c => c.id === getCourseId(req));
}

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const { error} = schema.validate(course);
    return { error };
}

function validateInput(req, res, next) {
    const { error } = validateCourse(req.body);
    if (error) {
        const concatenatedMessages = error.details.map(item => item.message).join(' ');
        return res.status(400).send(concatenatedMessages);
    }
    next();
}

function error404(id) {
    return `Course ${id} not found`;
}

app.get('/api/courses/:id', (req, res) => {
    const course = findCourse(req);
    if (!course) {
        return res.status(404).send(error404(getCourseId(req)));
    }
    res.send(course);
});

app.post('/api/courses', validateInput, (req, res) => {
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', validateInput, (req, res) => {
    let course = findCourse(req);
    if (!course) {
        return res.status(404).send(error404(getCourseId(req)));
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}.`));