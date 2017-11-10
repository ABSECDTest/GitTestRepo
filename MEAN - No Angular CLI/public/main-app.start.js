"use strict";

angular.module('MainApp', [
])

.controller("MainController", function ($scope, $http) {
    //initialize scope variables
    $scope.people = [];
    $scope._name = "Default Name";
    $scope._location = "Default Location";
    $scope.user = {
        name: function (theName) {
            if (angular.isDefined(theName)) {
                $scope._name = theName;
            }
            return $scope._name;
        }(),
        location: function (theLocation) {
            if (angular.isDefined(theLocation)) {
                $scope._location = theLocation;
            }
            return $scope._location;
        }()
    };

    //initialize config for headers
    var config = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'ZUMO-API-VERSION': '2.0.0'
        },
    };


    //call getNames function
    getNames();

    function getNames() {
        $http.get('/api/users', config)
     .then(function (res) {
         console.log(res);
         $scope.people = res.data;
     });
    }

    // add in resource 
    function addName(user) {
        alert("about to post!")
        $http.post('https://test-evangelists-1.azurewebsites.net/tables/people', user, config)
          .then(function (res) {
              $scope.getNames();
          });
    }

    function delName(user) {
        var confirmres = confirm("You are about to delete this record. Action cannot be undone. Continue?");
        var retrievedId = "";

        if (confirmres == true) {
            //get the ID via web service
            $http.get('\\angular\\EvangelistsWebService.asmx/GetId', {
                params: { name: user.name, location: user.location },
                headers: { 'Access-Control-Allow-Origin': '*', 'ZUMO-API-VERSION': '2.0.0' },
                dataType: "json",
                contentType: "application/json; charset=utf-8"
            })
               .then(function (res) {
                   $scope.retData = res.data;
                   var obj = JSON.parse($scope.retData);
                   angular.forEach(obj, function (item) {
                       if (item.length == 0)
                           alert('No data found');
                       else {
                           //perform delete after getting the ID and append it to url
                           $http.delete('https://test-evangelists-1.azurewebsites.net/tables/people/' + item.id, config)
                             .then(function (res) {
                                 $scope.getNames();
                             });
                           alert(item.id + ' deleted');
                       }
                   });
               });
        }
    }

    $scope.addName = addName;
    $scope.getNames = getNames;
    $scope.delName = delName;

})

