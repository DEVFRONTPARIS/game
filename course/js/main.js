    "use strict";
    document.addEventListener('DOMContentLoaded', function(){
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
        // Ecrire
        game.drawText = function(x,y,text,fsize,color){
            myCanvas.context.font = fsize + 'px "Press Start 2P"';
            myCanvas.context.textAlign = 'left';
            myCanvas.context.fillStyle = color;
            myCanvas.context.fillText(text,x,y);
        };
        
        /* 
                    [  Constructeurs  ]  
                                                */

            // Générateur aléatoire d'images nuage_G()
        game.nuage_G = (function(){
            var Nuage = function(){
                this.telecharges;
                this.number = Math.round(Math.random() * (2 - 0) + 0); // on cherche entre 0 et 2 (nombre de nuages)
                this.element = new Image(); 
                this.element.src = img + sky[this.number]; // on génère un nuage;
                this.element.onload = function(){
                    if(!this.telecharges){
                        this.telecharges = 0;
                    }
                    this.telecharges+=1;
                };  
                // console.log('nuage : ' + this.element.src + ' numéro : ' +  this.number + ' à été crée !');
                // console.log(this.element);
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
                    x : Math.round(Math.random() * (4000 - 0) - 0),
                    y : Math.round(Math.random() * (10 - 0) + 0)
                }; 
                this.size = {
                    x : 800,
                    y : 480
                }; 
                this.sizeA = {
                    x : this.size.x/2,
                    y : this.size.y/2.5
                };                 
            };  
            Nuage.prototype.draw = function(){  
              if((navigator.userAgent.indexOf("MSIE") != -1 ) || (!!document.documentMode == true )) {
                 game.drawImage_simple(this.element, this.movements, this.sizeA, this.position, 0); 
               }else{
                 game.drawImage(this.element, this.movements, this.size, this.origin, this.position, 0);     
               }            
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
            Nuage.prototype.delay = function(){
                setTimeout(function(){
                }, 1000);
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
                // console.log('haie : ' + this.element.src + ' à été crée !');
                // console.log(this.element);  
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
                // console.log('Un personnage : ' + this.element.src + ' à été crée !');
                // console.log(this.element);  
                this.speed = 5;
                this.score = 0;
                this.agreeAction = true; 
                this.actionY = false;
                this.sauter = true;
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
                    x : 0, // Math.round(Math.random() * (300 - 0) - 0)
                    y : 0
                }; 
                this.positionRegistered = {
                    x : 0, 
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
                this.m3_callback = function(fonction, callback){
                    return callback(fonction);
                };
                this.m_3 = function(that){  
                    var that = this;
                    setTimeout(function(){
                        that.origin.x+=that.speed; // -> Vitesse avancement                       
                    }, 6000/60)                             
                    // };
                };       
                this.run = function(){
                    var that = this;
                    setInterval(function(){
                            if(that.count < 4){
                                that.count++;
                                that.movements.x += (that.sizeOrigin.x / that.sizeSprite.x);
                            }
                             // -> On initialise le compteur -> On met notre sprite a 2
                            if(that.movements.x >= (that.sizeOrigin.x / that.sizeSprite.x) * 4){
                                that.count = 0;
                                that.movements.x = (that.sizeOrigin.x / that.sizeSprite.x); 
                            } 
                            if(that.origin.x < myCanvas.canvas.width){
                                that.m_3(that);
                            }                      
                    }, 6000/60); 
                    return this;
                };
                this.scoreSetter = function(num){
                    var that = this;
                    for(var i = 0; i < num; i++){
                        setTimeout(function(){
                            that.score += i/num;
                        }, 1000/30 * i) // 1000/60
                    };
                    return this;
                };
                this.go = function(evt){                   
                    switch(evt.keyCode){
                        case Keys.l: 
                            // console.log('left');
                        break;
                        case Keys.r: 
                            haie.speed += 0.5;
                            player.speed += 1;
                            if(this.count < 4){
                                this.count++;
                                this.movements.x += (this.sizeOrigin.x / this.sizeSprite.x);
                            }
                             // -> On initialise le compteur -> On met notre sprite a 2
                            if(this.movements.x >= (this.sizeOrigin.x / this.sizeSprite.x) * 4){
                                this.count = 0;
                                this.movements.x = (this.sizeOrigin.x / this.sizeSprite.x); 
                            } 
                            if(this.origin.x < myCanvas.canvas.width){
                                var that = this;
                                this.m_3(that);
                            } 
                        break;
                        case Keys.t: 
                            // console.log('top');  
                            // if(this.movements.y){
                            //     this.movements.y -= this.sizeOrigin.y / this.sizeSprite.y;
                            // }                        
                        break;
                        case Keys.b: 
                            // if(this.movements.y <= 720){
                            //     this.movements.y += this.sizeOrigin.y / this.sizeSprite.y;
                            // }
                            // console.log('bottom');                    
                        break;
                        case Keys.space:
                            var that = this;
                            if(this.sauter){
                                this.sauter = false;
                                // -> Le saut = 2 images différentes -> On cible État 1, -> État 2 pour un effet visuel 
                                var m_1 = setTimeout(function(){
                                    // that.movements.x = (that.sizeOrigin.x / that.sizeSprite.x) * 4;
                                    that.position.y -= 65;
                                    that.origin.x+= 20;
                                    // -> On change la position x de la personne pour l'aider à sauter 
                                    var m_2 = setTimeout(function(){
                                        // that.movements.x = (that.sizeOrigin.x / that.sizeSprite.x) * 10;
                                        that.position.y -= 65; 
                                        // On enregistre la position pour savoir si le joueur à sauter 
                                        if(!that.positionRegistered.y && that.actionY){
                                            that.positionRegistered.y = that.position.y; 
                                            that.scoreSetter(Math.round(Math.random() * (100 - 10) + 0));
                                            navigationCV();   
                                        }
                                        that.origin.x+= 20;
                                        // console.log('Bonhomme ' + ' x : ' + that.movements.x  + ', ' + ' y: ' + that.position.y);
                                        setTimeout(function(){
                                        clearTimeout(m_1);
                                        clearTimeout(m_2); 
                                        // On re autorise le saut
                                        that.sauter = true; 
                                        //    that.movements.x = 0;
                                        that.position.y = 0;
                                        // console.log('Bonhomme ' + ' x : ' + that.movements.x  + ', ' + ' y: ' + that.position.y);
                                        },4000/60 * 8);
                                    },3000/60);
                                    // console.log('Bonhomme ' + ' x : ' + that.movements.x  + ', ' + ' y: ' + that.position.y);
                                },2000/60);
                            }
                            // console.log('space');   
                        break;
                        case Keys.enter: 
                            // console.log('enter');                    
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
                            var that = this;
                            // -> Par fonction de callbacl, on stop le timeout de départ
                            this.m3_callback(function(that){
                                this.m_3(that)
                            }, clearTimeout);                        
                        break;
                        case Keys.space : 
                            // this.movements.x = 0;
                            // this.position.y = 0;
                        break;
                    };
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
            gameSound.play();        
            console.log( 'start() exécuté ! ');
            myCanvas.canvas = document.getElementById('myCanvas');
            myCanvas.context = myCanvas.canvas.getContext('2d');
            // Image arrière plan 
            game.background = new Image();
            game.background.src = img + backgroundImage;
            window.requestAnimationFrame(game.mainloop);    
        };
        // document.addEventListener('DOMContentLoaded', game.start);  

            // Nuages       
        var nuage = game.nuage_G();
        var nuage_1 = game.nuage_G();
        var nuage_2 = game.nuage_G();

            // Gestion de mouvrmrnt des nuages
        nuage.speed += 5;
        nuage_1.speed += 3;
        nuage_2.speed += 2;

            // Haies
        var haie = game.haie_G();

            // Player
        var player = game.player_G();  
            // Event                     
            document.addEventListener('keydown', function(evt){
                player.go(evt);        
                evt.preventDefault();            
            });  
            document.addEventListener('keyup', function(evt){
                player.stop(evt);
                evt.preventDefault();            
            });                  
            /*
                ATTENTION : 
                document.addeventlistener('keydown', player.go); ->> Erreur !!!! this de l'objet pointera vers 'document';
                pour éviter cela, créer une fonction anonyme dans l'évènement et déclarer player.go(evt) en lui passant un
                argument à l'intérieur. le this sera donc pointer vers l'objet.
            */      

            // Boucle -> Effacer -> Rafraichir -> Dessiner
        game.mainloop = function(){           
            game.clairContext()
            game.update();
            case_01();
            game.draw();    
            // case_01();
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
            // Text
            game.drawText(myCanvas.canvas.width/2-130,50,'Score : ' + player.score,25,'#fff');
            // myCanvas.context.fillText('Hello world', 50, 100); 
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


        /* 
                [  fonctions / Colisions  ]  
                                                        */   
        var action = true;
        var case_01 = function(){
            var check_x_haie = function(){
                if((player.origin.x + player.position.x) >= (haie.position.x + 30)){
                    return true;
                }
            };
            // si on atteint la hauteur de Haie on autorise par actionY, positionRegistered d'enregistrer la valeur du saut -130
            if((player.origin.x + player.position.x) >= (haie.position.x)){
                player.actionY = true;
            }
            var check_y_player = function(){
                return (player.origin.y + player.position.y);
            };
            // Collision axe des y en hauteur ou dépassement  -> on vérifie si les conditions sont vraies
            if(action && check_x_haie() && player.positionRegistered.y !== -130){
                // On baisse le volume du jeu et fais jouer le volume quand on perd
                winC.volume = 0;
                gameSound.volume = 0.3;
                looseP.play();
                // Perdu
                player.go = function(){};
                perdu.style.display = 'block';
                myCanvas.canvas.className = 'perdu_theme';
                // la haie diaparait
                haie.position.x = 800;
                haie.speed = 0;            
                // Console
                // console.log('Collision axe des Y, veuiller sauter');
                action = false;
            }
                // Fin de oartie -> une fois que la haie sors de la zone de jeu
            if(haie.position.x <= -haie.size.x){ // -150 qui est la largeur de la haie
                // Réinitialisation 
                player.actionY = false;
                player.positionRegistered.y = null;
                // Réinitialisation Haie et personnage
                haie.position.x = 800;
                // Réinitialisation TestDecollision 
                action = true;
                // console.log('fin !');
            }
            // Gestion personnage 
            if(player.origin.x > myCanvas.canvas.width){
                player.origin.x = -150;             
            }
        };

        var btn = document.getElementById('command');
        var menu = document.getElementById('menu');
        var btn_courir = document.getElementById('courir');
        var liste_menu = document.getElementById('menu_list');
        var choix = document.getElementById('choix');
        var perdu = document.getElementById('perdu');
        var fermerFenetre = document.getElementById('close_modal');

        fermerFenetre.addEventListener('click', function(){
            if(menu.style.display === 'block'){
                menu.style.display = 'none';
            }        
            if(choix.style.display === 'block'){
                choix.style.display = 'none';
                liste_menu.style.display = 'block'; 
            }
        });
        btn.addEventListener('click', function(e){
            if(menu.style.display === 'none'){
                menu.style.display = 'block';
            }else{
                menu.style.display = 'none';
            }
            e.stopPropagation;
        });
        btn_courir.addEventListener('click', function(e){
            if(liste_menu.style.display === 'none'){
                liste_menu.style.display = 'block';
                choix.style.display = 'none'
            }else{
                liste_menu.style.display = 'none';
                choix.style.display = 'block';
            }
            e.stopPropagation;
        });

        var element = choix.children[0].children[2].children;
        var autorisation = true;
        for(var i = 0; i < element.length; i++){
            element[i].addEventListener('click', function(){
                if(autorisation){
                    autorisation = false;
                    switch(this.children[0].id){
                        case '1' :
                            player.movements.y = 0;
                            game.start(); 
                            player.run();
                            this.children[0].style.backgroundColor = '#EEEEEE';
                        break;
                        case '2' :
                            player.movements.y = 240;  
                            game.start();     
                            player.run();
                            this.children[0].style.backgroundColor = '#EEEEEE';                                                      
                        break;
                        case '3' :
                            player.movements.y = 480;  
                            game.start();  
                            player.run();
                            this.children[0].style.backgroundColor = '#EEEEEE';                                                         
                        break;
                        case '4' :
                            player.movements.y = 720; 
                            game.start();  
                            player.run();
                            this.children[0].style.backgroundColor = '#EEEEEE';                                                          
                        break;
                        case '5' :
                            player.movements.y = 960; 
                            game.start();  
                            player.run();
                            this.children[0].style.backgroundColor = '#EEEEEE';                                                          
                        break;
                    }
                    setTimeout(function(){
                         menu.style.display = 'none';
                        //  btn.parentNode.parentNode.parentNode.style.display= 'block';                                 
                    },1000/60);
                }
            }); 
        };  

        // NAVIAGTION COMPETENCES 

        var competenceA = 0, countC, maxId = 0;
        var listeCompetences = document.getElementById('cv_competences');
        var competences = listeCompetences.children;
        var totalC = parseFloat(competences.length);
        // on donne un id aux compétences 
        for(i = 0; i < totalC; i++){
            competences[i].id = maxId;
            maxId++;
        };      
        // On cache toutes les compétences 
        for(i = 0; i < totalC; i++){
            if(competences[i].id != competenceA){
                competences[i].style.display = 'none';
            }
        };
        var navigationCV = function(){
                // initialisation de compteur
            if(!countC){
                countC = 0;
            }      
                // cacher les compétences        
            for(i = 0; i < totalC; i++){
                if(competences[i].id == countC){
                    competences[countC].style.display = 'none';
                }
            };
            // on passe à la suivante
            if(countC < (totalC-1)){
                countC++;   
                // Pour eviter les sauts de ligne a cause de pagnication
                for(i = 0; i < totalC; i++){
                    competences[i].style.display = 'none';
                };            
                navigationPagination(countC);
                competences[countC].style.display = 'block';  
                // on joue le son 
                winC.play();              
            }else{
                for(i = 0; i < totalC; i++){
                    if(competences[i].id != 0){
                        competences[i].style.display = 'none';
                    }
                };
                // C'est fini 
                    // vous avez gagné
                var gagner = document.getElementById('gagner');
                    gagner.style.display = 'block';
                    // Enpecher le déclenchement du son "perdu" 
                    looseP.volume = 0;
                    // Baisser le volume de fond
                    gameSound.volume = 0.3;    
                    // Animer le score de fin             
                competences[0].style.display = 'block'; 
                var scoreF = 0;
                var scoreSetter = function(num){
                    for(var i = 0; i < num; i++){
                        setTimeout(function(){
                            scoreF += i/num;
                            competences[0].children[0].children[0].textContent = 'Bravo, score : ' + scoreF + ' Naviguez ici : ';                        
                        }, 1000/30 * i) // 1000/60
                    };
                };             
                scoreSetter(player.score);  
            }                   
        };
       
        var winC = new Audio();
            winC.src = msc+'ok.mp3';

        var looseP = new Audio();
            looseP.src = msc+'loose.mp3';
            looseP.loop = false;        

        var gameSound = new Audio();
            gameSound.src = msc+'running.mp3';


        //  PAGINATION

        var pagination = document.getElementById('pagination');
        var navigationPagination = function(numberP){
            var liP = document.createElement('li');
            var aP = document.createElement('a');
            var liContent = document.createTextNode(numberP);
            aP.setAttribute('href', '#');
            liP.appendChild(aP);
            liP.setAttribute('id', numberP);
            aP.appendChild(liContent);
            pagination.appendChild(liP);
            for(i=0; i<pagination.children.length;i++){
                // Coloris la première compétence débloqué
                pagination.children[0].children[0].style.color = '#fff';
                pagination.children[0].children[0].style.backgroundColor = '#000';             
                pagination.children[i].addEventListener('click', function(){
                    for(i = 0; i < totalC; i++){
                        if(competences[i].id != this.id){
                            competences[i].style.display = 'none';
                        }
                    };
                    competences[this.id].style.display = 'block'; 

                    for(i = 0; i < this.parentNode.children.length; i++){
                                // On enlève coloris sur les touches non cliqués
                            this.parentNode.children[i].children[0].style.color = '#000';
                            this.parentNode.children[i].children[0].style.backgroundColor = '#fff';
                    };  
                    // Coloris sur onglet cliqué
                    this.children[0].style.color = '#fff';
                    this.children[0].style.backgroundColor = '#000';                              
                });
            };        
        };    
        
        // Rejouer 
        var replay = document.getElementById('replay');
            replay.addEventListener('click', function(){
                location.reload();
            });
        // Rejouer 
        var replayW = document.getElementById('replayW');
            replayW.addEventListener('click', function(){
                location.reload();
            });
        }());
    }); 
