
console.log("In LoginController");
var myapp = angular.module("loginApp",['ngMaterial','ngRoute','ngMessages']);

myapp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/loginAgent', {
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        }).
        when('/home', {
            templateUrl: 'templates/home.html',
            controller: 'HomeController'
        }).
        when('/restaurantDNIS', {
            templateUrl: 'templates/restaurants.html',
            controller: 'RestaurantsController'
        }).
        when('/customerANI', {
            templateUrl: 'templates/customersani.html',
            controller: 'RestaurantsController'
        }).
        when('/createcustomer', {
            templateUrl: 'templates/createcustomers.html',
            controller: 'CustomersController'
        }).
        when('/updatecustomer', {
            templateUrl: 'templates/updatecustomer.html',
            controller: 'CustomersController'
        }).
        when('/deletecustomer', {
            templateUrl: 'templates/deletecustomer.html',
            controller: 'CustomersController'
        }).
        when('/createcustomeraddress', {
            templateUrl: 'templates/createcustomeraddress.html',
            controller: 'CustomerAddressController'
        }).
        when('/updatecustomeraddress', {
            templateUrl: 'templates/updatecustomeraddress.html',
            controller: 'CustomerAddressController'
        }).
        when('/deletecustomeraddress', {
            templateUrl: 'templates/deletecustomeraddress.html',
            controller: 'CustomerAddressController'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

myapp.controller('HomeController',['$scope','$http','$mdSidenav',function($scope,$http,$mdSidenav){
    $scope.toggleList=function(){
        $mdSidenav('left').toggle();
    }

    $("a").click(function() {
        $("a").closest('.sidenavapp').removeClass('selected');
        $(this).closest('.sidenavapp').addClass('selected');
        $scope.toggleList();
    });
}]);

myapp.controller('LoginController',['$scope','$http', function($scope,$http) {

    $scope.loginResponse =[{}];
   // $scope.userName="acaadmin";
    //$scope.password="Welcome1";
    $scope.authToken="";
    $scope.login=function(){
            console.log( $scope.userName);
            console.log( $scope.password);
            $scope.loginResponse =[{}];
            $http({
                method: 'POST',
                url: 'https://services.kiofc.com/api/51/api/callcenter/login',
                data: {
                    "userName": ""+$scope.userName+"",
                    "password": ""+ $scope.password+""
                }
            }).then(function(resp) {
                console.log("Inside");
                console.log(resp.data);
                $scope.loginResponse = resp.data;
                $scope.authToken=resp.data.AuthToken;
                if(typeof(Storage) !== "undefined") {
                   sessionStorage.setItem("authKey",$scope.authToken);
                } else {
                    console.log("No Session storage support");
                }
            }, function errorCallback(resp) {
                $scope.loginResponse = resp.data;
            });
    }

}]);

myapp.controller('RestaurantsController',['$scope','$http', function($scope,$http) {

    $scope.submit=function(){
        console.log( $scope.callCenterId);
        console.log( $scope.dnis);
        console.log("authkey:"+sessionStorage.getItem("authKey"));
        $scope.authKey = sessionStorage.getItem("authKey");
        if($scope.authKey == null){
            $scope.loginResponse ={"Message":"Could not validate user. Please login."};
        }else {
            $scope.loginResponse = [{}];
            $http({
                method: 'GET',
                headers: {
                    'authToken': $scope.authKey
                },
                url: "https://services.kiofc.com/api/51/api/callcenter/" + $scope.callCenterId + "/restaurants/" + $scope.dnis + "",
            }).then(function (resp) {
                console.log(resp.data.Restaurant);
                $scope.loginResponse = resp.data;
            }, function errorCallback(resp) {
                $scope.loginResponse = resp.data;
            });
        }
    }

    $scope.customersByANI=function(){

        console.log( $scope.ani);
        console.log("authkey:"+sessionStorage.getItem("authKey"));
        $scope.authKey = sessionStorage.getItem("authKey");
        if($scope.authKey == null){
            $scope.loginResponse ={"Message":"Could not validate user. Please login."};
        }else {
            $scope.loginResponse = [{}];
            $http({
                method: 'GET',
                headers: {
                    'authToken': $scope.authKey
                },
                url: "https://services.kiofc.com/api/51/api/callcenter/customers/" + $scope.ani + "",
            }).then(function (resp) {
                console.log(resp.data);
                $scope.loginResponse = resp.data;
            }, function errorCallback(resp) {
                $scope.loginResponse = resp.data;
            });
        }
    }
}]);

myapp.controller('CustomersController',['$scope','$http', function($scope,$http) {

     $scope.createCustomer=function(methodname) {
        console.log("customer id:"+$scope.customerid+" Phone:"+$scope.phone);
        console.log("authkey:" + sessionStorage.getItem("authKey"));
        $scope.Id = 0;
        if($scope.phone) {
            $scope.phoneNumber = "(" + $scope.phone.substr(0, 3) + ") " + $scope.phone.substr(3, 3) + "-" + $scope.phone.substr(6, 4);
        };
        $scope.url="https://services.kiofc.com/api/51/api/callcenter/customers";
        $scope.methodName="POST";
        $scope.paramData={
            "Customer": {
                "Addresses": [],
                "Id": $scope.Id,
                "FirstName": "" + $scope.firstName + "",
                "LastName": "" + $scope.lastName + "",
                "Phone": "" +  $scope.phoneNumber + "",
                "Email": "" + $scope.customeremail + "",
                "Notes": "",
                "IsDeleted": false
            }
        };
        if (methodname=='update') {
            console.log("update");
            $scope.Id = $scope.customerid;
            $scope.url="https://services.kiofc.com/api/51/api/callcenter/customers/"+$scope.Id+"";
            $scope.methodName="PUT";
            $scope.paramData={
                "Customer": {
                    "Addresses": [],
                    "Id": $scope.Id,
                    "FirstName": "" + $scope.firstName + "",
                    "LastName": "" + $scope.lastName + "",
                    "Phone": "" +  $scope.phoneNumber + "",
                    "Email": "" + $scope.customeremail + "",
                    "Notes": "",
                    "IsDeleted": false
                }
            };
        }else if (methodname=='delete') {
            $scope.Id = $scope.customerid;
            $scope.url="https://services.kiofc.com/api/51/api/callcenter/customers/"+$scope.Id+"";
            $scope.methodName="DELETE";
            $scope.paramData={};
        }

        console.log("ID:"+$scope.Id+" phone after:"+ $scope.phoneNumber+" Method Name:"+ $scope.methodName);
        $scope.authKey = sessionStorage.getItem("authKey");
        if ($scope.authKey == null) {
            $scope.loginResponse = {"Message": "Could not validate user. Please login."};
        } else {
            $scope.loginResponse = [{}];
            $http({
                method: ""+ $scope.methodName+"",
                headers: {
                    'authToken': $scope.authKey
                },
                data:$scope.paramData,
                url: ""+ $scope.url+"",
            }).then(function (resp) {
                console.log(resp.data);
                $scope.loginResponse = resp.data;
            }, function errorCallback(resp) {
                $scope.loginResponse = resp.data;
            });
        }
    }
}]);

myapp.controller('CustomerAddressController',['$scope','$http', function($scope,$http) {

    $scope.createCustomerAddress=function(methodname) {
        console.log("customer id:"+$scope.customerid+" Phone1:"+$scope.phone1+ " Phone2:"+$scope.phone2);
        console.log("authkey:" + sessionStorage.getItem("authKey"));
        $scope.Id = 0;
        if($scope.phone1) {
            $scope.phoneNumber1 = "(" + $scope.phone1.substr(0, 3) + ") " + $scope.phone1.substr(3, 3) + "-" + $scope.phone1.substr(6, 4);
        };
        if($scope.phone2) {
            $scope.phoneNumber2 = "(" + $scope.phone2.substr(0, 3) + ") " + $scope.phone2.substr(3, 3) + "-" + $scope.phone2.substr(6, 4);
        };
        $scope.url="https://services.kiofc.com/api/51/api/callcenter/customers/"+$scope.customerid+"/addresses";
        $scope.methodName="POST";
        $scope.paramData={
            "Address": {
                "Id": $scope.Id,
                "Address1": ""+$scope.address1+"",
                "Address2": ""+$scope.address2+"",
                "Address3": ""+$scope.address3+"",
                "PostalCode": ""+$scope.postalcode+"",
                "CustomerId": $scope.customerid,
                "City": ""+$scope.city+"",
                "Phone1": ""+$scope.phoneNumber1+"",
                "Phone2": ""+$scope.phoneNumber2+"",
                "Name": ""+$scope.name+"",
                "Instructions": null,
                "IsDeleted": false,
                "State": {
                    "Id": $scope.stateid,
                    "Code": ""+$scope.statecode+"",
                    "Name": ""+$scope.statename+"",
                },
                "Country": {
                    "Id": $scope.countryid,
                    "Code": ""+$scope.countrycode+"",
                    "Name": ""+$scope.countryname+""
                },
                "AddressType": {
                    "Id": $scope.addresstypeid,
                    "Name": ""+$scope.addresstypename+"",
                }
            }
        };
        if (methodname=='update') {
            console.log("update");
            $scope.Id = $scope.addressid;
            $scope.url="https://services.kiofc.com/api/51/api/callcenter/customers/"+$scope.customerid+"/addresses/"+$scope.Id+"";
            $scope.methodName="PUT";
            $scope.paramData={
                "Address": {
                    "Id": $scope.Id,
                    "Address1": ""+$scope.address1+"",
                    "Address2": ""+$scope.address2+"",
                    "Address3": ""+$scope.address3+"",
                    "PostalCode": ""+$scope.postalcode+"",
                    "CustomerId": $scope.customerid,
                    "City": ""+$scope.city+"",
                    "Phone1": ""+$scope.phoneNumber1+"",
                    "Phone2": ""+$scope.phoneNumber2+"",
                    "Name": ""+$scope.name+"",
                    "Instructions": null,
                    "IsDeleted": false,
                    "State": {
                        "Id": $scope.stateid,
                        "Code": ""+$scope.statecode+"",
                        "Name": ""+$scope.statename+"",
                    },
                    "Country": {
                        "Id": $scope.countryid,
                        "Code": ""+$scope.countrycode+"",
                        "Name": ""+$scope.countryname+""
                    },
                    "AddressType": {
                        "Id": $scope.addresstypeid,
                        "Name": ""+$scope.addresstypename+"",
                    }
                }
            };
        }else if (methodname=='delete') {
            $scope.Id = $scope.addressid;
            $scope.url="https://services.kiofc.com/api/51/api/callcenter/customers/"+$scope.customerid+"/addresses/"+$scope.Id+"";
            $scope.methodName="DELETE";
            $scope.paramData={};
        }

        console.log("ID:"+$scope.Id+" phone after:"+ $scope.phoneNumber+" Method Name:"+ $scope.methodName);
        $scope.authKey = sessionStorage.getItem("authKey");
        if ($scope.authKey == null) {
            $scope.loginResponse = {"Message": "Could not validate user. Please login."};
        } else {
            $scope.loginResponse = [{}];
            $http({
                method: ""+ $scope.methodName+"",
                headers: {
                    'authToken': $scope.authKey
                },
                data:$scope.paramData,
                url: ""+ $scope.url+"",
            }).then(function (resp) {
                console.log(resp.data);
                $scope.loginResponse = resp.data;
            }, function errorCallback(resp) {
                $scope.loginResponse = resp.data;
            });
        }
    }
}]);