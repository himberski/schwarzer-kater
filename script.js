document.addEventListener('DOMContentLoaded', function()
{
	// The hash-like string to send the emails to, from formsubmit.co
	const key = '1fb256e90f36e2f587011cb5c98a3786';
	// The formsubmit.co URL where the data is being sent to
	const formSubmit = 'https://formsubmit.co/ajax/' + key;

	// The form element
	let form = document.forms.namedItem('kontact');

	// Get the required fields
	let requiredFields = document.querySelectorAll('[required]');

	// Get the date picker elements from the form
	let arrivalDatepicker = document.getElementById('kontact_arrival');
	let departureDatepicker = document.getElementById('kontact_departure');
	let nightsNumber = document.getElementById('kontact_nights');

	// Set the minimum arrival & departure dates to today
	todayMinValue = new Date().toISOString().split('T')[0];
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

	kontact.addEventListener('submit', function(e)
	{
		kontact.reportValidity();

		// Captured data
		formData = new FormData(form);

		let arrivalVal = arrivalDatepicker.value;
		let departureVal = departureDatepicker.value;

		// Calculate the number of nights
		let arrivalDate = new Date(arrivalVal);
		let departureDate = new Date(departureVal);
		let dateDifference = departureDate.getTime() - arrivalDate.getTime();
		nightsNumber.value = Math.ceil(dateDifference / (1000 * 3600 * 24));

		let testemail = document.getElementById('testemail').value;
		let emailAddress = testemail != '' ? testemail : formSubmit;

		sendingIcon.removeAttribute('hidden');
		forsendIcon.setAttribute('hidden', '');
		if (successIcon.getAttribute('hidden')) successIcon.setAttribute('hidden', '');
		if (warningIcon.getAttribute('hidden')) warningIcon.setAttribute('hidden', '');
		if (msgSuccess.getAttribute('hidden')) msgSuccess.setAttribute('hidden', '');
		if (msgWarning.getAttribute('hidden')) msgWarning.setAttribute('hidden', '');
		
		fetch(emailAddress,
		{
			method: "POST",
			body: formData
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
	});
})