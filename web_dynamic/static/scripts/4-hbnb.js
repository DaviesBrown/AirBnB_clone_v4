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
    function places_search(data) {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: "http://127.0.0.1:5001/api/v1/places_search",
            data: data,
            success: function (response) {
                let article = "";
                for (let i = 0; i < response.length; i++) {
                    article += `<article>
                    <div class="title_box">
                      <h2>${response[i].name}</h2>
                      <div class="price_by_night">$${response[i].price_by_night}</div>
                    </div>
                    <div class="information">
                        <div class="max_guest">${response[i].max_guest} Guest${response[i].max_guest != 1 ? "s" : ""}</div>
                          <div class="number_rooms">${response[i].number_rooms} Bedroom${response[i].number_rooms != 1 ? "s" : ""}</div>
                          <div class="number_bathrooms">${response[i].number_bathrooms} Bathroom${response[i].number_bathrooms != 1 ? "s" : ""}</div>
                        </div>
                        <div class="description">
                        ${response[i].description}
                    </div>
                  </article>`
                }
                $('section.places').html(article);
            }
        });
    }
    places_search("{}")
    $('button').click(() => {
        let a_id = Object.keys(dict)
        console.log(JSON.stringify(a_id))
        places_search(`{"amenities": ${JSON.stringify(a_id)}}`)
    });
});