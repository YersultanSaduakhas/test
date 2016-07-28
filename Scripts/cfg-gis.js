proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");
proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs ");

var mapConfig = {
    defaultSrsName: "EPSG:4326",
    mapBounds: [4989081.3222797215, 5728898.398805689, 6613215.299283147, 6340394.625087099],
    minZoom: 7,
    maxZoom: 19,
    zoom:14,
    mapOsmWmsUrl: "http://82.200.170.182:8080/geoserver/atyrau_osm/wms",
	defaultSrsName:'EPSG:4326',
    //mapGwcWmsUrl: "https://maps.gosreestr.kz/geoserver/gwc/service/wms",    // cached layers for big raster data etc..
    center: ol.proj.transform([51.9011, 47.1035], 'EPSG:4326', 'EPSG:3857')
};

var layerConifg={
	busStationsLayer:'atyrau_osm:bus_stations',
	buildLayer:'atyrau_osm:build',
	districtLayer:'atyrau_osm:district',
	regionLayer:'atyrau_osm:region',
	busRoutes:'atyrau_osm:bus_routes',
	searchOsmLayer:'atyrau_osm:atyrau'
};

window.app = {};
var app = window.app;
app.bingKey = "Al6d3X68zuqRuuN4vjmSyzMexRApdetE7N6mr5Iae-XyGMn8IxDhGnz0xQhJZk5n";
app.controlButtonInActiveBackground = 'rgba(5, 5, 5, 0.78)';
app.controlButtonActiveBackground = 'red';
app.gmap;
// declare common map functions
ol.Map.prototype.deactivateControls = function(sender) {
    var map = this;
    var controls = map.getControls();
    for(var i=0;i<controls.getLength();i++) {
        var curControl = controls.item(i);
        if(curControl.onControlsDeactivate) {
            curControl.onControlsDeactivate(sender);
        }
    }
};

ol.Map.prototype.zoomToFeature = function(feature) {
    var map = this;
	var featureExtent = feature.getGeometry().getExtent();
	map.getView().fitExtent(featureExtent,map.getSize());
};


ol.Map.prototype.refreshLayers = function() {
    var map = this;
    var mapLayers = map.getLayers();
    for (var i = 0; i < mapLayers.getLength(); i++) {
        var curLayer = mapLayers.item(i);
        var layerSource = curLayer.getSource();
        if(layerSource.updateParams) {  // TODO: check layer type and update only tile layers...
            layerSource.updateParams({ rand: Math.random() });
        }
        if (!layerSource.refresh) { 
            continue;
        }
        layerSource.refresh({ force: true });
        curLayer.redraw(true);
        curLayer.refresh({ force: true });
    }
    map.renderSync();
};

