$(document).ready(function () {
    const dict = {}
    $('.amenities input[type=checkbox]').change(function (e) { 
        e.preventDefault();
        let txt = "";
        if (e.target.checked) {
            dict[$(this).parent().attr('data-id')] = $(this).parent().attr('data-name')
        } else if (!e.target.checked) {
            delete dict[$(this).parent().attr('data-id')]
        }
        console.log(dict)
        for (let item in dict) {
            txt += dict[item] + ', ';
        }
        $('.amenities h4').text(txt);
    });
});