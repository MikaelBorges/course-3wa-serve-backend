module.exports = (app, db)=>{


    // route get des annonces
    const adModel = require('../models/annoncesModel')
    app.get('/', async (req, res, next) => {
        const ads = await adModel.find()
        res.json(ads)
    })
    
    /*---------------------------------------*/

    //une route post pour les annonces
    app.post('/user/ad/:id', async (req, res, next) => {
        let id = req.params.id
        console.log('id', id)
        const { name, description, price } = req.body
        console.log('name', name)
        console.log('description', description)
        console.log('price', price)
        //on crée l'objet du produit
        let newAd = {
            name: name,
            description: description,
            price: price + ' €',
            userId: req.params.id
        }
        console.log('newAd', newAd)
        //on va instancier notre model (schema) avec l'objet
        let annonce = new adModel(newAd)
        //on va sauvegarder le model avec .save()
        annonce.save(function(err, doc){
            if(err){
                console.log("Echec ajout annonce", err)
            }
            console.log("Nouvelle annonce bien ajoutée")
        })
        res.status(200).json({message: "Votre annonce a bien été envoyée"})
    })

    /*---------------------------------------*/

    //une get route edit d'un produit (attention: bien prendre l'id)
    app.get('/editProd/:id', async (req, res, next) =>{
        let id = req.params.id
        try{
            //on récup le produit par son id
            let ad = await adModel.findById(id)
            //si il ne trouve pas de produit
            if(!ad){
                //on retourne une erreur
                res.status(400).json({message: "Ad Not Exist"})
            }
            //on affiche le template du formulaire
            res.render('layout', {template: "editProd", name: "Modification Annonce", annonce: ad, session: req.session})
        }catch(e){
            res.status(500).json({
              message: "Server Error"
            });
        }
        
        
    })

    /*---------------------------------------*/

    //route post editProd
    app.post('/editProd/:id', async (req, res, next) =>{
        let id = req.params.id;
        //on appel une fonction de modification d'un produits (par son id) en lui envoyant un nouvel objet
        await adModel.updateOne({ _id: id }, {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price
        });
        
        //on redirige vers l'admin
        res.redirect('/admin');
    })

    /*---------------------------------------*/

    //une route de suppression d'un produit (attention: bien prendre l'id)
    app.get('/deleteProd/:id', async (req, res, next) =>{
        let id = req.params.id;
        //on appel une fonction de suppression d'un produit (par son id)
        await adModel.findByIdAndDelete(id, function (err) {
          if(err) console.log(err);
          console.log("Successful deletion");
        });
        
        //on redirige vers l'admin
        res.redirect('/admin');
    })

     /*---------------------------------------*/

    //route pour la page admin
    app.get('/admin', async (req, res, next)=>{
        //on récup tous les produits
        let ads = await adModel.find()
        //si il y'a une erreur
        if(!ads){
            //on retourne la page d'admin avec un tableau vide pour les produits
            res.render('layout', {template: 'admin', annonces: [],name: 'Administration', session: req.session})
        }
        //on affiche le template d'admin avec les produits
        res.render('layout', {template: 'admin', annonces: ads, name: 'Administration', session: req.session})
    })
}