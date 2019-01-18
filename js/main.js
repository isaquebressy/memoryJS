/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Game() {
    this.init = function (level) {
        this.clean();
        this.level = level;
        this.matrix = new Array();
        this.cards = new Array();
        this.colors = ["yellow", "blue", "red", "lightgreen", "black", "orange", "darkblue", "white", "brown", "pink"];
        this.selected = null;
        this.clicks = 0;
        this.matches = 0;

        this.linhas = Math.floor(Math.sqrt(this.getPairsNumber(level) * 2));
        this.colunas = Math.ceil(this.getPairsNumber(level) * 2 / this.linhas);
        
        this.fillDeck(getPairsNumber(level));
        this.shuffle(this.cards);
        this.createSpaces(this.linhas, this.colunas);
        this.fillMatrix(this.linhas, this.colunas);
        this.draw();
    };

    this.clean = function() {
        $(".geral").empty();
    };

    this.getPairsNumber = function (level) {
        return (level <= 2) ? level + 2 : level + 2 + this.getPairsNumber(level - 4); 
    }

    this.shuffle = function (o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    };

    this.fillDeck = function (pairs) {
        for (var c = 1; c <= pairs; c++) {
            this.cards.push(c);
            this.cards.push(c);
        }
    };
    
    this.createSpaces = function (rows, columns) {
        for (i = 0; i < rows; i++) {
            this.matrix.push(new Array(columns));
        }
    };
    
    this.fillMatrix = function (rows, columns) {
        for (i = 0; i < rows; i++) {
            for (j = 0; j < columns; j++) {
                if (this.cards[i * columns + j]) {
                    this.matrix[i][j] = this.cards[i * columns + j];
                }
            }
        }
    };

    this.newMatch = function() {
        this.matches++;
        if (this.matches >= this.getPairsNumber(this.level)) {
            this.init(this.level +  1);
        }
    }
    
    this.draw = function() {
        /* Loop to create the cards and to draw on stage */
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j]) {
                    var card = new Card(this.matrix[i][j]);
                    card.draw(i, j);
                    card.setClickHandler();
                }
            }
        }
    };

    this.init(0);
    
    return this;
}

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
            game.newMatch();
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
            if (game != null && game != undefined) {
                game.clicks++;
            }
        };
    };

    /* Unset the Click Handler */
    this.unsetClickHandler = function() {
        this.html[0].onclick = function() {
        };
    };
}

var game = Game();

/* Sleep and execute callback function */
function sleep(millis, callback) {
    setTimeout(function()
    {
        callback();
    }
    , millis);
}