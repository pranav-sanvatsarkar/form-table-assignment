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
                row += '<td id="' + $scope.record.Id + '_' + column.name + '" ng-dblclick="onedit(\'' + column.name + '\')"><span ng-hide="editor.' + column.name + '">' + column.template + '</span></td>';
            })
            $element.append($compile(angular.element(row))($scope));

            $scope.onedit = function (columnName) {
                if (!$scope.editor[columnName]) {
                    var column = $scope.columnsmap[columnName];
                    if (column.editFields) {
                        $scope.editor[columnName] = true;
                        var editFields = column.editFields.split(',');
                        if (editFields.length == 1) {
                            $element.find('#' + $scope.record.Id + '_' + columnName).append($compile('<span enzi-field="' + editFields[0] + '"></span>')($scope));
                        }
                        else {
                            $scope.oldRecord = {};
                            angular.forEach(editFields, function (field) {
                                $scope.oldRecord[field.trim()] = $scope.record[field.trim()];
                            });
                            var inputs = '<div class="modal fade in" style="display:block;" id="addressForm">\
                                <div class="modal-dialog">\
                                <div class="modal-content">\
                                    <div class="modal-header">\
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="closeDialog(\'' + columnName + '\',\'addressForm\')">×</button>\
                                    <h4 class="modal-title">Address</h4>\
                                    </div>\
                                    <div class="modal-body">';
                            angular.forEach(editFields, function (fieldName) {
                                inputs += '<span enzi-field="' + fieldName + '"></span>';
                            })
                            inputs += '   </div>\
                                    <div class="modal-footer">\
                            <button class="btn btn-primary" ng-click="saveRecord(\'' + columnName + '\',\'addressForm\')">Save</button></div>\
                            </div>\
                            </div>\
                            </div>';
                            $element.find('#' + $scope.record.Id + '_' + columnName).append($compile(inputs)($scope));
                        }
                    }
                        
                }
            }
            $scope.saveRecord = function (columnName, elementId) {
                $('#' + elementId).remove();
                $scope.editor[columnName] = false;
            }
            $scope.closeDialog = function (columnName, elementId) {
                var column = $scope.columnsmap[columnName];
                if (column.editFields) {
                    angular.forEach(column.editFields.split(','), function (field) {
                        $scope.record[field.trim()] = $scope.oldRecord[field.trim()];
                    });
                }
                $('#' + elementId).remove();
                $scope.editor[columnName] = false;
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