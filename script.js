document.addEventListener('DOMContentLoaded', function()
{
	// The hash-like string to send the emails to, from formsubmit.co
	const key = '7e9e403a0b910a85054275ec2df01e59';
	// The formsubmit.co URL where the data is being sent to
	const formSubmit = 'https://formsubmit.co/ajax/' + key;

	// The form element
	let form = document.forms.namedItem('kontact');

	// Get the required fields
	let requiredFields = document.querySelectorAll('[required]');

	// Get the date picker elements from the form
	let arrivalDatepicker = document.getElementById('kontact_arrival');
	let departureDatepicker = document.getElementById('kontact_departure');

	// Today's date in YYYY/MM/DD format
	todayMinValue = new Date().toISOString().split('T')[0];

	// Set the default date for the arrival date picker to today's date
	arrivalDatepicker.value = todayMinValue;

	// Set the minimum arrival & departure dates to today
	departureDatepicker.min = arrivalDatepicker.min = todayMinValue

	let departureMinDate = () => departureDatepicker.min = arrivalDatepicker.value;
	let arrivalMaxDate = () => arrivalDatepicker.max = departureDatepicker.value >= todayMinValue ? departureDatepicker.value : todayMinValue;

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

	kontact.addEventListener('submit', (e) =>
	{
		if (kontact.reportValidity())
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
})