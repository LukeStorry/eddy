'use strict';
import { existsSync, readFile, readdirSync } from 'fs';
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
	const imageDirPath = getImageFilepath('x').split('x')[0];
	const files = readdirSync(imageDirPath)
		.filter((p) => {
			return p.endsWith('.jpg') || p.endsWith('.png');
		})
		.map((p) => p.replace('.jpg', '').replace('.png', ''));

	for (const imageName of files) {
		readFile(getImageFilepath(imageName), (err, buffer) => {
			if (err) {
				console.log(err.message);
				return;
			}
			optimise(buffer, getImageFilepath(imageName));
			console.log(`Image ${imageName} optimized successfully`);
		});
	}
}

// Run standalone optimisation if run directly
if (import.meta.url.slice(-10) === process.argv[1].slice(-10)) {
	optimiseAllImages();
}
