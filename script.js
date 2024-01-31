document.addEventListener('DOMContentLoaded', function()
{
	// The hash-like string to send the emails to, from formsubmit.co
	const key = '7735aaa42bf8448ef22dd6ca61b2c88b';
	// The formsubmit.co URL where the data is being sent to
	const formSubmit = 'https://formsubmit.co/ajax/' + key;

	// The form element
	let form = document.forms.namedItem('kontaktform');

	// Get the required fields
	let requiredFields = document.querySelectorAll('[required]');

	// Get the date picker elements from the form
	let arrivalDatepicker = document.getElementById('kontakt_anreise');
	let departureDatepicker = document.getElementById('kontakt_abreise');

	// Dates for today and tomorrow
	todayDate = new Date();
	tomorrowDate = new Date(todayDate);
	tomorrowDate.setDate(tomorrowDate.getDate() + 1);
	todayDateStr = todayDate.toISOString().split('T')[0];
	tomorrowDateStr = tomorrowDate.toISOString().split('T')[0];

	// Set the default date for the arrival date picker to today's date
	arrivalDatepicker.value = todayDateStr;

	// ...And set the default date for the departure date picker to tomorrow
	departureDatepicker.value = tomorrowDateStr;

	// Set the minimum arrival date to today; departure minimum date for tomorrow
	arrivalDatepicker.min = todayDateStr;
	departureDatepicker.min = tomorrowDateStr;

	let departureMinDate = () => departureDatepicker.min = arrivalDatepicker.value;
	let arrivalMaxDate = () => arrivalDatepicker.max = departureDatepicker.value >= todayDateStr ? departureDatepicker.value : todayDateStr;

	arrivalDatepicker.addEventListener('change', departureMinDate );
	departureDatepicker.addEventListener('change', arrivalMaxDate );
	arrivalDatepicker.addEventListener('blur', departureMinDate );
	departureDatepicker.addEventListener('blur', arrivalMaxDate );

	// Elements to show success/errors/processing
	const submitBtn = document.getElementById('kontakt_submit');
	const forsendIcon = document.getElementById('kontakt_submit-forsend');
	const sendingIcon = document.getElementById('kontakt_submit-sending');
	const successIcon = document.getElementById('kontakt_submit-success');
	const warningIcon = document.getElementById('kontakt_submit-warning');
	const msgSuccess = document.getElementById('kontakt_msg-success');
	const msgWarning = document.getElementById('kontakt_msg-warning');

	form.addEventListener('submit', (e) =>
	{
		if (form.reportValidity())
		{
			// Captured data
			formData = new FormData(form);

			let arrivalVal = arrivalDatepicker.value;
			let departureVal = departureDatepicker.value;

			// Calculate the number of nights
			let arrivalDate = new Date(arrivalVal);
			let departureDate = new Date(departureVal);
			let dateDifference = departureDate.getTime() - arrivalDate.getTime();
			formData.set('Nätchen', Math.ceil(dateDifference / (1000 * 3600 * 24)));

			// Set value for the 'actual' email field
			formData.set('Email', formData.get('_replyto'))

			sendingIcon.removeAttribute('aria-hidden');
			forsendIcon.setAttribute('aria-hidden', 'true');
			if (successIcon.getAttribute('aria-hidden')) successIcon.setAttribute('aria-hidden', 'true');
			if (warningIcon.getAttribute('aria-hidden')) warningIcon.setAttribute('aria-hidden', 'true');
			if (msgSuccess.getAttribute('aria-hidden')) msgSuccess.setAttribute('aria-hidden', 'true');
			if (msgWarning.getAttribute('aria-hidden')) msgWarning.setAttribute('aria-hidden', 'true');
			
			fetch(formSubmit,
			{
				method: "POST",
				body: formData,
			})
			.then(response => response.json())
			.then(data =>
			{
				console.log(data);
				successIcon.removeAttribute('aria-hidden');
				if (!sendingIcon.getAttribute('aria-hidden')) sendingIcon.setAttribute('aria-hidden', 'true');
				if (!warningIcon.getAttribute('aria-hidden')) warningIcon.setAttribute('aria-hidden', 'true');
				msgSuccess.removeAttribute('aria-hidden');
				if (msgWarning.getAttribute('aria-hidden')) msgWarning.setAttribute('aria-hidden', 'true');
			})
			.catch(error =>
			{
				console.log(error);
				warningIcon.removeAttribute('aria-hidden');
				if (!sendingIcon.getAttribute('aria-hidden')) sendingIcon.setAttribute('aria-hidden', 'true');
				if (!successIcon.getAttribute('aria-hidden')) successIcon.setAttribute('aria-hidden', 'true');
				msgWarning.removeAttribute('aria-hidden');
				if (!msgSuccess.getAttribute('aria-hidden')) msgSuccess.setAttribute('aria-hidden', 'true');
			});
		}
	});

	submitBtn.addEventListener('click', (e) =>
	{
		e.stopPropagation();
		e.preventDefault();

		domEvent = document.createEvent('Event');
		domEvent.initEvent('submit', false, true);
		e.target.closest('form').dispatchEvent(domEvent);
	});

	/* Interactive galleries for the apartment pictures */

	const apartmentGalleries = document.querySelectorAll('.wohnungen-gallery');

	apartmentGalleries.forEach( gallery =>
	{
		let activeImg = gallery.querySelector('.wohnungen-image>img');
		let images = gallery.querySelectorAll('.wohnungen-images img');

		images.forEach( image =>
		{
			image.addEventListener('click', (e) =>
			{
				activeImg.src = e.target.src;
				activeImg.alt = e.target.alt;
			});
		});
	});

	/* This thing loads and displays the map */

	async function initMap()
	{
		// The position
		const position = { lat: 52.10309, lng: 14.11857 };

		// The logo
		const logo = 'logo.svg#logo-m';

		// Request needed libraries.
		const { Map } = await google.maps.importLibrary("maps");
		const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary( "marker" );
		const { Place } = await google.maps.importLibrary("places");
		const map = new Map(document.getElementById("anreise-map"),
		{
			center: position,
			zoom: 12,
			mapId: "ce1f9395fc5bcbe9",
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDoubleClickZoom: true,
			draggable : true,
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: true,
			scaleControl: false,
			scrollwheel: false,
			streetViewControl: false,
			overviewMapControl: false,
			overviewMapControlOptions: {
				opened: false,
			},
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.DEFAULT,
			}
		});

		// The marker node
		const glyphImg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		const glyphUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');

		glyphUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', logo);
		glyphImg.appendChild(glyphUse);

		const glyphSvgPinElement = new PinElement(
		{
			glyph: glyphImg,
			scale: 1.5,
			background: '#117da9',
			borderColor: '#016d99',
		});

		const glyphSvgMarkerView = new AdvancedMarkerElement(
		{
			map,
			position: position,
			content: glyphSvgPinElement.element,
			title: "Schwarzer Kater",
		});
	}

	initMap();

	/* This bit makes the menu to hide when clicking one of its items */

	const menu = document.getElementById('menu_items');
	const menu_toggle = document.getElementById('menu_toggle');
	const menu_links = menu.querySelectorAll('a');

	menu_links.forEach(link =>
	{
		link.addEventListener('click', () => { menu_toggle.checked = false });
	});

})