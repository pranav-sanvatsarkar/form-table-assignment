angular.module('enzi-form', [])
.controller('testEnziForm', ['$scope', 'enziForm', function ($scope, enziForm) {
	var fields = [
		{ name: 'FirstName', label: 'First Name', type: 'text' },
		{ name: 'Last Name', label: 'Last Name', type: 'text' },
		{ name: 'Email', label: 'Email', type: 'email', required: false },
		{ name: 'Phone', label: 'Phone', type: 'phone' },
		{ name: 'StartDate', label: 'Start Date', type: 'date', required: false },
		{ name: 'EndTime', label: 'End Time', type: 'datetime-local', required: false },
		{ name: 'Country', label: 'Country', type: 'picklist', required: true, picklistValues: ['India', 'United States'] },
		{ name: 'State', label: 'State', type: 'picklist', required: true, picklistValues: {"India" : ['Gujarat','Maharashtra'], 'United States': ['California', 'New York']}, dependsOn: 'Country' },
	];

	enziForm.showForm('Create Record', fields, {}, function (record, onsuccess) {
		alert('save');
	}, function (record) {
		alert('cancel');
	});
}])
.factory('enziForm', ['$rootScope', '$compile', function ($rootScope, $compile) {
	var enziForm = {
		showForm: function (title, fields, record, onsave, oncancel) {
			$rootScope.fields = fields;
			$rootScope.record = record;
			$rootScope.onsave = onsave;
			$rootScope.oncancel = oncancel;
			$rootScope.title = title;
			var form = angular.element('<style>.ng-invalid {border-color: red;}</style>\
<div class="modal-dialog modal-fullscreen"><div class="modal-content">\
<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="cancel()"><span aria-hidden="true">&times;</span></button><h4 class="modal-title" id="myModalLabel">{{title}}</h4></div>\
<div class="modal-body"><form role="form" name="formEnzi" enzi-form="fields" title="title" record="record" onsave="onsave(record)" oncancel="oncancel(record)" ></form></div>\
<div class="modal-footer"><button class="btn btn-primary" ng-click="save()" ng-disabled="formEnzi.$invalid">Save</button></div></div>');
			form = $compile(form)($rootScope);
			$('body').append(form);
		}
	};
	return enziForm;
}])
.directive('enziField', function () {
	return {
		scope: {
			field: '=enziField',
			record: '=',
			form: '=',
		},
		controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
			var formControl;
			switch ($scope.field.type) {
				case 'picklist':
					if ($scope.field.dependsOn) {

						//In case of dependent picklist, current field values should be retrieved based on dependsOn field value
						formControl = angular.element('<label for="{{field.name}}">{{field.label}}</label>\
						<select name="{{field.name}}" id="{{field.name}}" class="form-control" type="{{field.type}}" ng-model="record[field.name]" ng-options="p as p for p in field.picklistValues[record[field.dependsOn]]" ng-required="field.required" >\
						<option value="" disabled selected>{{field.label}}</option></select>');

						//Watch on dependsOnf field, so if that changes current field should reset to blank
						$scope.$watch("record." + $scope.field.dependsOn, function () {
							$scope.record[$scope.field.name] = '';
						})
					}
					else {
						//Regular picklist where values in current picklist does not depend on any other picklist or field
						formControl = angular.element('<label for="{{field.name}}">{{field.label}}</label>\
					<select name="{{field.name}}" id="{{field.name}}" class="form-control" type="{{field.type}}" ng-model="record[field.name]" ng-options="p as p for p in field.picklistValues" ng-required="field.required" >\
					<option value="" disabled selected>{{field.label}}</option></select>');
					}
					break;
				default:
					formControl = angular.element('<label for="{{field.name}}">{{field.label}}</label>\
					<input name="{{field.name}}" id="{{field.name}}" class="form-control" type="{{field.type}}" ng-model="record[field.name]" placeholder="{{field.label}}" ng-required="field.required" />');
			}
			//Order is very important for form validations to work, first element should be added to DOM and then compiled.
			$element.append(formControl);
			formControl = $compile(formControl)($scope);
		}]
	}
})
.directive('enziForm', function () {
	return {
		template: '<div class="form-group" ng-repeat="f in fields" enzi-field="f" record="record" form="formEnzi"></div>',
		scope: {
			title: '=',
			fields: '=enziForm',
			record: '=',
			onsave: '&',
			oncancel: '&',
		},
		controller: ['$scope', '$filter', '$rootScope', '$element', function ($scope, $filter, $rootScope, $element) {
			$scope.save = function () {
				if ($scope.formEnzi.$valid) {
					if ($scope.save) {
						$scope.onsave({
							record: angular.copy($scope.record),
							onsuccess: function () {
							},
						});
					}
				}
			}

			$scope.cancel = function () {
				$element.remove();
				if ($scope.oncancel) $scope.oncancel({ record: angular.copy($scope.record) });
			}
		}]
	}
})