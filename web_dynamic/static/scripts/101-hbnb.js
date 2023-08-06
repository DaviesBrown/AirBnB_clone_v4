$(document).ready(function () {
    const amenities_dict = {};
    const state_dict = {};
    const city_dict = {};
    function addToDict(input, text) {
        $(input).change(function (e) { 
            e.preventDefault();
            let txt = "";
            if (e.target.checked) {
                amenities_dict[$(this).parent().attr('data-id')] = $(this).parent().attr('data-name');
            } else if (!e.target.checked) {
                delete amenities_dict[$(this).parent().attr('data-id')];
            }
            for (let item in amenities_dict) {
                txt += amenities_dict[item] + ', ';
            }
            $(text).text(txt);
        });    
    }
    addToDict('.amenities > div > ul > li > input[type=checkbox]', '.amenities h4');
    
    addToDict('.locations > div > ul > li > input[type=checkbox]', '.locations h4');
    
    addToDict('.locations > div > ul > li > ul > li > input[type=checkbox]', '.locations h4');
    

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
                        <div class=reviews>
                            <h2>2 Reviews</h2><span>Show</span>
                            <ul></ul>
                        </div>
                    </div>
                  </article>`
                      place_review(response[i].place_id)
                }
                $('section.places').html(article);
            }
        });
    }
    function place_review(p_id) {
        $('.reviews span').click(() => {
            let review = "";
            //fetch places review by place id
            $.getJSON(`http://127.0.0.1:5001/api/v1/places/${p_id}/reviews`, (data) => {
                for (let i = 0; i < data.length; i++) {
                    $.getJSON("/users/${data.user_id}", (user) => {
                            
                        review += `
                        <li>
                        <h3>From ${user.first_name} ${user.last_name} the ${data.updateAt}</h3>
                        <p>${data.text}</p>
                        </li>
                        `
                    });
                }
                $('.reviews ul').html(reviews);
            });
        });
    }
    $('.reviews button').click(function (e) { 
        e.preventDefault();
        $('.reviews ul').toggle();
    });
    places_search("{}")
    $('button').click(() => {
        let a_id = Object.keys(amenities_dict);
        let c_id = Object.keys(city_dict);
        let s_id = Object.keys(state_dict);
        places_search(`{
            "amenities": ${JSON.stringify(a_id)},
            "cities": ${JSON.stringify(c_id)},
            "states": ${JSON.stringify(s_id)}
        }`);
    });
});