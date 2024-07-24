import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd(), 'public', 'images');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const form = new IncomingForm({
            uploadDir,
            keepExtensions: true,
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            const fileArray = files.image;
            const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const newFilePath = path.join(uploadDir, file.newFilename);

            fs.renameSync(file.filepath, newFilePath);

            const imageUrl = `/images/${file.newFilename}`;
            return res.status(200).json({ imageUrl });
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
};

export default handler;
