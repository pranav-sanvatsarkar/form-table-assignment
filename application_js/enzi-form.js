angular.module('enzi-form', [])
.directive('enziForm', function () {
    return {
        scope:{
            record: '=',
            fields: '=',
            columns: '=',
            title: '@',
            action: '@',
            callback: '&'
        },
        templateUrl: application_js + 'templates/enzi-form.html',
        controller: ['$scope', '$element', '$enziForm', function ($scope, $element, $enziForm) {
            $scope.close = function () {
                $element.remove();
            }
            $scope.save = function () {
                $scope.callback($scope.record);
            }
        }]
    }
})
.directive('enziFormField', function () {
    return {
        scope: {
            field: '=',
            record: '=',
            styleClass: '@styleclass'
        },
        controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
            var input = '';
            switch ($scope.field.type) {
                case 'picklist': {
                    if ($scope.field.dependsOn) {
                        input += '<label for="{{field.name}}">{{field.label}}</label><select name="{{field.name}}" id="{{field.name}}" class="{{styleClass}}" type="{{field.type}}" ng-model="record[field.name]" ng-options="p as p for p in field.picklistValues[record[field.dependsOn]]" ng-required="field.required"><option value="" disabled selected>{{field.label}}</option></select>';
                        $scope.$watch("record." + $scope.field.dependsOn, function () {
                            $scope.record[$scope.field.name] = $scope.field.label;
                        });
                    }
                    else
                        input += '<label for="{{field.name}}">{{field.label}}</label><select name="{{field.name}}" id="{{field.name}}" class="{{styleClass}}" type="{{field.type}}" ng-model="record[field.name]" ng-options="p as p for p in field.picklistValues" ng-required="field.required"><option value="" disabled selected>{{field.label}}</option></select>'
                    break;
                };
                default: {
                    input += '<label for="{{field.name}}">{{field.label}}</label><input name="{{field.name}}" id="{{field.name}}" class="{{styleClass}}" type="{{field.type}}" ng-model="record[field.name]"  />';
                    break;
                }
            }
            input = angular.element(input);
            input = $compile(input)($scope);
            $element.append(input);
        }]
    };
})