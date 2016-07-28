var bingTileLayer = new ol.layer.Tile({
    visible: true,
    preload: Infinity,
    source: new ol.source.BingMaps({
        key: 'Al6d3X68zuqRuuN4vjmSyzMexRApdetE7N6mr5Iae-XyGMn8IxDhGnz0xQhJZk5n',
        imagerySet: 'Aerial'
    })
});

var vector = new ol.layer.Vector({
    source: new ol.source.Vector()
});

var map = new ol.Map({
    layers: [bingTileLayer],
    loadTilesWhileInteracting: true,
    target: 'map',
    view: new ol.View({
        center: [-6655.5402445057125, 6709968.258934638],
        zoom: 9
    }),
    attribution:false,
    controls: [new ol.control.Zoom(),
        new app.EditControl()]//
});