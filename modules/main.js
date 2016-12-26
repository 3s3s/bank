const $ = require('jquery');

$(function() {
    
    $('#btnContinue').click(function(e) {
        $('#table_sber').append('<tr><td></td><td>111</td></tr>');
        $('#table_vtb').append('<tr><td></td><td>222</td></tr>');
    });
    
});


//browserify --debug ~/workspace/modules/main.js -s htmlEvents > ~/workspace/site/js/main.js