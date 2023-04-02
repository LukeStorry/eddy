'use strict';

import { google } from 'googleapis';
import { writeFileSync } from 'fs';
import { downloadImage } from './images.mjs';
import type { LocationInfo } from '../src/lib/types';
import dotenv from 'dotenv';
dotenv.config();

const { SHEET_ID, GOOGLE_API_KEY } = process.env;
const dataFilepath = './src/data.json';

const sheets = google.sheets({ version: 'v4', auth: GOOGLE_API_KEY });

async function main() {
	const response = await sheets.spreadsheets.values
		.get({
			spreadsheetId: SHEET_ID,
			range: 'A1:G100',
			valueRenderOption: 'UNFORMATTED_VALUE',
			dateTimeRenderOption: 'FORMATTED_STRING'
		})
		.catch((e) => {
			throw new Error(e.message);
		});

	const rows = response.data.values;

	if (!rows) {
		throw new Error(`Spreadsheets call failed. ${response.status}, ${rows}`);
	}

	const get = <T extends number | string>(row: unknown[], col: string): T =>
		row[rows[0].findIndex((h) => h.toLowerCase().includes(col))] as T;

	const data: LocationInfo[] = (
		await Promise.all(
			rows.map(async (row, index) => {
				if (index === 0) return;
				const formattedDate = get<string>(row, 'date').split(' at ')[0];
				const date = new Date(formattedDate);
				date.setHours(1); // bumps over into correct day

				return {
					index,
					date,
					description: get(row, 'location'),
					latitude: get(row, 'latitude'),
					longitude: get(row, 'longitude'),
					image: await downloadImage(get(row, 'photo url'), index)
				} satisfies LocationInfo;
			})
		)
	).filter((e): e is LocationInfo => e != null);

	const json = JSON.stringify(data, null, 2);
	writeFileSync(dataFilepath, json, 'utf8');
	console.log(`Data saved to ${dataFilepath}`);
}

main();
