angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
  $scope.currentPosition = {};
  $scope.prettyPrintPosition = '';

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
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
