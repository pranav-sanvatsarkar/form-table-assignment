angular.module('assignment-app', ['enzi-table'])
.controller('appController', ['$scope', function ($scope) {
    $scope.fields = [
				{ name: 'Id', label: 'Id', type: 'number', required: true },
				{ name: 'FirstName', label: 'First Name', type: 'text', required: true },
                { name: 'LastName', label: 'Last Name', type: 'text', required: true },
				{ name: 'Email', label: 'Email', type: 'email', required: false },
				{ name: 'MailingStreet', label: 'Street', type: 'textarea' },
                { name: 'MailingCity', label: 'City', type: 'text' },
		        { name: 'DOB', label: 'Date of Birth', type: 'date', required: false },
				{ name: 'MailingCountry', label: 'Country', type: 'picklist', required: false, picklistValues: ['India', 'United States'] },
				{ name: 'MailingState', label: 'State', type: 'picklist', required: false, picklistValues: { "India": ['Gujarat', 'Maharashtra'], 'United States': ['California', 'New York'] }, dependsOn: 'Country' },
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

    $scope.records = [{ Id: 1, FirstName: 'User', LastName: '1', Email: 'user1@test.com', MailingStreet: 'Street1', MailingCity: 'City1', DOB: new Date(), MailingCountry: 'India', MailingState: 'Maharashtra' },
    { Id: 2, FirstName: 'User', LastName: '2', Email: 'user2@test.com', MailingStreet: 'Street1', MailingCity: 'City1', DOB: new Date(), MailingCountry: 'India', MailingState: 'Maharashtra' },
    { Id: 3, FirstName: 'User', LastName: '3', Email: 'user3@test.com', MailingStreet: 'Street1', MailingCity: 'City1', DOB: new Date(), MailingCountry: 'India', MailingState: 'Maharashtra' }];

    $scope.DeleteRecord = function (record, onsuccess) {
        //Use code to delete record from Salesforce and on success call the onsuccess function
        onsuccess();
    }

    $scope.EditRecord = function (record, onsuccess) {
        //Use code to edit record from Salesforce and on success call the onsuccess function
        var recordUpdated = angular.copy(record);
        recordUpdated.LastName += 2;
        onsuccess(recordUpdated);
    }
}])