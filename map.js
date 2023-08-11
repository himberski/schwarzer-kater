async function initMap()
{
	// The position
	const position = { lat: 52.10309, lng: 14.11857 };

	// Request needed libraries.
	const { Map } = await google.maps.importLibrary("maps");
	const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary( "marker" );
	const { Place } = await google.maps.importLibrary("places");
	const map = new Map(document.getElementById("map"),
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
	const glyphImg = document.createElement("img");

	glyphImg.src = "logo.svg";

	const glyphSvgPinElement = new PinElement({
		glyph: glyphImg,
	});
	const glyphSvgMarkerView = new AdvancedMarkerElement({
		map,
		position: position,
		content: glyphSvgPinElement.element,
		title: "Schwarzer Kater",
	});
}

initMap();
