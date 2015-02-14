angular.module('enzi-table', [])
.directive('enziField', function () {
    return {
        controller: ['$scope', '$element', '$compile', '$attrs', function ($scope, $element, $compile, $attrs) {
            var fieldName = $attrs.enziField;
            var field = $scope.fieldsmap[fieldName];
            var input = '<form name="inlineEdit">';
            switch (field.type) {
                case 'textarea': input += '<textarea ng-blur="updateField(\'' + fieldName + '\')" type="' + field.type + '" ng-model="record[\'' + fieldName + '\']" ></textarea>'; break;
                default: input += '<input ng-blur="updateField(\'' + fieldName + '\')" type="' + field.type + '" ng-model="record[\'' + fieldName + '\']" />'; break;
            }
            input += '</form>';
            input = angular.element(input);
            $element.append($compile(input)($scope));
            setTimeout(function () { input.focus(); }, 100);
        }]
    }
})
.directive('enziRow', function () {
    return {
        scope: {
            record: '=enziRow',
            fields: '=',
            columns: '=',
            fieldsmap: '=',
            columnsmap: '=',
        },
        controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
            var row = '';
            $scope.editor = {};
            angular.forEach($scope.columns, function (column) {
                row += '<td id="' + $scope.record.Id + '_' + column.name + '" ng-click="onedit(\'' + column.name + '\')"><span ng-hide="editor.' + column.name + '">' + column.template + '</span></td>';
            })
            $element.append($compile(angular.element(row))($scope));

            $scope.onedit = function (columnName) {
                if (!$scope.editor[columnName]) {
                    $scope.editor[columnName] = true;
                    var column = $scope.columnsmap[columnName];
                    var editFields = column.editFields.split(',');
                    if (editFields.length == 1) {
                        $element.find('#' + $scope.record.Id + '_' + columnName).append($compile('<span enzi-field="' + editFields[0] + '"></span>')($scope));
                    }
                    else {
                        var inputs = '';
                        angular.forEach(editFields, function (fieldName) {
                            inputs += '<span enzi-field="' + fieldName + '"></span>';
                        })
                        inputs += '';
                        $element.find('#' + $scope.record.Id + '_' + columnName).append($compile(inputs)($scope));
                    }
                        
                }
            }

            $scope.updateField = function (columnName) {
                var input = $element.find('#' + $scope.record.Id + '_' + columnName).find('[enzi-field]');
                if (!$scope.inlineEdit.$invalid) {
                    $scope.editor[columnName] = false;
                    input.remove();
                }
            }
        }]
    }
})
.directive('enziTable', function () {
    return {
        templateUrl: application_js + 'templates/enzi-table.htm',
        scope: {
            records: '=',
            fields: '=',
            columns: '=',
            ondelete: '&',
            onedit: '&',
        },
        controller: ['$scope', '$element', '$compile', function ($scope, $element, $compile) {
            $scope.fieldsMap = {};
            angular.forEach($scope.fields, function (field) { $scope.fieldsMap[field.name] = field; });

            $scope.columnsMap = {};
            angular.forEach($scope.columns, function (column) { $scope.columnsMap[column.name] = column; });

            $scope.editRecord = function (record) {
                $scope.onedit({
                    record: record, onsuccess: function (recordUpdated) {
                        var found = $scope.records.indexOf(record);
                        if (found >= 0)
                            $scope.records.splice(found, 1, recordUpdated);
                    }
                });
            };
            $scope.deleteRecord = function (record) {
                if (confirm('Are you sure you want to delete the record?')) {
                    $scope.ondelete({
                        record: record, onsuccess: function () {
                            var found = $scope.records.indexOf(record);
                            if (found >= 0)
                                $scope.records.splice(found, 1);
                        }
                    });
                }
            };
        }]
    }
})