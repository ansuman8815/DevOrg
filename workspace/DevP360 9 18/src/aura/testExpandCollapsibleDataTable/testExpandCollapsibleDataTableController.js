({
	afterScriptsLoaded : function(component, event, helper) {
    
        var dataSet = [
            {titletext:"Alternate Contact Information",Address:"3BADRESS,2121 8TH AVENUE NEW YORK, NY 10026", Zipcode:"125648"},
            
        ];
         var dataSet2 = [
            
            {titletext:"Alternate Contact Information",Address:"3CADRESS,9568 5TH AVENUE Chicago, CG 26558", Zipcode:"56568"}
        ];
               
        var table = $('#exampleDataTable').DataTable({
             responsive: true,
            //  data: dataSet,
                columns: [
                    
                    { title: "Patient Name" },
                    { title: "Date Of Birth" },
                    { title: "Gender" },
                    { title: "Medicaid ID (CIN)" },
                    { title: "Home Phone" },
                    { title: "Address" },
                    { title: "ZipCode" },
                    { title: "" }
                ],
            
            "fnCreatedRow": function( nRow, aData, iDataIndex ) {
                        
                        $(nRow.childNodes[0]).attr('data-label', 'Patient Name');
                        $(nRow.childNodes[1]).attr('data-label', 'Date Of Birth');
                        $(nRow.childNodes[2]).attr('data-label', 'Gender');
                        $(nRow.childNodes[3]).attr('data-label', 'Medicaid ID (CIN)');
                        $(nRow.childNodes[4]).attr('data-label', 'Home Phone');
                        $(nRow.childNodes[5]).attr('data-label', 'Address');
                        $(nRow.childNodes[6]).attr('data-label', 'ZipCode');
                		$(nRow.childNodes[7]).attr('data-label', '');
                    },
            
            });
        console.log($('#exampleDataTable'));  
        $('#exampleDataTable').on('click', '.details-control', function () {
            console.log("After Click");
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
                $(this).html('+');
            } else {
                format(row.child);
                tr.addClass('shown');
                $(this).html('-');
            }
        });
        
        function format(callback) {
            
            var data =  dataSet;
            var thead = '',  tbody = '';
            for (var key in data[0]) {
                if(key=="titletext")
                    key="";
                thead += '<th>' + key + '</th>';
               
            }
            $.each(data, function (i, d) {
                tbody += '<tr></td><td>Alternate Contact Information</td> <td data-label="Address">' + d.Address + 
                    '</td><td data-label="ZipCode">' + d.Zipcode + '</td></tr>';
            });
             callback($('<table >' + thead + tbody + '</table>')).show();
        }
        $('#exampleDataTable').on('click', '.details-control-2', function () {
            var tr = $(this).closest('tr');
            var row = table.row(tr);
            
            if (row.child.isShown()) {
                row.child.hide();
                tr.removeClass('shown');
                $(this).html('+');
            } else {
                format2(row.child);
                tr.addClass('shown');
                $(this).html('-');
            }
        });
        
        function format2(callback) {
            
            var data =  dataSet2;
            var thead = '',  tbody = '';
            for (var key in data[0]) {
                if(key=="titletext")
                    key="";
                thead += '<th>' + key + '</th>';
               
            }
            $.each(data, function (i, d) {
                tbody += '<tr></td><td>Alternate Contact Information</td> <td data-label="Address">' + d.Address + 
                    '</td><td data-label="ZipCode">' + d.Zipcode + '</td></tr>';
            });
            callback($('<table >' + thead + tbody + '</table>')).show();
        }
    }
})