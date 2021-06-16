const router = require("express").Router()
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Refresh = require('../models/refresh');

router.post('/',(req,res) => {
     // Authorise request user



     // validate request user
     const{name,email,password} = req.body
     
     if(!name || !email || !password ) {
        return res.status(422).json({error:"all fields are required"})
    }

        // chek if user exist
        User.exists({ email : email }, async (err , reasult) =>{
            if (err) {
                return res.status(500).json({error :'something went wrong'})
            }

            if(reasult){
                return res.status(422).json({error :'user with this email is already exists'}) 
            }
            else{
                // Hash pass 
                const hashedPassword = await bcrypt.hash(password , 10)
                const user = new User({
                            name,
                            email,
                            password:hashedPassword
                        })

                 user.save().then(user => {
               
               
                    //    jwt

                const accessToken = jwt.sign({
                    id: user._id,
                    name: user.name,
                    email: user.email
                },process.env.JWT_TOKEN_SECRET,{ expiresIn:'30s' })

                // refresh token
                const refreshToken = jwt.sign({
                    id: user._id,
                    name: user.name,
                    email: user.email
                },process.env.JWT_REFRESH_SECRET)

               

                 new Refresh({
                    token:  refreshToken

                }).save().then(() => {
                    
                    return res.send({
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        type:'Bearer'
                    })
    

                })
               

                
            }).catch(err =>{
                   return res.status(500).send({error:"something went wrong"})
               })          
            }
        })     

})


module.exports = router 