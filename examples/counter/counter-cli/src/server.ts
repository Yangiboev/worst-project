import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { createLogger } from './logger-utils.js';
import { DevnetRemoteConfig } from './config.js';
import * as api from './api.js';
export const currentDir = path.resolve(new URL(import.meta.url).pathname, '..');


const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const config = new DevnetRemoteConfig();
const logger = await createLogger(config.logDir);
api.setLogger(logger)

// Serve static files
app.use(express.static(path.resolve(currentDir, '..', 'public')));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.resolve(currentDir, '..', 'public'));
});

app.get('/seed/:seed', (req: Request, res: Response) => {
    const {seed} = req.params
    console.log(seed)
    res.sendFile(path.resolve(currentDir, '..', 'public'));
});

interface FormData {
    seed: string;
}

app.post('/submit-seed', async (req: Request, res: Response) => {
    const {  seed }: FormData = req.body;
    console.log('Form submission received:');
    console.log('Name:', seed);

    res.redirect(`/seed/${seed}`)
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
