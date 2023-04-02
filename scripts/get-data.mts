'use strict';

import { google } from 'googleapis';
import { writeFileSync } from 'fs';
import dotenv from 'dotenv';
import { downloadAndOptimizeImage } from './images.mjs';
dotenv.config();

const { SHEET_ID, API_KEY } = process.env;
const dataFilepath = './src/data.json';

const sheets = google.sheets({ version: 'v4', auth: API_KEY });

async function main() {
	const response = await sheets.spreadsheets.values.get({
		spreadsheetId: SHEET_ID,
		range: 'A1:G73'
	});

	const rows = response.data.values;
	const headers = rows?.shift()?.map((header) => header.toLowerCase().replace(/ /g, '_'));

	if (!rows || !headers) {
		throw new Error(`Spreadsheets call failed. ${response.status}`);
	}

	const data = rows.map((row, index) => {
		const item: { [key: string]: string } = { id: (index + 1).toString() };
		headers.forEach((header, col) => {
			if (['photo', 'ifttt_share_url'].includes(header)) return;
			item[header] = row[col];
		});
		return item;
	});

	const json = JSON.stringify(data, null, 2);
	writeFileSync(dataFilepath, json, 'utf8');
	console.log(`Data saved to ${dataFilepath}`);

	await Promise.all(data.map(async (item) => downloadAndOptimizeImage(item.photo_url, item.id)));
}

main();
