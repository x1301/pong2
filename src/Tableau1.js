
class Tableau1 extends Phaser.Scene{

    preload(){
        this.load.image('blue','assets/bluu.jpg');
        this.load.image('pink','assets/metal pink.jpg');
        this.load.image('circle','assets/cercle.png');
        for(let j=1;j<=51;j++){
            this.load.image('backg'+j,'assets/fond/fram-'+j+'.jpg');
        }
        this.load.image('bp','assets/turquoiselight.png')
        this.load.image('pp','assets/pinklight.png')
        this.load.image('bb','assets/whitelight.png')
    }

    getFrames(prefix,length){
        let frames = [];
        for(let i=1;i<=length;i++){
            frames.push({key:prefix+i});
        }
        return frames;
    }

    jeu(){
        this.start =1
        this.text.destroy()
        if (this.start==1) {
            this.foond = this.add.sprite(515,250,'backg');
            this.foond.setDisplaySize(50,50)
            this.anims.create({
                key: 'backgg',
                frames: this.getFrames('backg',51),
                frameRate: 28,
                repeat: -1
            });
            this.foond.play('backgg');
            this.speedX = 0
            while(this.speedX===0){
                this.speedX = 500*Phaser.Math.Between(-1,1)
            }
            this.speedY = Phaser.Math.Between(-750, 750)
            this.maxspeed = 750

            this.balle = this.physics.add.sprite(this.largeur/2, this.hauteur/2, 'circle')
            this.balle.setDisplaySize(20, 20)
            this.balle.body.setBounce(1,1);
            this.balle.body.setAllowGravity(false)

            let particles = this.add.particles('bb');
            let particle=particles.createEmitter({
                alpha: { start: 1, end: 0 },
                scale: { start: 0.25, end: 0.1},
                frequency: 1,
                x: this.balle.x,
                y: this.balle.y,
                blendMode: 'ADD'
            });
            particle.startFollow(this.balle)

            this.haut = this.physics.add.sprite(0, 0, 'blue').setOrigin(0, 0)
            this.haut.setDisplaySize(this.largeur, 20)
            this.haut.body.setAllowGravity(false)
            this.haut.setImmovable(true);
            this.bas = this.physics.add.sprite(0, 480, 'pink').setOrigin(0, 0)
            this.bas.setDisplaySize(this.largeur, 20)
            this.bas.body.setAllowGravity(false)
            this.bas.setImmovable(true);
            this.player1 = this.physics.add.sprite(50, 360, 'blue')
            this.player1.setDisplaySize(20, 100)
            this.player1.body.setAllowGravity(false)

            let particles1 = this.add.particles('bp');
            let particle1 = particles1.createEmitter({
                scale: { start: 0.15, end: 0 },
                frequency: 1,
            });
            particle1.startFollow(this.player1);

            this.player2 = this.physics.add.sprite(920, 360, 'pink')
            this.player2.setDisplaySize(20, 100)
            this.player2.body.setAllowGravity(false)
            this.player1.setImmovable(true)
            this.player2.setImmovable(true)

            let particles2 = this.add.particles('pp');
            let particle2 = particles2.createEmitter({
                scale: { start: 0.15, end: 0 },
                frequency: 1,
            });
            particle2.startFollow(this.player2);

            let me = this;
            this.physics.add.collider(this.player1, this.balle,function(){
                me.rebond(me.player1)
            })
            this.physics.add.collider(this.player2, this.balle,function(){
                me.rebond(me.player2)
            })

            this.physics.add.collider(this.balle, this.bas)
            this.physics.add.collider(this.balle, this.haut)

            this.balle.setMaxVelocity(this.maxspeed,this.maxspeed)

            this.player1Speed = 0
            this.player2Speed = 0

            this.joueurGauche = new Joueur('Player 1','joueurGauche')
            this.joueurDroite = new Joueur('Player 2','joueurDroite')
            this.balleAucentre()
        }
    }

    create(){
        this.hauteur = 500
        this.largeur = 1000
        this.start = 0
        this.text=this.add.text(this.largeur/2-300, 350, 'Press Space To Start').setOrigin(0,0).setFontSize(50)
        this.initKeyboard()
    }

    rebond(players){
        let me = this ;
        let hauteurPlayers = players.displayHeight;

        let positionRelativePlayers = (this.balle.y - players.y);

        positionRelativePlayers= (positionRelativePlayers / hauteurPlayers)
        positionRelativePlayers = positionRelativePlayers*5-1;

        this.balle.setVelocityY(this.balle.body.velocity.y + positionRelativePlayers * 100);

    }

    update(){
        if(this.start==1){
        if(this.balle.x>this.largeur){
            this.win(this.joueurGauche);
        }
        if(this.balle.x<0){
            this.win(this.joueurDroite);
        }
        this.player1.y += this.player1Speed
        this.player2.y += this.player2Speed

        if(this.player1.y<=70){
            this.player1.y=70
        }
        if(this.player1.y>=430){
            this.player1.y=430
        }
        if(this.player2.y<=70){
            this.player2.y=70
        }
        if(this.player2.y>=430){
            this.player2.y=430
        }
     }
    }


    balleAucentre(){
        this.balle.x = this.largeur/2
        this.balle.y = this.hauteur/2
        this.speedX = 0

        this.balle.setVelocityX(Math.random()>0.5?-300:300)
        this.balle.setVelocityY(0)
    }

    /**
     *
     * @param {Joueur} joueur
     */
    win(joueur){
        //alert('Joueur '+joueur.name+' gagne')
        joueur.score ++;
        //alert('Le score est de '+this.joueurGauche.score+' a '+this.joueurDroite.score)
        this.balleAucentre();
    }

    initKeyboard(){
        let me = this
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.player1Speed = -5
                    break;
                case Phaser.Input.Keyboard.KeyCodes.X:
                    me.player1Speed = 5
                    break;
                case Phaser.Input.Keyboard.KeyCodes.J:
                    me.player2Speed = -5
                    break;
                case Phaser.Input.Keyboard.KeyCodes.N:
                    me.player2Speed = 5
                    break;
            }
        });
        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {
                case Phaser.Input.Keyboard.KeyCodes.S:
                    me.player1Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.X:
                    me.player1Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.J:
                    me.player2Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.N:
                    me.player2Speed = 0
                    break;
                case Phaser.Input.Keyboard.KeyCodes.SPACE:
                    if(me.start==0) {
                        me.jeu()
                        break;
                    }
            }
        });
    }
}




