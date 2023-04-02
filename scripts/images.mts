'use strict';
import { existsSync, readFile } from 'fs';
import fetch from 'node-fetch';
import sharp from 'sharp';

const getImageFilepath = (id: string) => `./static/images/${id}.png`;

export async function downloadImage(imageUrl: string, id: string) {
	const filepath = getImageFilepath(id);
	if (existsSync(filepath)) {
		console.info(`Image ${id} already exists at path ${filepath}, skipping download`);
		return filepath.replace('./static', '');
	}

	const response = await fetch(imageUrl);
	if (!response.ok) {
		throw new Error(
			`Failed to download image ${id} with status ${response.status} from ${imageUrl} `
		);
	}
	const buffer = await response.buffer();
	await optimise(buffer, filepath);

	console.log(`Image ${id} downloaded and optimized successfully`);
	return filepath.replace('./static', '');
}

function optimise(buffer: Buffer, filepath: string) {
	return sharp(buffer).png({ quality: 80 }).rotate().resize(600, 600).toFile(filepath);
}

async function optimiseAllImages() {
	for (let i = 1; i <= 50; i++) {
		const filepath = getImageFilepath(i.toString());
		readFile(filepath, (err, buffer) => {
			if (err) {
				console.log(err.message);
				return;
			}
			optimise(buffer, filepath);
			console.log(`Image ${i} optimized successfully`);
		});
	}
}

// Run standalone optimisation if run directly
if (import.meta.url.slice(-10) === process.argv[1].slice(-10)) {
	optimiseAllImages();
}
