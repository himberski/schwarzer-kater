document.addEventListener('DOMContentLoaded', function()
{
	const submitBtn = document.getElementById('kontact_submit');
	const msgSuccess = document.getElementById('kontact_msg-success');
	const msgError = document.getElementById('kontact_msg-error');

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

		fetch("https://formsubmit.co/ajax/kotikuze@mailgolem.com",
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
				Adults: adultsVal,
				Kids: kidsVal,
				Phone: phoneVal,
				Email: emailVal,
				Nachricht: nachrichtVal
			})
		})
		.then(response => response.json())
		.then(data =>
		{
			console.log(data);
			msgSuccess.removeAttribute('hidden');
		})
		.catch(error =>
		{
			console.log(error);
			msgError.removeAttribute('hidden');
		});
	});
})