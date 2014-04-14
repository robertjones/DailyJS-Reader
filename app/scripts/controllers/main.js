'use strict';

angular.module('djsreaderApp')
  .controller('MainCtrl', function ($scope, $http, $timeout, $filter) {
    $scope.refreshInterval = 60;

    $scope.stories = [];

    $scope.feeds = [{
      url: 'http://dailyjs.com/atom.xml',
      items: [ /* Blog posts go here */ ]
    }]

    function storyInCollection(story) {
      for (var i = 0; i < $scope.stories.length; i++) {
        if ($scope.stories[i].id === story.id) {
          return true;
        }
      }
      return false;
    }

    function addStories(stories) {
      var changed = false;
      angular.forEach(stories, function(story, key) {
        if (!storyInCollection(story)) {
          $scope.stories.push(story);
          changed = true;
        }
      });
      if (changed) {
        $scope.stories = $filter('orderBy')($scope.stories, '-updated');
      }
    }

    $scope.addFeed = function(feed) {
      if (feed.$valid) {
        var newFeed = angular.copy(feed);
        $scope.feeds.push(newFeed);
        $scope.fetchFeed(newFeed);
        $scope.newFeed.url = '';
      }
    };

    $scope.fetchFeed = function(feed) {
      feed.items = [];

      var apiURL = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'";
      apiURL += encodeURIComponent(feed.url);
      apiURL += "'%20and%20itemPath%3D'feed.entry'&format=json&diagnostics=true&callback=JSON_CALLBACK";

      $http.jsonp(apiURL).
        success(function(data) {
          if (data.query.results) {
            feed.items = data.query.results.entry;
          }
          addStories(feed.items);
        }).
        error(function(data) {
          console.error('Error fetching feed:', data);
        });
    };

    $scope.deleteFeed = function(feed) {
      $scope.feeds.spice($scope.feeds.indexOf(feed), 1);
    };

  });
