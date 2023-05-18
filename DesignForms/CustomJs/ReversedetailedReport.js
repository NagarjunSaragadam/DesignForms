$(document).ready(function () {
    //$('#df').dataTable({ searching: false, paging: false, info: false });
    callExport();  
})

function openassetspecdetails(structure, substructure, assettype, storename, storecode, projectname, projectcode) {    
    var header = {
        STRUCTURE: structure,
        SUB_STRUCTURE: substructure,
        ASSET_TYPE: assettype,
        STORE_NAME: storename,
        STORE_CODE: storecode,
        PROJECT_NAME: projectname,
        PROJECT_CODE: projectcode
    };
    $.ajax({
        url: 'ReverseDetailReport/ShowAssetSpec',
        type:'Post',
        data: header,
        success: function (data) {
            $('#storediv').empty();
            $('#storediv').append(data); 
            $('#openmodel').click();
        },
        error: function (xhr, ajaxOptions, thrownError) { }
    })
}

function callExport() {
    setTimeout(function () {
        var header = $('#headertitle').text();
        // [ HTML5 Export Buttons ]
        $('#summaryTable').DataTable({
            dom: 'Bfrtip',
            buttons: [{
                extend: 'pdf',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                },
                footer: true,
                filename: () => header + ` ${new Date()}`,
                title: function () {
                    return header;
                },
                text: '<i class="fas fa-file-pdf"></i>',
            },
            {
                extend: 'excel',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                },
                footer: true,
                filename: () => header + ` ${new Date()}`,
                title: function () {
                    return header;
                },
                text: '<i class="fas fa-file-excel"></i>',
            }],
            searching: false, paging: false, info: false, ordering: false,
        });

        // [ Column Selectors ]
        $('#cbtn-selectors').DataTable({
            dom: 'Bfrtip',
            buttons: [{
                extend: 'copyHtml5',
                exportOptions: {
                    columns: [0, ':visible']
                }
            }, {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: ':visible'
                }
            }, {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 5]
                }
            }, 'colvis']
        });

        // [ Excel - Cell Background ]
        $('#excel-bg').DataTable({
            dom: 'Bfrtip',
            buttons: [{
                extend: 'excelHtml5',
                titleAttr: 'Exporta a EXCEL',
                customize: function (xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    $('row c[r^="F"]', sheet).each(function () {
                        if ($('is t', this).text().replace(/[^\d]/g, '') * 1 >= 500000) {
                            $(this).attr('s', '20');
                        }
                    });
                }
            }]
        });

        // [ Custom File (JSON) ] 
        $('#pdf-json').DataTable({
            dom: 'Bfrtip',
            buttons: [{
                extend: 'pdfHtml5',
                text: 'JSON',
                action: function (e, dt, button, config) {
                    config.filename = $('#headertitle').text();
                    var data = dt.buttons.exportData();
                    $.fn.dataTable.fileSave(new Blob([JSON.stringify(data)]), 'Export.json');
                }
            }]
        });

        $('.btn-group').attr('style', 'float: right;');

    }, 350);
}