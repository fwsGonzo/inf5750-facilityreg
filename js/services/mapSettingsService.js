'use strict';

angular.module('facilityReg.services').
    factory('mapSettingsService', function() {
        return {
            standardSettings: {
                defaults: {
                    scrollWheelZoom: false,
                    zoomLevel: 12
                },
                center: {
                    lat: 8.3,
                    lng: -11.3,
                    zoom: 10
                },
                layers: {
                    baselayers: {
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        },
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
                            name: 'Google Hybrid',
                            layerType: 'HYBRID',
                            type: 'google'
                        }
                    }
                }
            }
        }
    });