<script lang="ts">
	import tinymce, { Editor } from 'tinymce'
	import { onDestroy, onMount } from 'svelte'
	import { PUBLIC_R2_URL } from '$env/static/public'

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
	export let postId: number
	export let imageUrls: string[]

	const imageUrlCount = { current: imageUrls.length }

	const deleteImage = async (url: string) => {
		try {
			let editor = tinymce.activeEditor

			if (!editor) return

			await fetch('/api/image', {
				method: 'DELETE',
				body: JSON.stringify({ url })
			})

			let imgElements = editor.dom.select('img')

			imgElements.forEach((img) => {
				if (img.getAttribute('src') === PUBLIC_R2_URL + url) {
					editor!.dom.remove(img)
				}
			})

			imageUrls = imageUrls.filter((imageUrl) => imageUrl !== url)
		} catch (e) {
			console.error(e)
		}
	}

	const addImageToEditor = (url: string) => {
		if (!tinymce.activeEditor) return
		tinymce.activeEditor.execCommand(
			'mceInsertContent',
			false,
			`<img src="${PUBLIC_R2_URL + url}" data-mce-src="${PUBLIC_R2_URL + url}" />`
		)
	}

	let conf = {
		selector: 'textarea',
		height: 500,
		theme: 'silver',
		skin: false,
		automatic_uploads: false,
		autoresize_bottom_margin: 0,
		content_css: false,
		plugins: ['lists', 'charmap', 'anchor', 'searchreplace', 'fullscreen', 'table', 'wordcount'],
		content_style: 'img {display: block; max-width:100%; height: auto;}',
		promotion: false,
		toolbar:
			'undo redo | casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | ' +
			'bullist numlist checklist outdent indent | removeformat | code table help',
		setup: (editor: Editor) => {
			editor.on('init', function () {
				editor.setContent(text)
			})

			editor.on('paste', async (e: ClipboardEvent) => {
				let imagesInClipboard = Array.from(e.clipboardData?.items || []).filter(
					(item) => item.type.indexOf('image') === 0
				)

				if (imagesInClipboard.length === 0) return

				if (imageUrlCount.current + imagesInClipboard.length > 9) {
					e.preventDefault()
					alert('Maximum number of images reached.')
					return
				}

				e.preventDefault()

				for (let i = 0; i < imagesInClipboard.length; i++) {
					let item = imagesInClipboard[i]

					if (item.kind === 'file' && item.type.indexOf('image/') === 0) {
						let blob = item.getAsFile()
						if (!blob) continue

						let formData = new FormData()
						formData.append('postId', String(postId))
						formData.append('image', blob)

						try {
							let response = await fetch('/api/image', {
								method: 'POST',
								body: formData
							})

							if (!response.ok) {
								throw new Error(`${response.status} ${response.statusText}`)
							}

							let data = await response.json()

							let img = document.createElement('img')
							img.src = PUBLIC_R2_URL + data.url
							editor.insertContent(
								editor.dom.createHTML('img', { src: img.src, 'data-mce-src': img.src })
							)
							imageUrls = [...imageUrls, data.url]
						} catch (err) {
							editor.insertContent(editor.dom.createHTML('p', {}, String(err)))
						}
					}
				}
			})
		}
	}

	onMount(() => tinymce.init(conf))
	onDestroy(() => tinymce.remove())

	const buttonStyles =
		'w-full absolute h-2/4 bg-opacity-0 opacity-0 hover:bg-slate-900 hover:bg-opacity-50 hover:opacity-100 text-white transition-all'
</script>

<div class="flex gap-3 w-full flex-wrap mb-2 mx-2">
	{#each imageUrls as url}
		<div
			class="cursor-pointer h-20 w-20 rounded-sm relative bg-neutral-200 text-center flex flex-col justify-center items-center"
		>
			<button class={'top-0 ' + buttonStyles} on:click={() => addImageToEditor(url)} type="button"
				>Add</button
			>
			<button class={'bottom-0 ' + buttonStyles} on:click={() => deleteImage(url)} type="button"
				>Delete</button
			>
			<div />
			<img class="w-fit max-h-20 aspect-auto m-auto" src={PUBLIC_R2_URL + url} alt="collection" />
			<div />
		</div>
	{/each}
</div>

<textarea id="tinyMCE" />
