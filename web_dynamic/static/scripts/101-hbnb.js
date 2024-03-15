
$(document).ready(function(){
    const states = {};
    const amenities = {};
    const cities = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    $.getJSON("http://localhost:5001/api/v1/status", (response) => {
        console.log(response);
        if (response.status === 'OK') {
            $("div#api_status").addClass('available');
        } else {
            $("div#api_status").removeClass('available');
        }
    });

    $('input[type="checkbox"]').change(function() {
        let refClass;
            switch ($(this).attr('id')) {
                case "states_info":
                    refClass = states;
                    break;
                case "amenities_info":
                    refClass = amenities;
                    break;
                case "cities_info":
                    refClass = cities;
                    break;
            }
            if ($(this).prop('checked')) {
                refClass[$(this).data('name')] = $(this).data('id');
            } else {
            delete refClass[$(this).data('name')];
            }
        if ($(this).attr('id') === "amenities_info") {
        $(".amenities h4").text(Object.keys(amenities).join(", "));
        } else {
            $(".locations h4").text(Object.keys(states).concat(Object.keys(cities)).join(", "));  
        }
    });
    
     $.post({
            url: "http://localhost:5001/api/v1/places_search",
            data: JSON.stringify({}),
            headers: {
                "Content-Type": "application/json"
            },
            success: addToHtml,
            dataType: "json"
        });
    

    $('button').click(function () {
        /*if (List.length === 0) {
            $("section.places").empty();
            return;
        }*/
        $.post({
            url: "http://localhost:5001/api/v1/places_search",
            data: JSON.stringify({
                amenities: Object.values(amenities),
                states: Object.values(states),
                cities: Object.values(cities)
            }),
            headers: {
                "Content-Type": "application/json"
            },
            success: addToHtml,
            dataType: "json"
        });
    });

    function addToHtml(response) {
        $("section.places").empty();
        response.forEach(place => {
            const article = $(`
                <article>
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">$${place.price_by_night}</div>
                    </div>
                    <div class="information">
                        <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                        <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                        <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
                    </div>
                    <div class="description">
                        ${place.description}
                    </div>
                    <div class="reviews" data-place="${place.id}">
                        <h2>Reviews <span class="toggle_review">show</span></h2>
                        <ul></ul>
                    </div>
                </article>`
            );
            $("section.places").append(article);
            const reviewsSection = article.find('.reviews');
            const toggleButton = reviewsSection.find('.toggle_review');
            toggleButton.click(function() {
                const reviewList = reviewsSection.find('ul');
                if (reviewList.is(':visible')) {
                    reviewList.hide();
                    toggleButton.text('show');
                } else {
                    getReviews(place.id, reviewList, toggleButton);
                }
            });
        });
    }
    
    function getReviews(placeId, reviewList, toggleButton) {
        $.getJSON(
            `http://localhost:5001/api/v1/places/${placeId}/reviews`,
            (data) => {
                reviewList.empty();
                data.forEach((review) => {
                    $.getJSON(
                        `http://localhost:5001/api/v1/users/${review.user_id}`,
                        (user) => {
                            const reviewDate = new Date(review.created_at);
                            const formattedDate = `${reviewDate.getDate()} ${months[reviewDate.getMonth()]} ${reviewDate.getFullYear()}`;
                            const reviewItem = $(`
                                <li>
                                    <h3>From ${user.first_name} ${user.last_name} the ${formattedDate}</h3>
                                    <p>${review.text}</p>
                                </li>`
                            );
                            reviewList.append(reviewItem);
                        }
                    );
                });
                reviewList.show();
                toggleButton.text('hide');
            }
        );
    }
});    