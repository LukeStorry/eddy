<script lang="ts">
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import '../app.css';
	import locations from '../data.json';
	import { Map, Marker, controls } from '@beyonk/svelte-mapbox/components';
	import MarkerIcon from './MarkerIcon.svelte';
	const { GeolocateControl, NavigationControl, ScaleControl } = controls;

	// const locationEdges = locations.reduce(
	// 	([west, south, east, north], { latitude, longitude }) => [
	// 		Math.min(west, longitude),
	// 		Math.min(south, latitude),
	// 		Math.max(east, longitude),
	// 		Math.max(north, latitude)
	// 	],
	// 	[100, 100, -100, -100]
	// );
	const center = [locations.at(-1)?.longitude, locations.at(-1)?.latitude];
</script>

<h1 class="bg-slate-500 text-white text-center w-full">Eddy's Journey</h1>
<div class="h-screen">
	<Map accessToken={PUBLIC_MAPBOX_TOKEN} options={{ center, maxBounds: [-3.1, 50, 1, 53] }}>
		<NavigationControl />
		<GeolocateControl />
		<ScaleControl />
		{#each locations as l}
			<Marker lat={l.latitude} lng={l.longitude} popupOptions={{ closeButton: false }}>
				<MarkerIcon />

				<div slot="popup">
					<div>
						{new Date(l.date).toDateString()}
					</div>
					<div>
						{l.description}
					</div>
					<img src={l.image} alt={'Photo of Eddy at ' + l.description} />
				</div>
			</Marker>
		{/each}
	</Map>
</div>
