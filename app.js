//VARIABLE DECLARATION
var express =       require("express"),
    app =           express(),
    ejs =           require("ejs"),
    mongoose =      require("mongoose"),
    bodyParser =    require("body-parser"),
methodOverrride =   require("method-override"),
expressSanitizer =  require("express-sanitizer");
    
//APP CONFIG    
mongoose.connect("mongodb://localhost/restful_blog_app",  { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverrride("_method"));


//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

//Blog.create({
 //   title: "Test Blog",
   // image: "https://cdn.pixabay.com/photo/2014/05/02/21/49/home-office-336373_960_720.jpg",
    //body: "Hello this is a blog post"
//});
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});
//RESTFUL ROUTES
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err)
            {
                console.log(err);
            }
        else
            {
                res.render("index", {blogs: blogs});
            }
    });
});
app.get("/blogs/new", function(req, res){
    res.render("new");
});
//CREATE BLOG
app.post("/blogs", function(req, res){
    //SANITIZES THE INPUT - ALLOWED HTML, THIS MAKES SURE NO SCRIPT CAN BE RUN FROM THE INPUT
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err)
            {
                //RENDERS FORM AGAIN IF ERROR OCCURS
                res.render("new");
            }
        else
            {
                //REDIRECT TO INDEX
                res.redirect("/blogs");
            }
    });
});
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            {
                res.redirect("/blogs");
            }
        else
            {
                res.render("show" ,{blog: foundBlog});
            }
    });
});
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err)
            {
                res.redirect("/blogs");
            }
        else
            {
                res.render("edit" ,{blog: foundBlog});
            }
    });
});
//UPDATE ROUTE  
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err)
            {
                res.redirect("/blogs");
            }
        else
            {
                res.redirect("/blogs/" + req.params.id);
            }
    });
});
//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
        Blog.findByIdAndRemove(req.params.id, function(err){
            if(err)
                {
                    res.redirect("/blogs");
                }
            else
                {
                    res.redirect("/blogs");
                }
        });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog App is Online!")
});