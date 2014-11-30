angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $firebase, subwayStops, Locator) {
  $scope.currentPosition = {};
  $scope.prettyPrintPosition = '';
  $scope.subwayLines = Object.keys(subwayStops);
  $scope.selectedLine = $scope.subwayLines[0];

  Locator.on('positionUpdated', function(newPosition) {
    $scope.currentPosition = newPosition;
    $scope.$apply();
  });
  Locator.init();

  $scope.$watch('currentPosition', function(newPosition) {
    if (!newPosition || !newPosition.coords) {
      return;
    }

    $scope.prettyPrintPosition = newPosition.coords.latitude + ", " + newPosition.coords.longitude;
  });

  $scope.$watch('selectedLine', function(newLine) {
    $scope.activeStops = subwayStops[$scope.selectedLine];
  });

  $scope.stopTapped = function(stop) {
    console.log('stopTapped', stop);
    var promise = Locator.getPosition();
    promise.then(
        function(result){
            var data = {};
            data.name = stop.name;
            data.location = {};
            data.location.lat = stop.location[0];
            data.location.long = stop.location[1];
            data.measured = result.coords;
            data.timestamp = result.timestamp;
            var ref = new Firebase("https://metropolitan.firebaseio.com/data");
            var sync = $firebase(ref);
            sync.$push(data);
            console.log(data);
        }
    );
  };
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
