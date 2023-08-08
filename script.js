document.addEventListener('DOMContentLoaded', function()
{
	const key = '1fb256e90f36e2f587011cb5c98a3786';
	const formSubmit = 'https://formsubmit.co/ajax/' + key;

	const submitBtn = document.getElementById('kontact_submit');
	const forsendIcon = document.getElementById('kontact_submit-forsend');
	const sendingIcon = document.getElementById('kontact_submit-sending');
	const successIcon = document.getElementById('kontact_submit-success');
	const warningIcon = document.getElementById('kontact_submit-warning');
	const msgSuccess = document.getElementById('kontact_msg-success');
	const msgWarning = document.getElementById('kontact_msg-warning');

	submitBtn.addEventListener('click', function(e)
	{
		e.stopPropagation();
		e.preventDefault();

		let arrivalVal = document.getElementById('kontact_arrival').value;
		let departureVal = document.getElementById('kontact_departure').value;
		let adultsVal = document.getElementById('kontact_adults').value;
		let kidsVal = document.getElementById('kontact_kids').value;
		let phoneVal = document.getElementById('kontact_phone').value;
		let emailVal = document.getElementById('kontact_email').value;
		let nachrichtVal = document.getElementById('kontact_nachricht').value;

		let arrivalDate = new Date(arrivalVal);
		let departureDate = new Date(departureVal);
		let dateDifference = departureDate.getTime() - arrivalDate.getTime();
		let days = Math.ceil(dateDifference / (1000 * 3600 * 24));

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
			headers:
			{ 
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(
			{
				Arrival: arrivalVal,
				Departure: departureVal,
				Nights: days,
				Adults: adultsVal,
				Kids: kidsVal,
				Phone: '<a href="tel:' + phoneVal + '">' + phoneVal + '</a>',
				Email: '<a href="mailto:' + emailVal + '">' + emailVal + '</a>',
				Nachricht: nachrichtVal
			})
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