<script lang="ts">
  import type { LocationInfo } from '$lib/types';
	export let location: LocationInfo;
</script>

<div>
	{new Date(location.date).toDateString()}
</div>

<div>
	{location.description}
</div>

<img src={location.image} alt={'Photo of Eddy at ' + location.description} />
