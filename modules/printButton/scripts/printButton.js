window.addEventListener('DOMContentLoaded', function() {
	// Proxy for communication with parent page
	var parentMessageProxy = new MessageProxy();
	parentMessageProxy.setSend(parent);
	parentMessageProxy.setRecv(window);
	
	window.addEventListener('click', function() {
		var win = window.open(URL.createObjectURL(new Blob([
			"<script>",
			"window.addEventListener('message', function(evt) {",
			"	document.open('text/html', 'replace');",
			"	document.write(evt.data.content);",
			"	document.close();",
			"});",
			"</script>",
		], {type: 'text/html'})));
		var firefox = navigator.userAgent.indexOf('Firefox') !== -1;
		var key = parentMessageProxy.registerMessageHandler(function(e){
			win.postMessage({
				content: 
					e.data.content
						.replace('</head>', [
							'',
							'	<!--_firetext_import_remove_start-->',
							'	<style>',
							'	#firetext_print_notice {',
							'		border: 2px solid;',
							'		font-size: xx-large;',
							'		margin-bottom: var(--margin);',
							'		padding: 20px;',
							'		border-radius: 8px;',
							'		font-family: sans-serif;',
							'	}',
							'	@media print {',
							'		#firetext_print_notice {',
							'			display: none;',
							'		}',
							'	}',
							'	</style>',
							'	<!--_firetext_import_remove_end-->',
							'</head>',
						].join('\n'))
						.replace('</body>', [
							"",
							"<script>",
							"window.addEventListener('load', function() {",
							"	var t0 = Date.now();",
							"	setTimeout(function() {",
							"		if(Date.now() - t0 < 200) {",
							"			// The browser doesn't support window.print() (or window.print() is non-blocking).",
							"			// So we ask the user that, if the browser supports printing, they print manually.",
							"			document.body.insertAdjacentHTML('beforebegin', [",
							"				'<!--_firetext_import_remove_start-->',",
							"				'<div id=firetext_print_notice>',",
							"				" + JSON.stringify(e.data['automatic-printing-failed'].replace(/</g, '&lt;')) + ",",
							"				'</div>',",
							"				'<!--_firetext_import_remove_end-->',",
							"			].join('\\n'));",
							"		} else if(",
							"			navigator.userAgent.indexOf('Chrome') !== -1 &&",
							"				// In both Firefox and IE the window.print() dialog is less featureful than menu -> print,",
							"				// (preview and page settings,) so we allow the user to select the latter if they want.",
							"			navigator.userAgent.indexOf('Android') === -1",
							"				// Chrome Android returns from printing before it's done and crashes if we window.close().",
							"				// Also match Android tablet and WebView Android because they're probably the same.",
							"		) {",
							"			window.close();",
							"		}",
							"	});",
							"	try {",
							"		window.print();",
							"	} catch(e) {}",
							"});",
							"</script>",
							"</body>",
						].join('\n'))
			}, '*');
		}, null, true);
		parentMessageProxy.postMessage({
			command: "print-button-pressed",
			key: key
		});
	});
});