<script lang="ts">
	import '../app.css';
	import data from '../data.json';

	const dataString = JSON.stringify(data, null, 2);
</script>

<h1 class="bg-slate-500 text-center w-full h-20">Eddy's Journey</h1>
<div class="h-full h-80">Map goes here</div>

<pre class="bg-slate-900 text-emerald-200 text-sm p-4">
	{dataString}
</pre>
