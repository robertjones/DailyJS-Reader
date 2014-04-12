'use strict';

angular.module('djsreaderApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    $scope.refreshInterval = 60;

    // var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'http%3A%2F%2Fdailyjs.com%2Fatom.xml'%20and%20itemPath%3D'feed.entry'&format=json&diagnostics=true&callback=JSON_CALLBACK";

    // $http.jsonp(url).
    //   success(function(data, status, headers, config) {
    //     $scope.feed = {
    //       title: 'DailyJS',
    //       items: data.query.results.entry
    //     };
    //   }).
    //   error(function(data, status, headers, config) {
    //     console.error('Error fetchng feed:', data);
    //   });

    $scope.feeds = [{
      url: 'http://dailyjs.com/atom.xml',
      items: [ /* Blog posts go here */ ]
    }]

    $scope.addFeed = function(feed) {
      $scope.feeds.push(feed);
      $scope.fetchFeed(feed);
      $scope.newFeed = {};
    };

    $scope.fetchFeed = function(feed) {
      feed.items = [];

      var apiURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'";
      apiURL += encodeURIComponent(feed.url);
      apiURL += "'%20and%20itemPath%3D'feed.entry'&format=json&diagnostics=true&callback=JSON_CALLBACK";

      $http.jsonp(apiURL).
        success(function(data, status, headers, config) {
          if (data.query.results) {
            feed.items = data.query.results.entry;
          }
        }).
        error(function(data, status, headers, config) {
          console.error('Error fetching feed:', data);
        });
    };

    $scope.deleteFeed = function(feed) {
      $scope.feeds.spice($scope.feeds.indexOf(feed), 1);
    };

    $timeout(function() { $scope.fetchFeed(feed); }, $scope.refreshInterval * 1000 );


  });
