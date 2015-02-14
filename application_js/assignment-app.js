angular.module('assignment-app', ['enzi-table', 'enzi-form'])
.factory('$enziForm', ['$rootScope', '$compile', function ($rootScope, $compile) {
    var $enziForm = {
        loadForm: function (fields, record, columns, records) {
            $rootScope.fields = fields;
            $rootScope.record = record;
            $rootScope.records = records;
            $rootScope.columns = columns;
            var dialog;
            var $enziForm = {
                updateRecords: function (record) {
                    $rootScope.records.push(record);
                    dialog.remove();
                }
            }
            $rootScope.$enziForm = $enziForm;
            if (record)
                dialog = angular.element('<div enzi-form="" record="record" fields="fields" columns="columns" action="Save" title="Update record" callback="$enziForm.updateRecords(record)">');
            else {
                $rootScope.record = {};
                dialog = angular.element('<div enzi-form="" record="record" fields="fields" columns="columns" action="Create" title="Create record" callback="$enziForm.updateRecords(record)">');
            }
            dialog = $compile(dialog)($rootScope);
            $('body').append(dialog);
        }
    };
    return $enziForm;
}])
.controller('appController', ['$scope', '$enziForm', function ($scope, $enziForm) {
    $scope.fields = [
	    { name: 'Id', label: 'Id', type: 'number', required: true },
        { name: 'EmployeeId', label: 'Employee Id', type: 'text', required: true },
	    { name: 'FirstName', label: 'First Name', type: 'text', required: true },
        { name: 'LastName', label: 'Last Name', type: 'text', required: true },
	    { name: 'Email', label: 'Email', type: 'email', required: false },
	    { name: 'MailingStreet', label: 'Street', type: 'textarea' },
        { name: 'MailingCity', label: 'City', type: 'text' },
        { name: 'Phone', label: 'Phone', type: 'phone' },
	    { name: 'DOB', label: 'Date of Birth', type: 'date', required: false },
	    { name: 'MailingCountry', label: 'Country', type: 'picklist', required: false, picklistValues: ['India', 'United States'] },
	    { name: 'MailingState', label: 'State', type: 'picklist', required: false, picklistValues: { "India": ['Gujarat', 'Maharashtra'], 'United States': ['California', 'New York'] }, dependsOn: 'MailingCountry' },
    ];

    $scope.columns = [
        { name: 'Id', label: 'Id', template: "{{record.Id}}" },
        { name: 'EmployeeId', label: 'Employee Id', template: "{{record.EmployeeId}}", editFields: 'EmployeeId' },
	    { name: 'FirstName', label: 'First Name', template: "{{record.FirstName}}", editFields: 'FirstName' },
	    { name: 'LastName', label: 'Last Name', template: "{{record.LastName}}", editFields: 'LastName' },
	    { name: 'Email', label: 'Email', template: "{{record.Email}}", editFields: 'Email' },
        { name: 'Address', label: 'Address', template: "{{record.MailingStreet + ',' + record.MailingCountry}}", editFields: 'MailingCountry, MailingState, MailingCity, MailingStreet' },
	    { name: 'Phone', label: 'Phone', template: "{{record.Phone}}", editFields: 'Phone' },
	    { name: 'DOB', label: 'Date of Birth', template: "{{record.DOB | date : shortDate}}", editFields: 'DOB' }
    ];

    $scope.records = [
        { Id: 1, EmployeeId: '123', FirstName: 'User', LastName: '1', Email: 'user1@test.com', MailingStreet: 'Street1', MailingCity: 'City1', DOB: new Date(), MailingCountry: 'India', MailingState: 'Maharashtra' },
        { Id: 2, EmployeeId: '234', FirstName: 'User', LastName: '2', Email: 'user2@test.com', MailingStreet: 'Street1', MailingCity: 'City1', DOB: new Date(), MailingCountry: 'India', MailingState: 'Maharashtra' },
        { Id: 3, EmployeeId: '456', FirstName: 'User', LastName: '3', Email: 'user3@test.com', MailingStreet: 'Street1', MailingCity: 'City1', DOB: new Date(), MailingCountry: 'India', MailingState: 'Maharashtra' }];

    $scope.DeleteRecord = function (record, onsuccess) {
        $scope.records.splice($scope.records.indexOf(record), 1);
        //Use code to delete record from Salesforce and on success call the onsuccess function
        //onsuccess();
    }

    $scope.EditRecord = function (record, onsuccess) {
        $enziForm.loadForm($scope.fields, record, $scope.columns, $scope.records);
        //var recordUpdated = angular.copy(record);
        //recordUpdated.LastName += 2;
        //onsuccess(recordUpdated);
    }

    $scope.CreateRecord = function () {
        $enziForm.loadForm($scope.fields, undefined, $scope.columns, $scope.records);
    }

    $scope.update = function (record) {
        $scope.records.push(record);
    }
}])