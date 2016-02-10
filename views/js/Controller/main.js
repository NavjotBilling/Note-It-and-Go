
	angular.module('todoController', [])
	.controller('mainController', ['$scope','$http','Todos', function($scope, $http, Todos) {
		$scope.formData = {};
		$scope.loading = true;

		// shows all the the todos
		Todos.get()
			.success(function(data) {
				$scope.todos = data;
				$scope.loading = false;
			});

				// create the note
		$scope.createTodo = function() {
			if ($scope.formData.text != undefined) {
				$scope.loading = true;
				Todos.create($scope.formData)
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {};
						$scope.todos = data;
					});
			}
		};

				// delete the note after checking it
		$scope.deleteTodo = function(id) {
					$scope.loading = true;
					Todos.delete(id)
					.success(function(data) {
					$scope.loading = false;
					$scope.todos = data;
				});
		};
	}]);