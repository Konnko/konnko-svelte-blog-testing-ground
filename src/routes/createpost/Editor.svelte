<script lang="ts">
	import tinymce from 'tinymce'
	import Editor from '@tinymce/tinymce-svelte'
	import { onDestroy, onMount } from 'svelte'

	// Theme
	import 'tinymce/themes/silver'
	// Toolbar icons
	import 'tinymce/icons/default'
	// Editor styles
	import 'tinymce/skins/ui/oxide/skin.min.css'

	import 'tinymce/models/dom'

	// importing the plugin js.
	import 'tinymce/plugins/autolink'
	import 'tinymce/plugins/link'
	import 'tinymce/plugins/image'
	import 'tinymce/plugins/lists'
	import 'tinymce/plugins/charmap'
	import 'tinymce/plugins/anchor'
	import 'tinymce/plugins/searchreplace'
	import 'tinymce/plugins/wordcount'
	import 'tinymce/plugins/code'
	import 'tinymce/plugins/fullscreen'
	import 'tinymce/plugins/insertdatetime'
	import 'tinymce/plugins/media'
	import 'tinymce/plugins/table'
	import 'tinymce/plugins/help'

	export let text: string

	let conf = {
		height: 500,
		theme: 'silver',
		skin: false,
		content_css: false,
		plugins: [
			'autolink',
			'lists',
			'link',
			'image',
			'charmap',
			'anchor',
			'searchreplace',
			'fullscreen',
			'insertdatetime',
			'media',
			'table',
			'help',
			'wordcount'
		],
		content_style: 'img {display: block; max-width:100%; height: auto;}',
		promotion: false,
		toolbar:
			'undo redo | casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | ' +
			'bullist numlist checklist outdent indent | removeformat | code table help',
		images_upload_url: window.location.origin + '/uploadImg'
	}

	onMount(() => tinymce.init({}))
	onDestroy(() => tinymce.remove())
</script>

<Editor {conf} bind:value={text} />
