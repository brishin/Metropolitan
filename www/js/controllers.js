angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, subwayStops, Locator) {
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
