/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var matrix = [[4, 1, 3, 2], [2, 4, 1, 3]]; // Matrix with card values
var colors = ["yellow", "blue", "red", "lightgreen", "black"]; // Colors for each value
var selected = null; // Card selected

/*
 * Card
 */
function Card(value) {
    this.value = value || 0;
    this.color = colors[value];

    /* Create Html to represent this card */
    this.createHtml = function() {
        var card = $("<div class='flipper card'></div>");
        card.append("<div class='front'></div>");
        card.append("<div class='back'></div>");
        return card;
    };

    /* Refer to the html inside the ojbect */
    this.html = this.createHtml();

    /* Draw the card in $(".geral") stage */
    this.draw = function(lin, col) {
        this.html.attr("data-line", lin);
        this.html.attr("data-col", col);
        if (col === 0) {
            this.html.addClass("clean");
        }
        $(this.html).children(".back").css("background", this.color);
        $(".geral").append(this.html);
    };

    /* Verify if this card value is equal the value of the card selected before */
    this.verify = function(card) {
        if (this.value === card.value) {
            this.unsetClickHandler();
        } else {
            var thisCard = this;
            card.setClickHandler();
            sleep(1000, function() {
                $(card.html).toggleClass("flipped");
                $(thisCard.html).toggleClass("flipped");
            });
        }
        selected = null;
    };

    /* Handler for click event */
    this.click = function() {
        if (selected === null) {
            this.unsetClickHandler();
            selected = this;
        } else {
            this.verify(selected);
        }
    };

    /* Set the Click Handler */
    this.setClickHandler = function() {
        var card = this;
        this.html[0].onclick = function() {
            $(this).toggleClass("flipped");
            card.click();
        };
    };

    /* Unset the Click Handler */
    this.unsetClickHandler = function() {
        this.html[0].onclick = function() {
        };
    };
}

/* Sleep and execute callback function */
function sleep(millis, callback) {
    setTimeout(function()
    {
        callback();
    }
    , millis);
}

/* Loop to create the cards and to draw on stage */
for (i = 0; i < matrix.length; i++) {
    for (j = 0; j < matrix[i].length; j++) {
        var card = new Card(matrix[i][j]);
        card.draw(i, j);
        card.setClickHandler();
    }
}