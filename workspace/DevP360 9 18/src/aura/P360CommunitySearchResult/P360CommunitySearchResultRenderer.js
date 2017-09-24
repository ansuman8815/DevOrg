({
    // Your renderer method overrides go here
    afterRender: function (component, helper) {
        var getresult = component.get("v.res");
        var resultset =  JSON.stringify(getresult);
        var jsdata = JSON.parse(resultset);
        $.fn.DataTable.ext.pager.numbers_length = 5;
        $('#searchResult')
        .on( 'search.dt', function () { getNumFilteredRows("searchResult"); } )
        .dataTable({
            aaData :jsdata,
            aoColumns :
            [
                { "mDataProp": "name", "bSortable": true,
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 } 
                },
                { "mDataProp": "dob","bSortable": true,
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 } 
                },
                { "mDataProp": "gender", 
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 }
                },
                { "mDataProp": "cin",
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 } 
                },
                { "mDataProp": "homephone",
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 } 
                },
                { "mDataProp": "streetaddress",
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 } 
                },
                { "mDataProp": "mailingpostalcode",
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 } 
                },
                { "mDataProp": "sourceSystem",
                  "mRender": function(jsdata, type, full) {
                     return '<p>' + jsdata + '</p>';
                 } 
                },
                
                { "mDataProp": "",
                  "mRender": function(jsdata, type, full) {
                      var profUrl = $A.get('$Resource.P360CommunityIcons') + '/expand.png';
                      return '<p class="expandIconMob">'+
                      		'<img title="Click to expand" src="' + profUrl + '" /></p>';
                     } 
                }
            ], 
            "initComplete": function(settings, json) {
                var spinner = document.getElementById("Loadingspinner");
                $A.util.addClass(spinner, "displayNone");
                var searchResultDiv =  document.getElementById("searchResultDiv");
                $A.util.addClass(searchResultDiv, "displayBlk");
            },
            "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                $(nRow.childNodes[0]).attr('data-label', 'Patient Name');
                $(nRow.childNodes[1]).attr('data-label', 'Date Of Birth');
                $(nRow.childNodes[2]).attr('data-label', 'Gender');
                $(nRow.childNodes[3]).attr('data-label', 'Medicaid ID (CIN)');
                $(nRow.childNodes[4]).attr('data-label', 'Home Phone Number');
                $(nRow.childNodes[5]).attr('data-label', 'Address');
                $(nRow.childNodes[6]).attr('data-label', 'Zip Code');
                $(nRow.childNodes[7]).attr('data-label', 'Source');
                $(nRow.childNodes[8]).attr('data-label', 'Expand');
            },
            "sPaginationType": "full_numbers",
            "bInfo": false,
            "sDom": '<"top"flp>rt<"bottom"ilp><"clear">',
            "bSortable": true,
            "processing": true,
            "bSearchable": true ,
            "oLanguage": 
            {
                "sSearch": "Find: ",
                "oPaginate": 
                {
                    "sNext": '&gt',
                    "sPrevious": '&lt'
                }
            }
        });
        
        function getNumFilteredRows(id){
            var info = $('#' +id).DataTable().page.info();
            var recordsDisplay = info.recordsDisplay;
            var recordsTotal = info.recordsTotal;
            var filter = component.set("v.filteredCount",recordsDisplay);
            var total = component.set("v.totalCount",recordsTotal);
            if($(".dataTables_filter input").val().length > 0){
                $('.filtercountVal').css('display','inline-block');
                $('.countVal').css('display','none');
            }
            else{
                $('.filtercountVal').css('display','none');
                $('.countVal').css('display','inline-block');
            }  
        }
        $('.expandIconMob').click(function (ev) {
            var tr = $(this).closest('tr');
            var row = $('#searchResult').DataTable().row(tr);
            var profUrl = $A.get('$Resource.P360CommunityIcons') + '/expand.png';
            var profUrlColl = $A.get('$Resource.P360CommunityIcons') + '/collapse.png';
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
                $(this).html('<img  title="Click to expand" src="' + profUrl + '" />');
            } else {
              row.child( format(row.data())).show(); 
                tr.addClass('shown');
                $(this).html('<img src="' + profUrlColl + '" />');
           //     var count = $('#innerID').children('tr').length;
             //   console.log("count");
            //console.log(count);
            
                				





                
                
                
            }
        });
        function format(t) {  
            console.log('in format');
            var data =  t.lstChildAccounts;
            var thead = '',  tbody = '';
            
            //var tblHead = '<th>Alternate Contact Information</th><th>Patient Name</th><th>Date Of Birth</th><th>Home Phone</th><th>Address</th><th>Zip Code</th><th>Source System</th>';
            var tblHead = '<th>Patient Name</th><th>Date Of Birth</th><th>Home Phone</th><th>Address</th><th>Zip Code</th><th>Source System</th>';
            console.log("tblHead"+tblHead);
  
  
            
            $.each(data, function (i, d) {
               var phoneNo = '';
               var address = '';
               var zipCode = '';
               var sourceSystem = '';
               var patientName ='';
               var dob ='';
               
              
                if (typeof d.Account.Phone != 'undefined')
                    phoneNo = d.Account.Phone;
                if (typeof d.MailingStreet!= 'undefined')
                    address = d.MailingStreet ;
                if (typeof d.MailingPostalCode != 'undefined')
                    zipCode = d.MailingPostalCode;
                if (typeof d.Account.HealthCloudGA__SourceSystem__c != 'undefined')
                    sourceSystem = d.Account.HealthCloudGA__SourceSystem__c;
                if (typeof d.Account.First_Name__c != 'undefined')
                    patientName = d.Account.Last_Name__c+', '+d.Account.First_Name__c ;
                if (typeof d.Account.Date_of_Birth__c != 'undefined'){
                  	 var d1 = new Date(d.Account.Date_of_Birth__c);
                  	 // dob = ("0" + (d1.getMonth() + 1)).slice(-2)+'/'+("0" + (d1.getDate() + 1)).slice(-2)+'/'+d1.getFullYear();
                	 //dob=d.Account.Date_of_Birth__c;
                	 var day = new Date(Date.parse(d.Account.Date_of_Birth__c)).getUTCDate();
                     dob = ("0" + (d1.getMonth() + 1)).slice(-2)+'/'+("0" + day).slice(-2)+'/'+d1.getFullYear();
                }
              
                
                
                
               	tbody += '<tr>' 
               			+ '<td data-label="Patient Name">' + patientName + '</td>'
               			+ '<td data-label="Date of Birth">' + dob + '</td>'
						+ '<td data-label="Home Phone">' + phoneNo + '</td>'
						+ '<td data-label="Address">' + address + '</td>'
						+ '<td data-label="Zip Code">' + zipCode + '</td>'
               			+ '<td data-label="Source System">' + sourceSystem + '</td>'
               
            });
   			  var innerTableCreated = '<table id="innerID">' + tblHead + tbody + '</table>';
          /* if($('#innerID tr')){
                var rowCount = $('#innerID tr').length;
                 console.log(rowCount);
                if(rowCount<=0){
                    console.log(rowCount);
                     console.log("id all");
                    console.log(this);
                    $(this).hide();
                }
  }
            else{
                console.log("NO id at all");
            }*/
/*              var count = $('#innerID').children('tr').length;
            console.log(count);*/
            
            // Initialize your table
var table = $('#innerID').dataTable();

// Get the total rows
console.log(" Get the total rows");
console.log(table.fnGetData().length);
              return innerTableCreated;
           
        }
        $('.anchorClass').click(function (ev) {
            if(this.name.split(':')[1]=='true'){
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": "/patientdetail?patientid="+this.name.split(':')[0]+"&empi="+this.value
                });
                urlEvent.fire();
            }else{
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                     mode: 'dismissible',
                     duration: 5000,
                    "message": "The patient you selected has not yet granted your organization consent to access health information through Patient 360."
                });
                toastEvent.fire();
              /* var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": "/patientdetail?patientid="+this.name.split(':')[0]+"&empi="+this.value
                });
                urlEvent.fire();
               */
            }
        });
    }    
})