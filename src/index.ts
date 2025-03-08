import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Limit payload size to prevent large data attacks
app.use(express.json({ limit: '1mb' }));

interface WebhookPayload {
    secretCode?: string;
    data?: Record<string, any>;
}

const storePayload = (data: object) => {
    const filePath = path.join(__dirname, 'payload.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

app.post('/webhook', (req: Request, res: Response) => {
    const payload = req.body as WebhookPayload;

    if (!payload.secretCode || typeof payload.secretCode !== 'string') {
        console.log('Invalid payload format', payload);
        // return res.status(400).send({ error: 'Invalid payload format' });
    }

    if (payload.data && typeof payload.data !== 'object') {
        console.log('Invalid data format', payload.data);
        // return res.status(400).send({ error: 'Invalid data format' });
    }

    storePayload(payload);

    res.status(200).send({ message: 'Payload received successfully!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Webhook server is running at http://localhost:${PORT}/webhook`);
});
