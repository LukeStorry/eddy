<script lang="ts">
	import type { LocationInfo } from '$lib/types';
	export let location: LocationInfo;
</script>

<h3 class="text-lg font-bold text-[#3f7e9b]">
	{location.description}
</h3>

<img
	src={location.image}
	alt={'Photo of Eddy at ' + location.description}
	class="rounded-lg shadow-lg my-2"
/>

<p class="text-right">
	{new Date(location.date).toDateString()}
</p>
