'use strict';
(function(){
    /* 
                [  Animation Frame  ]  
                                                */

        window.requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    /* 
                [  Clavier  ]  
                                        */
        var Keys = {
            l: 37, r: 39, t: 38, b: 40, enter: 13, space: 32
        };    
            
    /* 
                [  IMAGES  ]  
                                        */

        // Dossier_img
    var msc = '../assets/course/sounds/';
    var img = '../assets/course/sprites/';

        // Sources
    var player = 'player.png';   
    var backgroundImage = 'image_fond.jpg';
    var sky = ['nuage_1.png','nuage_2.png','nuage_3.png'];
    var haie = 'haie.png';
    /* pour cibler une image [ Dossier_img + [Sources] ] */

    /* 
                [  ENVIRONNEMENT  ]  
                                            */

        // Canvas 
    var myCanvas = {
        canvas : undefined,
        context : undefined
    };   
        // Elements Jeu
    var game = {
        background : undefined,
        nuages: [undefined, undefined, undefined]
    };
        // Effacer 
    game.clairContext = function(){
        myCanvas.context.clearRect(0, 0, myCanvas.canvas.width, myCanvas.canvas.height);		
    };
        // Dessiner
    game.drawImage = function(sprite, movements, size, origin, position, rotation){				
        myCanvas.context.save();
        myCanvas.context.translate(position.x, position.y);// canvas 
        myCanvas.context.rotate(rotation);		
        myCanvas.context.drawImage(sprite, movements.x, movements.y, size.x, size.y, origin.x, origin.y, size.x, size.y);
        myCanvas.context.restore();			
    };
    game.drawImage_simple = function(sprite, movements, size, position, rotation){				
        myCanvas.context.save();
        myCanvas.context.translate(position.x, position.y);// canvas 
        myCanvas.context.rotate(rotation);		
        myCanvas.context.drawImage(sprite, movements.x, movements.y, size.x, size.y);
        myCanvas.context.restore();			
    };
    
    /* 
                [  Constructeurs  ]  
                                            */

        // Générateur aléatoire d'images nuage_G()
    game.nuage_G = (function(){
        var Nuage = function(){
            this.number = Math.round(Math.random() * (2 - 0) + 0); // on cherche entre 0 et 2 (nombre de nuages)
            this.element = new Image(); 
            this.element.src = img + sky[this.number]; // on génère un nuage;
            console.log('nuage : ' + this.element.src + ' numéro : ' +  this.number + ' à été crée !');
            console.log(this.element);
            this.speed = 5;               
            this.movements = {
                x : 0,
                y : 0
            };
            this.origin = {
                x : 0,
                y : 0
            };        
            this.position = {
                x : Math.round(Math.random() * (1000 - 0) - 0),
                y : Math.round(Math.random() * (10 - 0) + 0)
            }; 
            this.size = {
                x : 800,
                y : 480
            }; 
        };  
        Nuage.prototype.draw = function(){ 
            game.drawImage(this.element, this.movements, this.size, this.origin, this.position, 0);               
            // game.drawImage_simple(this.element, this.movements, this.size, this.position, 0);               
            return this;
        };   
        Nuage.prototype.animation = function(){
            this.position.x -= this.speed;  
            // Si on arrive hors de l'écran  
            if(this.position.x === 900 || this.position.x <= -800 || this.position.x === -800 && this.position.x < 1000){ // myCanvas.canvas.width
                // Initialisation à 800
                this.position.x = 800; //myCanvas.canvas.width
                this.position.y = Math.round(Math.random() * (10 - 0) + 0); //myCanvas.canvas.width
            }; 
            return this;        
        };         
        return function(){
            return new Nuage();
        };
    }()); 

        // Générateur aléatoire de Haie    
    game.haie_G = (function(){
        var Haie = function(){
            this.element = new Image();
            this.element.src = img + haie;
            console.log('haie : ' + this.element.src + ' à été crée !');
            console.log(this.element);  
            this.speed = 2;                         
            this.movements = {
                x : 0,
                y : 330
            };
            this.origin = {
                x : 0,
                y : 0
            };        
            this.position = {
                x : 800, // Math.round(Math.random() * (800 - 400) - 0)
                y : 0
            }; 
            this.size = {
                x : 150,
                y : 150
            };
        };
        Haie.prototype.draw = function(){ 
            game.drawImage_simple(this.element, this.movements, this.size, this.position);   
            return this;
        };  
        Haie.prototype.animation = function(){
            this.position.x -= this.speed;  
            // Si on arrive hors de l'écran  
            if(this.position.x <= -300){ // myCanvas.canvas.width
                // Initialisation à 800
                this.position.x = 800; //myCanvas.canvas.width
            }; 
            return this;        
        };                  
        return function(){
            return new Haie();
        };
    }()); 

        // Générateur et choix du personnage   
    game.player_G = (function(){
        var NewPlayer = function(){
            this.element = new Image();
            this.element.src = img + player;
            console.log('Un personnage : ' + this.element.src + ' à été crée !');
            console.log(this.element);  
            this.speed = 2;
            this.agreeAction = true; 
            // this.speed = 2; 
            // this.haie_speed = this.speed - 1; 
            this.count = 0;                        
            this.movements = {
                x : 0,
                y : 0
            };
            this.origin = {
                x : 0,
                y : 220
            };        
            this.position = {
                x : Math.round(Math.random() * (300 - 0) - 0),
                y : 0
            }; 
            // Nombre de spriste en y et y
            this.sizeSprite = {
                x : 14,
                y : 5 
            };   
            // Taille d'origine         
            this.sizeOrigin = {
                x : 1960,
                y : 1200 
            };    
            // Taille affiché  -> x : largeur 1960   -> y : hauteur 1200  
            this.size = {
                x : this.sizeOrigin.x / this.sizeSprite.x , 
                y : this.sizeOrigin.y / this.sizeSprite.y
            };
            this.check_possibility = function(arg){
            };          
            this.go = function(evt){
                switch(evt.keyCode){
                    case Keys.l: 
                        console.log('left');
                    break;
                    case Keys.r: 
                        if(this.count < 4){
                            this.count++;
                            this.movements.x += (this.sizeOrigin.x / this.sizeSprite.x);
                        }
                         // -> On initialise le compteur -> On met notre sprite a 2
                        if(this.movements.x >= (this.sizeOrigin.x / this.sizeSprite.x) * 4){
                            this.count = 0;
                            this.movements.x = (this.sizeOrigin.x / this.sizeSprite.x); 
                        } 
                        if(this.origin.x < (myCanvas.canvas.width - 400)){
                            this.origin.x+=5; // -> Vitesse avancement                                
                        } 
                    break;
                    case Keys.t: 
                        console.log('top');  
                        if(this.movements.y){
                            this.movements.y -= this.sizeOrigin.y / this.sizeSprite.y;
                        }                        
                    break;
                    case Keys.b: 
                        if(this.movements.y <= 720){
                            this.movements.y += this.sizeOrigin.y / this.sizeSprite.y;
                        }
                        console.log('bottom');                    
                    break;
                    case Keys.space: 
                        var that = this;
                        // -> Le saut = 2 images différentes -> On cible État 1, -> État 2 pour un effet visuel 
                        var m_1 = setTimeout(function(){
                            that.movements.x = (that.sizeOrigin.x / that.sizeSprite.x) * 4;
                            that.position.y -= 60;
                            // -> On change la position x de la personne pour l'aider à sauter 
                            var m_2 = setTimeout(function(){
                                that.movements.x = (that.sizeOrigin.x / that.sizeSprite.x) * 10;
                                that.position.y -= 60;                                
                                console.log('Bonhomme ' + ' x : ' + that.movements.x  + ', ' + ' y: ' + that.position.y);
                                setTimeout(function(){
                                   that.movements.x = 0;
                                   that.position.y = 0;
                                   clearTimeout(m_1);
                                   clearTimeout(m_2); 
                                   console.log('Bonhomme ' + ' x : ' + that.movements.x  + ', ' + ' y: ' + that.position.y);
                                },3500/60 * 8);
                            },3000/60);
                            console.log('Bonhomme ' + ' x : ' + that.movements.x  + ', ' + ' y: ' + that.position.y);
                        },2000/60);
                        console.log('space');   
                    break;
                    case Keys.enter: 
                        console.log('enter');                    
                    break;
                };
                return this;
            }; 
            this.stop = function(evt){
                var e = evt.keyCode;
                switch(e){
                    case Keys.r : 
                    case Keys.l : 
                        // -> On initialise le compteur -> On met notre sprite a 1
                        this.movements.x = 0;
                        this.count = 0;                    
                    break;
                    case Keys.space : 
                        // this.movements.x = 0;
                        // this.position.y = 0;
                    break;
                };
                // if(e === Keys.r || e === Keys.l){
                //     // -> On initialise le compteur -> On met notre sprite a 1
                //     this.movements.x = 0;
                //     this.count = 0;
                // }
            };
        };
        NewPlayer.prototype.draw = function(){
            game.drawImage(this.element, this.movements, this.size, this.origin, this.position, 0);               
            return this;
        };
        NewPlayer.prototype.choice = function(){
            return this;
        };
        return function(){
            return new NewPlayer();
        };
    }());

    /* 
            [  On Démarre avec start() ]  
                                                */  

    game.start = function(){
        console.log( 'start() exécuté ! ');
        myCanvas.canvas = document.getElementById('myCanvas');
        myCanvas.context = myCanvas.canvas.getContext('2d');
        // Image arrière plan 
        game.background = new Image();
        game.background.src = img + backgroundImage;
        window.requestAnimationFrame(game.mainloop);	
    };
    document.addEventListener('DOMContentLoaded', game.start);  

        // Nuages       
    var nuage = game.nuage_G();
    var nuage_1 = game.nuage_G();
    var nuage_2 = game.nuage_G();

        // Haies
    var haie = game.haie_G();

        // Player
    var player = game.player_G();  
        // Event                     
        document.addEventListener('keydown', function(evt){
            player.go(evt);        
        });  
        document.addEventListener('keyup', function(evt){
            player.stop(evt);
        });                  
        /*
            ATTENTION : 
            document.addeventlistener('keydown', player.go); ->> Erreur !!!! this de l'objet pointera vers 'document';
            pour éviter cela, créer une fonction anonyme dans l'évènement et déclarer player.go(evt) en lui passant un
            argument à l'intérieur. le this sera donc pointer vers l'objet.
        */      

        // Boucle -> Effacer -> Rafraichir -> Dessiner
    game.mainloop = function(){
        console.log(' Haie in object '  + haie.position.x);   // !!!!!!!!!!!nici        
        console.log(' Joueur origine ' + player.origin.x);            
        game.clairContext()
        game.update();
        game.draw();	
        window.requestAnimationFrame(game.mainloop);	
    };

    /* 
            [  Dessin / On Dessine  ]  
                                            */

    game.draw = function(){
        // Backgorund par défaut         
        myCanvas.context.fillStyle = '#b24c40';
        myCanvas.context.fillRect(0, 0, myCanvas.canvas.width, myCanvas.canvas.height);          
        // Backgroud Image      
        myCanvas.context.drawImage(game.background, 0, myCanvas.canvas.height/2, myCanvas.canvas.width, myCanvas.canvas.height, 0 ,-myCanvas.canvas.height/2, myCanvas.canvas.width, myCanvas.canvas.height);
        // Nuages
        nuage.draw();
        nuage_1.draw();
        nuage_2.draw();
        // Ligne blanche        
        myCanvas.context.fillStyle = '#ffffff';
        myCanvas.context.fillRect(0, myCanvas.canvas.height - myCanvas.canvas.height/3.5, myCanvas.canvas.width, 20);  
        // Player
        player.draw();   
        // Haies
        haie.draw();                
    };  

    /* 
            [  Rafraichissement / Animation  ]  
                                                    */
    game.update = function(){      
        nuage.animation();            
        nuage_1.animation();            
        nuage_2.animation();  
        haie.animation();                         
    };

}());