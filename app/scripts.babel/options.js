'use strict';

$(function(){
	let defaults = {
		server1: '',
		server2: '',
		server3: ''
	};
	
	chrome.storage.local.get(defaults, (items) => {
		$('#server1').val(items.server1);
		$('#server2').val(items.server2);
		$('#server3').val(items.server3);
	});

	$('#server1').change(function() {
		let checked = $(this).val();
		let object = {
			server1: checked
		};
		chrome.storage.local.set(object, function(){});
	});

	$('#server2').change(function() {
		let checked = $(this).val();
		let object = {
			server2: checked
		};
		chrome.storage.local.set(object, function(){});
	});

	$('#server3').change(function() {
		let checked = $(this).val();
		let object = {
			server3: checked
		};
		chrome.storage.local.set(object, function(){});
	});
});