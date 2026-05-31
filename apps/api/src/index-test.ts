import express from 'express';
import { CourseSchema, type Course } from '@repo/shared';

const app = express();
app.use(express.json())

const PORT = process.env.API_PORT || 4000;
const courses: Course[] = [
    {
        id: 1,
        name: 'Course 1',
        description: 'Nisi incididunt ipsum nostrud aliquip magna excepteur laborum consectetur exercitation minim. Laborum sint magna labore velit. Deserunt fugiat minim adipisicing Lorem Lorem fugiat consequat duis culpa quis officia voluptate incididunt.'
    },
    {
        id: 2,
        name: 'Course 2',
        description: 'Dolore deserunt consectetur culpa fugiat excepteur non ea reprehenderit. Aute irure aute ipsum minim ea mollit. Fugiat Lorem proident enim laboris mollit amet adipisicing nisi irure exercitation. Voluptate ullamco amet officia nulla aliqua.'
    },
    {
        id: 3,
        name: 'Course 3',
        description: 'Lorem dolor deserunt ea amet ea in sit dolor et voluptate pariatur ut exercitation laboris. Adipisicing aute aute ut deserunt reprehenderit tempor ullamco aute quis minim. Voluptate et est mollit magna. Adipisicing et sunt ex excepteur dolor laboris. Ea magna labore in velit. Elit Lorem ipsum laborum Lorem elit excepteur pariatur enim esse enim veniam incididunt incididunt. Amet excepteur esse enim mollit laboris ea culpa duis.'
    }
]

app.disable('x-powered-by');

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {
    const course = findCourseById(Number.parseInt(req.params.id));
    if (!course) {
        return res
            .status(404)
            .send('Course not found');
    }

    const isWellFormed = CourseSchema.safeParse(course);

    if (!isWellFormed.success) return res.status(500).json({ error: 'Invalid api response'})
    res.send(course);
})

app.post('/api/courses', (req, res) => {
    const { error, data: courseData } = CourseSchema.safeParse(req.body);
    if (error) {
        return res
            .status(400)
            .send({ error: error.flatten() });
    }
    const course = {
        id: courses.length + 1,
        name: courseData.name,
        description: courseData.description
    };
    courses.push(course);
    res.send(course);
})

app.put('/api/courses/:id', (req, res) => {
    const course = findCourseById(Number.parseInt(req.params.id as string));
    if (!course) {
        return res.status(404).send('Course not found');
    }

    const {error, data: updatedCourseData} = CourseSchema.safeParse(req.body);
    if (error) {
        return res.status(400).send({ error: error.flatten() });
    }

    Object.assign(course, updatedCourseData);
    res.send(course);
})

app.delete('/api/courses/:id', (req, res) => {
    const course = findCourseById(Number.parseInt(req.params.id as string));
    if (!course) {
        return res.status(404).send('Course not found');
    }

    const index = courses.findIndex(c => c.id === course.id);
    courses.splice(index, 1);
    res.send(course);
})

app.listen(PORT, () => {
    console.log('API is running on port ' + (PORT));
})


function findCourseById(id: number): Course | undefined {
    return courses.find(c=> c.id === id);
}