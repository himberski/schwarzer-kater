async function initMap()
{
	// The position
	const position = { lat: 52.10309, lng: 14.11857 };

	// The icon
	const icon = 'logo.svg#logo-m';

	// Request needed libraries.
	const { Map } = await google.maps.importLibrary("maps");
	const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary( "marker" );
	const { Place } = await google.maps.importLibrary("places");
	const map = new Map(document.getElementById("anreise-map"),
	{
		center: position,
		zoom: 13,
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

	// A marker with the logo of Schwarzer Kater
	const glyphImg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	const glyphUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');

	glyphUse.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', icon);
	glyphImg.appendChild(glyphUse);

	const glyphSvgPinElement = new PinElement(
	{
		glyph: glyphImg,
		scale: 2.25,
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
