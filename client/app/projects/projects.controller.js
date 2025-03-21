'use strict';

angular.module('observatory3App')
.controller('ProjectsCtrl', function ($scope, $http) {
    $scope.projects = [];
    $scope.projectToAdd = {active: true};

    $scope.getCurrentProjects = function() {
        $http.get('/api/projects').success(function(projects) {
            $scope.projects = projects;
        });
        $scope.past = false;
    };

    $scope.getPastProjects = function() {
        $http.get('/api/projects/past').success(function(projects) {
            $scope.projects = projects;
        });
        $scope.past = true;
    };

    $scope.getInfo = function() {
        if($scope.projectToAdd.repositoryUrl) {
            var splitUrl = $scope.projectToAdd.repositoryUrl.split('/');
            $scope.projectToAdd.githubUsername = splitUrl[splitUrl.length - 2];
            $scope.projectToAdd.githubProjectName = $scope.projectToAdd.name = splitUrl[splitUrl.length - 1];
            $.getJSON('https://api.github.com/repos/' + $scope.projectToAdd.githubUsername + '/' + $scope.projectToAdd.githubProjectName, function(response) {
                $scope.projectToAdd.websiteURL = response.homepage;
                $scope.projectToAdd.description = response.description;
                $scope.$apply();
            });
        }
    };

    $scope.submit = function(form) {
        $scope.submitted = true;

        if(form.$valid) {
            $scope.submitted = false;
            $('#addProject').modal('hide');
            // use setTimeout because hiding the modal takes longer than the post request
            // and results in the modal disappearing but the overlay staying if not used
            setTimeout(function() {
                $http.post('/api/projects', $scope.projectToAdd);
                $scope.projectToAdd = {active: true};
                if ($scope.past){
                    $scope.getPastProjects();
                }
                else{
                    $scope.getCurrentProjects();
                }
            }, 200);
        }
    };

    $scope.getCurrentProjects(); // update the webpage when connecting the controller
});
