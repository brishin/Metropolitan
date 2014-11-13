angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, subwayStops) {
  $scope.currentPosition = {};
  $scope.prettyPrintPosition = '';
  $scope.subwayLines = Object.keys(subwayStops);
  $scope.selectedLine = $scope.subwayLines[0];

  navigator.geolocation.getCurrentPosition(function(position) {
    $scope.currentPosition = position;
    $scope.$apply();
  }, function(error) {
    alert('position error', error);
  });

  $scope.$watch('currentPosition', function(newPosition) {
    if (!newPosition || !newPosition.coords) {
      return;
    }

    $scope.prettyPrintPosition = newPosition.coords.latitude + ", " + newPosition.coords.longitude;
  });

  $scope.$watch('selectedLine', function(newLine) {
    $scope.activeStops = subwayStops[$scope.selectedLine];
  });
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
