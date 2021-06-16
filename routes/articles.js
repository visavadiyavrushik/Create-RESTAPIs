const router = require("express").Router()
const Article = require("../models/article")


router.post("/", async (req, res) => {
	const { title, body, author } = req.body;
	const article = new Article({
		title,
		// req.body.title,
		body,
		// req.body.body,
		author,
		//  req.body.author,
	});
	
	try {
		const document = await article.save();
		return res.status(201).json(document);
	} catch (err) {
		throw err;
	}
});


// read
router.get("/:id", (req, res) => {
	const { id } = req.params;
	Article.findOne({ _id: id }, (err, document) => {
		if (err) {
			throw err;
		}
		if (document) {
			return res.json(document);
		} else {
			return res.status(404).json({ error: "article not found" });
		}
	});
});


// // update 
router.patch("/:id", (req, res) => {
	const { id } = req.params;
	const { title, body, author } = req.body;

	Article.findOne({ _id: id }, (err, document) => {
		if (err) {
			throw err;
		}
		if (document) {
			Article.updateOne({ _id: id },
				{
					title,
					body,
					author,
				}).then(status => {
				    return res.json(req.body);
			    }).catch(err =>{
                    throw err;
                 })
		} else {
			return res.status(404).json({ error: "article not found" });
		}
	});
});


// // fetch
router.get('/', (req,res) =>{
    
    Article.find((err,articles)=>{
        if(err){
            throw err
        }
        return res.json(articles)
    })
});


// // delete
router.delete('/:_id',(req,res) =>{
    const { _id } = req.params 
    Article.deleteOne({ _id }).then((status)=>{
        return res.json({ deletedID: _id})
    }).catch(err =>{
        return res.status(500).json({ error:"somthing went wrong"})
    })
})

module.exports = router;
