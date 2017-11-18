"use strict";

/* =========REVISION HISTORY========================================================
* 11/6 - Initial. Written for Azure App Service and MEAN                           *
* 11/17 - Changed approach for ASP MVC                                             *
*                                                                                  *
*                                                                                  *
*==================================================================================*/

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
            'Content-Type': 'application/x-www-form-urlencoded',
            'ZUMO-API-VERSION': '2.0.0'
        },

    };

    var configPost = {
        headers: {
            'ZUMO-API-VERSION': '2.0.0'
        },

    };

    //call getNames function
    getNames();


    function getNames() {
    //     $http.get('http://10.47.1.249:8090/tables', config)
    //  .then(function (res) {
    //      console.log(res);
    //      var data = JSON.parse(JSON.stringify(res.data.data));
    //      $scope.people = data;
    //  });

            $http.get('http://10.47.1.249:8090/tables', {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            })
            .success(function (res) {
                console.log(res);
                $scope.people = res.data;
            });
    }

    // add in resource 
    function addName(user) {
        alert("about to post!")
        // var params = user;
        // $http.post('http://localhost:64418/tables/create', user, configPost)
        //   .then(function (res) {
        //       $scope.getNames();
        //   });

        $http.get('http://10.47.1.249:8090/tables/details', {
            params: { name: user.name, location: user.location },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
        }).then(function(res)
        {
            if (res.data.data.length > 0)
            {
                alert('User exists in the database!');
            }
            else
            {
                $http({
                    method: 'POST',
                    url: 'http://localhost:64418/tables/create',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                        var str = [];
                        for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    data: {Name: $scope._name, Location: $scope._location}
                        }).success(function () {
                            $scope.getNames();
                        });
            }
        })          
    }

    function delName(user) {
        var confirmres = confirm("You are about to delete this record. Action cannot be undone. Continue?");
        var retrievedId = "";

        if (confirmres == true) {
            //get the ID via web service
            $http.get('http://10.47.1.249:8090/tables/details', {
                params: { name: user.name, location: user.location },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            })
               .then(function (res) {
                   $scope.retData = res.data;
                   //var obj = JSON.parse($scope.retData);
                   angular.forEach($scope.retData.data, function (item) {
                       if (item._id == null)
                           alert('No data found');
                       else {
                           //perform delete after getting the ID and append it to url
                           $http.delete('http://localhost:64418/tables/delete', {
                            params: { id: item._id},
                            headers: { 'Content-Type': 'text/plain'}
                           })
                             .then(function (res) {
                                 alert(item._id + ' deleted');
                                 $scope.getNames();
                             });
                          
                       }
                   });
               });
        }
    }

    $scope.addName = addName;
    $scope.getNames = getNames;
    $scope.delName = delName;

})

