$(document).ready(function () {
    callExport();
    $('#selecttype').change(function () {
        $('#headertitle').text($(this).val() + ' Summary Report');
        var type ='ProjectHtml'
        if ($(this).val() === "Project")
            type = 'ProjectHtml';
        else if ($(this).val() === "Store")
            type = 'StoreHtml';
        else if ($(this).val() === "Structure")
            type = 'StructureHtml';
        else if ($(this).val() === "Sub Structure")
            type = 'SubStructureHtml';
        else if ($(this).val() === "Asset Type")
            type = 'AssetTypeHtml';
        else if ($(this).val() === "Asset Specification")
            type = 'AssetSpecificationHtml';
        $.ajax({
            url: 'SummaryReport/' + type,
            type: 'Post',
            success: function (data) {
                $('#edittable').empty();
                $('#edittable').append(data); 
                callExport();
            },
            error: function (xhr, ajaxOptions, thrownError) { }
        })
    });    
});

function callExport() {
    setTimeout(function () {
        var header = $('#headertitle').text();
        // [ HTML5 Export Buttons ]
        $('#summaryTable').DataTable({
            dom: 'Bfrtip',
            buttons: [{
                extend: 'pdf',
                pageSize: 'LEGAL',
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
