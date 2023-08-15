document.addEventListener('DOMContentLoaded', function()
{
	// The hash-like string to send the emails to, from formsubmit.co
	const key = '7e9e403a0b910a85054275ec2df01e59';
	// The formsubmit.co URL where the data is being sent to
	const formSubmit = 'https://formsubmit.co/ajax/' + key;

	// The form element
	let form = document.forms.namedItem('kontactform');

	// Get the required fields
	let requiredFields = document.querySelectorAll('[required]');

	// Get the date picker elements from the form
	let arrivalDatepicker = document.getElementById('kontact_arrival');
	let departureDatepicker = document.getElementById('kontact_departure');

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
	const submitBtn = document.getElementById('kontact_submit');
	const forsendIcon = document.getElementById('kontact_submit-forsend');
	const sendingIcon = document.getElementById('kontact_submit-sending');
	const successIcon = document.getElementById('kontact_submit-success');
	const warningIcon = document.getElementById('kontact_submit-warning');
	const msgSuccess = document.getElementById('kontact_msg-success');
	const msgWarning = document.getElementById('kontact_msg-warning');

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
			formData.set('Nights', Math.ceil(dateDifference / (1000 * 3600 * 24)));

			// Set value for the 'actual' email field
			formData.set('Email', formData.get('_replyto'))

			sendingIcon.removeAttribute('hidden');
			forsendIcon.setAttribute('hidden', '');
			if (successIcon.getAttribute('hidden')) successIcon.setAttribute('hidden', '');
			if (warningIcon.getAttribute('hidden')) warningIcon.setAttribute('hidden', '');
			if (msgSuccess.getAttribute('hidden')) msgSuccess.setAttribute('hidden', '');
			if (msgWarning.getAttribute('hidden')) msgWarning.setAttribute('hidden', '');
			
			fetch(formSubmit,
			{
				method: "POST",
				body: formData,
			})
			.then(response => response.json())
			.then(data =>
			{
				console.log(data);
				successIcon.removeAttribute('hidden');
				if (!sendingIcon.getAttribute('hidden')) sendingIcon.setAttribute('hidden', '');
				if (!warningIcon.getAttribute('hidden')) warningIcon.setAttribute('hidden', '');
				msgSuccess.removeAttribute('hidden');
				if (msgWarning.getAttribute('hidden')) msgWarning.setAttribute('hidden', '');
			})
			.catch(error =>
			{
				console.log(error);
				warningIcon.removeAttribute('hidden');
				if (!sendingIcon.getAttribute('hidden')) sendingIcon.setAttribute('hidden', '');
				if (!successIcon.getAttribute('hidden')) successIcon.setAttribute('hidden', '');
				msgWarning.removeAttribute('hidden');
				if (!msgSuccess.getAttribute('hidden')) msgSuccess.setAttribute('hidden', '');
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

	const apartmentGalleries = document.querySelectorAll('.beschreibung-gallery');

	apartmentGalleries.forEach( gallery =>
	{
		let activeImg = gallery.querySelector('.beschreibung-image>img');
		let images = gallery.querySelectorAll('.beschreibung-images img');

		images.forEach( image =>
		{
			image.addEventListener('click', (e) =>
			{
				activeImg.src = e.target.src;
				activeImg.alt = e.target.alt;
			});
		});
	});
})