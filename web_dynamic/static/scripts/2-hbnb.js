$(document).ready(function () {
    const dict = {};
    $('.amenities input[type=checkbox]').change(function (e) { 
        e.preventDefault();
        let txt = "";
        if (e.target.checked) {
            dict[$(this).parent().attr('data-id')] = $(this).parent().attr('data-name');
        } else if (!e.target.checked) {
            delete dict[$(this).parent().attr('data-id')];
        }
        for (let item in dict) {
            txt += dict[item] + ', ';
        }
        $('.amenities h4').text(txt);
    });

    $.getJSON("http://127.0.0.1:5001/api/v1/status/", (data) => {
            if (data.status === 'OK') {
                $('div#api_status').attr('class', 'available');
            } else {
                $('div#api_status').removeAttr({'class': 'available'});
            }
        }
    );
});