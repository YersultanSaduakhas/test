app.EditControl = function (opt_options) {
    var options = opt_options || {};

    var activeControlClass = 'active-control';

    var helpTooltipElement;
    var helpTooltip;
    this.helpMsg = '';
    var pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        helpTooltipElement.innerHTML = that.helpMsg;
        helpTooltip.setPosition(evt.coordinate);

        helpTooltipElement.classList.remove('hidden');
    };


    
    

    function createHelpTooltip(map) {
        if (helpTooltipElement) {
            helpTooltipElement.parentNode.removeChild(helpTooltipElement);
        }
        helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'tooltip hidden';
        helpTooltip = new ol.Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left'
        });
        map.addOverlay(helpTooltip);
    }



    var $btnEdit = $("<button type='button' class='button'>E</button>");
    $btnEdit.attr("title", "Choose control to start editing");

    var that = this;
    var vector = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });


    var vectorCut = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#aadd44',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#aadd44'
                })
            })
        })
    });

    var modify = null;
    modify = {
        init: function(map) {
            this.map = map;
            this.select = new ol.interaction.Select();
            

            map.addInteraction(this.select);

            this.modify = new ol.interaction.Modify({
                features: this.select.getFeatures()
            });
            map.addInteraction(this.modify);
            this.setEvents();
        },
        setEvents: function() {
            var selectedFeatures = this.select.getFeatures();
            selectedFeatures.on('add', function (event) {
                var feature = event.target.item(0);
                that.helpMsg = "modify feature by dragging vertices";
            });
        },
        setActive: function(active) {
            this.select.setActive(active);
            this.modify.setActive(active);
            if (active === true) {
                that.helpMsg = "choose feature to modify";
            }
            else {
                
            }
            if(active==true){
                //$('.btn-edit-feature').css('background-color',app.controlButtonActiveBackground);
                $modify.addClass(activeControlClass);
			}
			else {
                //$('.btn-edit-feature').css('background-color',app.controlButtonInActiveBackground);
                $modify.removeClass(activeControlClass);
			}
        }
    };

    var draw = null;
    var drawPoint = {
        init: function (map) {
            map.addInteraction(this.Point);
            this.Point.setActive(false);
        },
        Point: new ol.interaction.Draw({
            source: vector.getSource(),
            type: /** @type {ol.geom.GeometryType} */('Point')
        }),
        getActive: function () {
            return this.activeType ? this[this.activeType].getActive() : false;
        },
        setActive: function (active) {
            var type = 'Point';
            if (active) {
                that.helpMsg = "draw points on map by clicking on map";
                this.activeType && this[this.activeType].setActive(false);
                this[type].setActive(true);
                this.activeType = type;
                //$('.btn-draw-point').css('background-color',app.controlButtonActiveBackground);
                $drawPoint.addClass(activeControlClass);
            } else {
               
                this.activeType && this[this.activeType].setActive(false);
                this.activeType = null;
                //$('.btn-draw-point').css('background-color',app.controlButtonInActiveBackground);
                $drawPoint.removeClass(activeControlClass);
            }
        },
    };

    var drawLine = {
        init: function (map) {
            map.addInteraction(this.LineString);
            this.LineString.setActive(false);
            this.setEvents();
        },
        LineString: new ol.interaction.Draw({
            source: vector.getSource(),
            type: /** @type {ol.geom.GeometryType} */('LineString')
        }),
        getActive: function () {
            return this.activeType ? this[this.activeType].getActive() : false;
        },
        setEvents: function () {
            this.LineString.on('drawstart', function (evt) {
                that.helpMsg = "Click to continue drawing or finish drawing by doubleclick";
            });
            this.LineString.on('drawend', function (evt) {
                that.helpMsg = "Click to start drawing";
            });
        },
        setActive: function (active) {
            var type = 'LineString';
            if (active) {
                that.helpMsg = "Click on map to start drawing the line";
                this.activeType && this[this.activeType].setActive(false);
                this[type].setActive(true);
                this.activeType = type;
                //$('.btn-draw-line').css('background-color',app.controlButtonActiveBackground);
                $drawLine.addClass(activeControlClass);
            } else {
                this.activeType && this[this.activeType].setActive(false);
                this.activeType = null;
                //$('.btn-draw-line').css('background-color',app.controlButtonInActiveBackground);
                $drawLine.removeClass(activeControlClass);
            }
        }
    };

    var drawPolygon = {
        init: function (map) {
            map.addInteraction(this.MultiPolygon);
            this.MultiPolygon.setActive(false);
            this.setEvents();
        },
        MultiPolygon: new ol.interaction.Draw({
            source: vector.getSource(),
            type: /** @type {ol.geom.GeometryType} */('MultiPolygon')
        }),
        getActive: function () {
            return this.activeType ? this[this.activeType].getActive() : false;
        },
        setEvents: function () {
            this.MultiPolygon.on('drawstart', function (evt) {
                that.helpMsg = "Click to continue drawing or finish drawing by doubleclick";
            });
            this.MultiPolygon.on('drawend', function (evt) {
                that.helpMsg = "Click to start drawing";
            });
        },
        setActive: function (active) {
            var type = 'MultiPolygon';
            if (active) {
                that.helpMsg = "Click on map to start drawing the polygon";
                this.activeType && this[this.activeType].setActive(false);
                this[type].setActive(true);
                this.activeType = type;
                //$('.btn-draw-polygon').css('background-color',app.controlButtonActiveBackground);
                $drawPolygon.addClass(activeControlClass);
            } else {
                this.activeType && this[this.activeType].setActive(false);
                this.activeType = null;
                //$('.btn-draw-polygon').css('background-color',app.controlButtonInActiveBackground);
                $drawPolygon.removeClass(activeControlClass);
            }
        }
    };


    var remove = {
        init: function(map) {
            this.map = map;
        },
        setActive: function(active) {
            if (active == true) {
                that.helpMsg = "Select feature that will be removed";
                this.map.on("singleclick", this.onSingleClick);
                //$('.btn-remove-feature').css('background-color',app.controlButtonActiveBackground);
                $remove.addClass(activeControlClass);
            } else {
                this.map.un("singleclick", this.onSingleClick);
                //$('.btn-remove-feature').css('background-color',app.controlButtonInActiveBackground);
                $remove.removeClass(activeControlClass);
            }
        },
        onSingleClick: function(e) {
            var map = e.map;
            var coord = map.getCoordinateFromPixel(e.pixel);
			var closestFeature = vector.getSource().getClosestFeatureToCoordinate(coord);
			if(closestFeature){
				vector.getSource().removeFeature(closestFeature);
			}
        },
    };

    var container = document.getElementById('popup');

    $("#apply-style").click(function () {
        var fillColor = $('#fill-color').val();
        var strokeColor = $('#stroke-color').val();
        updateStyleFeature(fillColor, strokeColor);
        styleOverlay.setPosition(undefined);
        that.helpMsg = "Select feature to change style";
    });
        
    var updateStyleFeature = function (fillColor,strokeColor) {
        if (styleFeature) {
            var defaultStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                    color: fillColor ? fillColor : [250, 250, 250, 1]
                }),
                stroke: new ol.style.Stroke({
                    color: strokeColor ? strokeColor : [220, 220, 220, 1],
                    width: 1
                })
            });
            styleFeature.setStyle(defaultStyle);
        }
    };

    var styleFeature = null;
    var closer = document.getElementById('popup-closer');
    closer.onclick = function () {
        styleOverlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    var styleOverlay = new ol.Overlay(/** @type {olx.OverlayOptions} */({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    }));
    
    var style = {
        init: function (map) {
            this.map = map;
            this.map.styleFeature = null;
            this.map.styleOverlay = null;
            this.map.styleOverlayContent = null;
            //this.setOverlay();
        },
        setActive: function (active) {
            if (active == true) {
                that.helpMsg = "Select feature to change style";
                this.map.on("singleclick", this.onSingleClick);
                //$('.btn-remove-feature').css('background-color',app.controlButtonActiveBackground);
                $style.addClass(activeControlClass);
                this.map.addOverlay(styleOverlay);
                styleOverlay.setPosition(undefined);
            } else {
                this.map.un("singleclick", this.onSingleClick);
                //$('.btn-remove-feature').css('background-color',app.controlButtonInActiveBackground);
                this.currentFeature = null;
                $style.removeClass(activeControlClass);
                this.map.removeOverlay(styleOverlay);
                styleOverlay.setPosition(undefined);
            }
        },
        onSingleClick: function (e) {
            var map = e.map;
            
            var coord = map.getCoordinateFromPixel(e.pixel);
            var closestFeature = vector.getSource().getClosestFeatureToCoordinate(coord);
            if (closestFeature) {
                styleFeature = closestFeature;
                var featStyle = styleFeature.getStyle();
                var fillCol = 'rgba(255, 255, 255, 0.2)';
                var strokeCol = '#ffcc33';
                if (featStyle) {
                    fillCol = featStyle.getFill().getColor();
                    strokeCol = featStyle.getStroke().getColor();
                }
                $('#fill-color').val(fillCol);
                $('#fill-color').css('background-color',fillCol)
                $('#stroke-color').val(strokeCol);
                $('#stroke-color').css('background-color', strokeCol)
                styleOverlay.setPosition(coord);
                that.helpMsg = "Change style";
            }
        },
    };

    var cutPolygon = {
        init: function (map) {
            this.map = map;
            map.addInteraction(this.CutPolygon);
            this.CutPolygon.setActive(false);
            this.setEvents();
        },
        CutPolygon: new ol.interaction.Draw({
            source: vectorCut.getSource(),
            type: /** @type {ol.geom.GeometryType} */('Polygon')
        }),
        getActive: function () {
            return this.activeType ? this[this.activeType].getActive() : false;
        },

        setActive: function (active) {
            var type = 'CutPolygon';
            if (active == true) {
                that.helpMsg = "Click to start drawing";
                this.activeType && this[this.activeType].setActive(false);
                this[type].setActive(true);
                this.activeType = type;
                $cutPolygon.addClass(activeControlClass);
            } else {
                this.activeType && this[this.activeType].setActive(false);
                this.activeType = null;
                $cutPolygon.removeClass(activeControlClass);
            }
        },
        setEvents: function () {
            this.CutPolygon.on('drawstart', function (evt) {
                that.helpMsg = "Click to continue drawing cutting area or finish drawing by doubleclick";
            });
            this.CutPolygon.on('drawend', function (evt) {
                that.helpMsg = "Click to start drawing cutting area";
                var cutFeature = evt.feature;
                var cutGeom = cutFeature.getGeometry();
                var drawnFeatures = vector.getSource().getFeatures();
                if (drawnFeatures) {
                    drawnFeatures.forEach(function (drawnFeature) {
                        var geom = drawnFeature.getGeometry();
                        if (geom instanceof ol.geom.MultiPolygon || geom instanceof ol.geom.Polygon) {
                            if (isPolygonsIntersect(cutGeom, geom)===true) {
                                var diff = cutPolygonFunction(geom, cutGeom);
                                if (diff) {
                                    drawnFeature.setGeometry(diff.getGeometry());
                                }
                            }
                            else {
                                return;
                            }
                        } else {
                            return;
                        }
                    });
                }
                vectorCut.getSource().clear();
            });
        },
    };

    var getTurfFeature = function (type, coords) {
        var featureJson = {
            'type': type,
            'coordinates': coords,
        };
        return featureJson;
    };

    var unionTurfFeatures = function (turfFeatureArr) {
        var result = null;
        turfFeatureArr.forEach(function (turfFeat) {
            if (result === null) {
                result = turfFeat;
            } else {
                result = turf.union(result, turfFeat);
            }
        });
        return result;
    };

    var cutPolygonFunction = function (polygon, cutPolygon) {
        
        var format = new ol.format.GeoJSON();
        var turfCutPolygon = getTurfFeature(cutPolygon.getType(),cutPolygon.getCoordinates());
        var turfPolygon = getTurfFeature(polygon.getType(), polygon.getCoordinates());

        if (polygon instanceof ol.geom.MultiPolygon) {
            var result = [];
            
            for (var i = 0; i < turfPolygon.coordinates.length; i++) {
                var turfPolygonInner = getTurfFeature('Polygon', turfPolygon.coordinates[i]);                
                var differenced = turf.difference(turfPolygonInner, turfCutPolygon);
                if (differenced) {
                    result.push(differenced);
                }
            }
            return format.readFeature(unionTurfFeatures(result));
        }
        if (polygon instanceof ol.geom.Polygon) {
            
            var differenced = turf.difference(turfPolygon, turfCutPolygon);
            return format.readFeature(differenced);
        }
    };

    var isPolygonsIntersect = function (polygon1, polygon2) {
               
        var turfFeatPolygon1 = getTurfFeature(polygon1.getType(), polygon1.getCoordinates());
        var turfFeatPolygon2 = getTurfFeature(polygon2.getType(), polygon2.getCoordinates());

        var arePolygonsIntersect = function (turfFeat1, turfFeat2) {
            var intersectionArea = turf.intersect(turfFeat1, turfFeat2);
            return intersectionArea != null && intersectionArea!=undefined;
        };
        var isPolygonIntersectMultiPolygon = function (poly, multipoly) {
            
            for (var i = 0; i < multipoly.coordinates.length; i++) {
                var polygonFeature = {
                    'type': 'Polygon',
                    'coordinates': multipoly.coordinates[i],
                };
                if (arePolygonsIntersect(polygonFeature, poly) === true) {
                    return true;
                }
            }
            return false;
        };

        

        if (polygon1 instanceof ol.geom.MultiPolygon) {
            

            for (var i = 0; i < turfFeatPolygon1.coordinates.length; i++) {
                var polygonFeature = {
                    'type': 'Polygon',
                    'coordinates': turfFeatPolygon1.coordinates[i],
                };
                
                if (polygon2 instanceof ol.geom.MultiPolygon) {
                    if (isPolygonIntersectMultiPolygon(polygonFeature, turfFeatPolygon2) === true) {
                        return true;
                    }
                }
                else {
                    if (arePolygonsIntersect(polygonFeature, turfFeatPolygon2) === true) {
                        return true;
                    }
                }
            }
            
        }
        if (polygon1 instanceof ol.geom.Polygon) {
            if (polygon2 instanceof ol.geom.MultiPolygon) {
                if (isPolygonIntersectMultiPolygon(turfFeatPolygon1, turfFeatPolygon2) === true) {
                    return true;
                }
            }
            else {
                if (arePolygonsIntersect(turfFeatPolygon1, turfFeatPolygon2) === true) {
                    return true;
                }
            }
        }
    };

    var tools = [drawPoint,drawLine,drawPolygon,modify,remove,cutPolygon,style];
    var activateTool = function(tool) {
        for(var i = 0;i<tools.length;i++) {
            tools[i].setActive(tool == tools[i]);
        }
    };


	function download(filename, text) {
		var element = document.createElement('a');
		element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute('download', filename+".txt");
		
		element.style.display = 'none';
		document.body.appendChild(element);
		
		element.click();

		document.body.removeChild(element);
	}
    var $toolbar = $("<div class='toolbar-edit ol-control'>");
    var $btnExport = $("<button type='button' class='gis-button btn-export'></button>")
        .attr("title", "Экспорт нарисованных обьектов");
	//$toolbar.append($btnExport);
	$btnExport.click(function () {
		var features = vector.getSource().getFeatures();
		if(features&&features.length>0){
			var resultText = "";
			var format = new ol.format.WKT();
			for(var i=0;i<features.length;i++){
				resultText+=format.writeGeometry(features[i].getGeometry());
			}
			download("Drawn features", resultText);
		}
		else{
			alert("No features to export");
		}
    });
	
    var $drawPolygon = $("<button type='button' class='gis-button btn-draw-polygon'>Po</button>")
        .attr("title", "Draw polygon");
    $toolbar.append($drawPolygon);
    $drawPolygon.click(function () {
        activateTool(drawPolygon);

    });
    var $drawLine = $("<button type='button' class='gis-button btn-draw-line'>L</button>")
        .attr("title", "Draw line");
    $toolbar.append($drawLine);
    $drawLine.click(function () {
        activateTool(drawLine);

    });
    var $drawPoint = $("<button type='button' class='gis-button btn-draw-point'>P</button>")
        .attr("title", "Draw point");
    $toolbar.append($drawPoint);
    $drawPoint.click(function () {
        activateTool(drawPoint);

    });
    var $cutPolygon = $("<button type='button' class='gis-button btn-cut-polygon'>C</button>")
        .attr("title", "Cut polygon");
    $toolbar.append($cutPolygon);
    $cutPolygon.click(function () {
        activateTool(cutPolygon);
    });


    var $modify = $("<button type='button' class='gis-button btn-edit-feature'>M</button>")
        .attr("title", "Modify");
    $toolbar.append($modify);
    $modify.click(function () {
        activateTool(modify);
    });
    
    var $remove = $("<button type='button' class='gis-button btn-remove-feature'>R</button>")
        .attr("title", "Remove");
    $toolbar.append($remove);
    $remove.click(function() {
        activateTool(remove);
    });

    var $style = $("<button type='button' class='gis-button btn-style-feature'>S</button>")
       .attr("title", "Style feature");
    $toolbar.append($style);
    $style.click(function () {
        activateTool(style);
    });
    
    var $element = $('<div>');
    $element.addClass('ol-control gis-editor');
    $element.append($btnEdit);

    $btnEdit.click(function() {
		
		var map = that.getMap();
		//map.deactivateControls(that);
		if (that._inited != true) {
		    $(this).attr("title", "Choose control to start editing");
		    that.helpMsg = "Choose tool"
		    var map = that.getMap();
			$element.after($toolbar);
			$toolbar.show();
			that.getMap().addLayer(vector);
			for(var i = 0;i<tools.length;i++) {
				tools[i].init(map);
			};
			createHelpTooltip(map);
			map.on('pointermove', pointerMoveHandler);
			
			that._inited = true;
			
        }
		else if (that._inited == true) {
		    $(this).attr("title", "UncChoose control to finish editing");
			$toolbar.hide();
			vector.getSource().clear();
			map.removeLayer(vector);
			map.removeOverlay(helpTooltip);
			map.un('pointermove', pointerMoveHandler);
			that._inited = false;
		}
		for(var i = 0;i<tools.length;i++) {
				tools[i].setActive(false);
		};		
    });

	 this.onControlsDeactivate = function (sender) {
        if (sender == that) {
            return;
        }
        if (that._inited != true) {
            return;
        }
		for(var i = 0;i<tools.length;i++) {
				tools[i].setActive(false);
		};
        that.getMap().removeLayer(vector);
		$toolbar.hide();
		//$('.btn-gis-editor').css('background-color',app.controlButtonInActiveBackground);
		that._inited = false;
    };
	
    ol.control.Control.call(this, {
        element: $element[0],
        target: options.target
    });
};
ol.inherits(app.EditControl, ol.control.Control);