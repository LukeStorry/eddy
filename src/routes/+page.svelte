<script lang="ts">
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import '../app.css';
	import locations from '../data.json';
	import { Map, Marker, controls } from '@beyonk/svelte-mapbox/components';
	import MarkerIcon from './MarkerIcon.svelte';
	import LocationDisplay from './LocationDisplay.svelte';
	const { GeolocateControl, NavigationControl, ScaleControl } = controls;

	const center = [locations.at(-1)?.longitude, locations.at(-1)?.latitude];
</script>

<h1 class="bg-[#3f7e9b]/50 text-white text-center py-2 px-12 backdrop-blur-sm absolute z-10 border-rb rounded-br-2xl">
	Eddy's Journey
</h1>
<div class="h-screen">
	<Map accessToken={PUBLIC_MAPBOX_TOKEN} options={{ center, maxBounds: [-3.1, 50, 1, 53] }}>
		<NavigationControl />
		<GeolocateControl />
		<ScaleControl />
		{#each locations as l}
			<Marker lat={l.latitude} lng={l.longitude} popupOptions={{ closeButton: false }}>
				<MarkerIcon />
				<div slot="popup">
					<LocationDisplay location={l} />
				</div>
			</Marker>
		{/each}
	</Map>
</div>
