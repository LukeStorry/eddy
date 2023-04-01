'use strict';

import { google } from 'googleapis';
import fs from 'fs';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import imagemin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
dotenv.config();

const { SHEET_ID, API_KEY } = process.env;
const dataFilepath = 'data.json';
const imagesFilepath = 'src/lib/images';

const sheets = google.sheets({ version: 'v4', auth: API_KEY });

async function main() {
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: 'A1:G73'
	});

	const rows = response.data.values;
	const headers = rows.shift().map((header) => header.toLowerCase().replace(/ /g, '_'));

	const data = rows.map((row) => {
		const item = {};
		headers.forEach((header, index) => {
			item[header] = row[index];
		});
		return item;
	});

	const json = JSON.stringify(data, null, 2);
	fs.writeFileSync(dataFilepath, json, 'utf8');
	console.log(`Data saved to ${dataFilepath}`);

	await Promise.all(
		data.map(async (item, index) => {
			const response = await fetch(item.photo_url);
			if (!response.ok) {
				console.error(
					`Failed to download image ${index}, status ${response.status}, ${item.photo_url}`
				);
				return;
			}
			const buffer = await response.buffer();
			const optimizedBuffer = await imagemin.buffer(buffer, {
				plugins: [imageminPngquant({ quality: [0.6, 0.8], strip:true })]
			});
			fs.writeFileSync(`${imagesFilepath}/${index}.png`, optimizedBuffer);
			console.log(`Image ${index} downloaded successfully`);
		})
	);
}

main();
