inf5750-facilityreg
===================

UiO: Open Source Programming

http://inf5750-24.uio.no/apps/inf5750-facilityreg/

## Task

> Make an app with a nice search and presentation of org units / facilities, including all info and map with location

## Details

* Search bar smart filter
* Map with plotted locations
* Better popup menu
* Clicking on item will open up smart editor with details
* ...
* 


## The Api
The api we're primarily going to use can be explored at http://inf5750-24.uio.no/api/organisationUnits.json


    "level": 4,
    "name": "Air Port Centre, Luigi",
    "code": "OU_255017",
    "shortName": "Air Port Centre, Lungi",

    "featureType": "Point",
    "coordinates": "[-13.2027,8.6154]",

    "active": true,
    "displayName": "Air Port Centre, Luigi",
    "parent": {
        "id": "vn9KJsLyP5f",
    },
    "organisationUnitGroups": [
        {
            "id": "f25dqv3Y7Z0",
            "name": "Urban",
            "created": "2013-03-06T15:46:20.584+0000",
            "lastUpdated": "2013-03-06T15:46:20.584+0000",
            "href": "http://inf5750-24.uio.no/api/organisationUnitGroups/f25dqv3Y7Z0"
        }
    ],
    "dataSets": [
        {
            "id": "VTdjfLXXmoi",
            "name": "Clinical Monitoring Checklist ",
            "created": "2014-04-25T08:38:13.289+0000",
            "lastUpdated": "2014-04-30T10:53:55.960+0000",
            "href": "http://inf5750-24.uio.no/api/dataSets/VTdjfLXXmoi"
        }
    ],
