angular.module('enzi-lookup', [])
.controller('testEnziLookup', ['$scope', function ($scope) {
	//$scope.records = [{ Id: 1, Name: 'Test 1' }, { Id: 2, Name: 'Test 2' }, { Id: 3, Name: 'Test 3' }, { Id: 4, Name: 'Test 4' }];
	//$scope.selected = $scope.records[2];
	$scope.getdata = function (onsuccess) {
		$scope.records = [{ Id: 1, Name: 'Test 1' }, { Id: 2, Name: 'Test 2' }, { Id: 3, Name: 'Test 3' }, { Id: 4, Name: 'Test 4' }];
		$scope.selected = $scope.records[2];
		onsuccess($scope.records, $scope.selected);
	}

	$scope.onselected = function (record) {
		alert(record.Name);
	}
}])
.directive('enziLookup', function () {
	return {
		template:
'<style>.autocomplete{position: relative;} .autocomplete input.focussed + .datalist{display:block;} .datalist{display:none;position: absolute; left: 0; top: 30px;} .list-group-item {min-width: 200px;} .list-group-item{}</style>\
<div class="autocomplete" ><input class="search" type="text" ng-model="enteredtext" ng-focus="onfocus($event)" ng-blur="onblur($event)" ng-keydown="onkeydown($event)" />\
<div class="datalist list-group">\
<a class="list-group-item" href="#" ng-click="onclick(r)" ng-class="{active: selectedIndex == $index}" href="#" ng-repeat="r in records | filter:enteredtext as filteredRecords" value="r.Id" ng-mouseover="onitemmouseover($event, $index)" ng-mouseout="onitemmouseout($event)">{{r[displayfield]}}</a>\
</div>\
</div>',
		scope: {
			recordsSupplied: '=records',
			getrecords: '&',
			onselected: '&',
			field: '=',
			selected: '=ngModel'
		},
		controller: ['$scope', '$filter', '$rootScope', function ($scope, $filter, $rootScope) {
			$scope.selectedIndex = -1;
			if (!$scope.field)
				$scope.displayfield = 'Name';

			$scope.setSelected = function (record) {
				if (record && $scope.records) {
					$scope.selectedIndex = $scope.records.indexOf(record);
					if ($scope.selectedIndex >= 0) {
						if ($scope.selected )
							$scope.selected = record;
						$scope.enteredtext = record[$scope.displayfield];
						if ($scope.onselected )
							$scope.onselected({ record: record });
					}
				}
			}

			//Use records supplied if are provided otherwise use callback to get records
			if ($scope.recordsSupplied) {
				$scope.records = $scope.recordsSupplied;
				$scope.setSelected($scope.selected);
			}
			else {
				$scope.getrecords({
					onsuccess: function (records, selected) {
						$scope.records = records;
						$scope.setSelected(selected);
						if (!$rootScope.$$phase)
							$scope.$apply();
					}
				});
			}

			$scope.onfocus = function (event) { $(event.target).addClass('focussed'); }
			$scope.onblur = function (event) { setTimeout(function () { $(event.target).removeClass('focussed') }, 200); }

			$scope.onkeydown = function (event) {
				$(event.target).addClass('focussed');
				switch (event.keyCode) {
					//Down key
					case 40:
						var recordCount = $filter('filter')($scope.records, $scope.enteredtext).length;
						if ($scope.selectedIndex < recordCount - 1)
							++$scope.selectedIndex;
						else
							$scope.selectedIndex = recordCount - 1;
							break;
					//Up key
					case 38:
						var recordCount = $filter('filter')($scope.records, $scope.enteredtext).length;
						if ($scope.selectedIndex > 0)
							--$scope.selectedIndex;
						break;
						//Enter key
					case 13:
						$(event.target).removeClass('focussed');
						var record = $filter('filter')($scope.records, $scope.enteredtext)[$scope.selectedIndex];
						$scope.setSelected(record);		
						break;
				}
			}

			$scope.onclick = function (record) {
				$scope.setSelected(record);
			}

			$scope.onitemmouseover = function (event, index) {
				//$(event.target).addClass('active');
				$scope.selectedIndex = index;
			}
			$scope.onitemmouseout = function (event) {
				//$(event.target).removeClass('active');
			}
		}]
	}
})