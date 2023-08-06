$(document).ready(function () {
    const amenities_dict = {};
    const state_dict = {};
    const city_dict = {};
    $('.amenities > div > ul > li > input[type=checkbox]').change(function (e) { 
        e.preventDefault();
        let txt = "";
        if (e.target.checked) {
            console.log($(this).parent().attr('data-name'))
            amenities_dict[$(this).parent().attr('data-id')] = $(this).parent().attr('data-name');
        } else if (!e.target.checked) {
            delete amenities_dict[$(this).parent().attr('data-id')];
        }
        for (let item in amenities_dict) {
            txt += amenities_dict[item] + ', ';
        }
        $('.amenities h4').text(txt);
    });
    $('.locations > div > ul > li > input[type=checkbox]').change(function (e) { 
        e.preventDefault();
        let txt = "";
        if (e.target.checked) {
            console.log($(this).parent().attr('data-name'))
            state_dict[$(this).parent().attr('data-id')] = $(this).parent().attr('data-name');
        } else if (!e.target.checked) {
            delete state_dict[$(this).parent().attr('data-id')];
        }
        for (let item in state_dict) {
            txt += state_dict[item] + ', ';
        }
        $('.locations h4').text(txt);
    });
    $('.locations > div > ul > li > ul > li > input[type=checkbox]').change(function (e) { 
        e.preventDefault();
        let txt = "";
        if (e.target.checked) {
            city_dict[$(this).parent().attr('data-id')] = $(this).parent().attr('data-name');
        } else if (!e.target.checked) {
            delete city_dict[$(this).parent().attr('data-id')];
        }
        for (let item in city_dict) {
            txt += city_dict[item] + ', ';
        }
        $('.locations h4').text(txt);
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
        let a_id = Object.keys(amenities_dict)
        let c_id = Object.keys(city_dict)
        let s_id = Object.keys(state_dict)
        places_search(`{
            "amenities": ${JSON.stringify(a_id)},
            "cities": ${JSON.stringify(c_id)},
            "states": ${JSON.stringify(s_id)}
        }`)
    });
});