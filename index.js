//library
var express = require('express');
var app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false
}));
var multer = require('multer');
var Apples = require('./Models/Apples');
var Users = require('./Models/Users');
app.set('view engine', 'ejs');
app.set('views', './Views');
app.use(express.static("Public"));
app.listen(8080);
//mongo connect
mongoose.connect('mongodb+srv://assingmentNodeJsmainqph12700:pbYWFbTYWs37PMyg@cluster0.hssck.mongodb.net/Apples?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
        if (err) {
            console.log("Mongoose Connect Err" + err);
        } else {
            console.log("Mongoose Connect Successful");
        }
    });
/*storage: hình được up vào upload()
  destination: file cuối cùng (lên server) rồi sẽ đi tiếp về...?
  cb: callback: sau khi upload lên server gọi callback*/
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Public/Upload Images');
    },
    filename: function (req, file, cb) {
        cb(null, Math.random() + Date.now() + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype == "image/png"
            || file.mimetype == "image/jpeg"
            || file.mimetype == "image/jpg"
            || file.mimetype == "image/gif"
            || file.mimetype == "image/bmp") {
            cb(null, true);
        } else {
            return cb(new Error('Only Image are allowed (.png/jpg/gif/bmp)'))
        }
    }
}).single("AppleImage");

app.get("/Login", function (req,res){
   res.render("Login");
});

app.post("/login", function (req, res) {
    var users = Users({
        NameUser: req.body.txtUserName,
        PasswordUser: req.body.txtPassword
    });
    console.log(users);
    res.redirect("/ListApples");
});

//Register
app.post("/register", function (req, res) {
    var users = Users({
        NameUser: req.body.txtUserName,
        PasswordUser: req.body.txtPassword
    });
    users.save(function (err) {
        if (err) {
            res.json({ "result": 0, "errMsg": err });
        } else {
            console.log("register ok");
            res.redirect("./login");
        }
    });
});

app.get("/ListApples", function (req, res) {
    Apples.find(function (err, data) {
        if (err) {
            res.json({"kq": 0, "errMsg": err});
        } else {
            console.log("list");
            res.render("ListApples", {list: data});
        }
    });
});

app.post("/ListApples", function (req, res) {
    upload(req, res, function (err) {
        if (!req.file) {
            res.json({"result": 0, "errMgs": "Not null file"});
        } else {
            //upload file
            if (err instanceof multer.MulterError) {
                res.json({"result": 0, "errMsg": "A Multer error occurred when uploading"});
            } else if (err) {
                res.json({"result": 0, "errMsg": "An unknown error occurred when uploading" + err});
            } else {
                var apples = Apples({
                    NameApple: req.body.txtNameApple,
                    ImageApple: req.file.filename,
                    PricesApple: req.body.txtPricesApple,
                    NotesApple: req.body.txtNoteApple
                });
                apples.save(function (err) {
                    if(req.body.txtNoteApple == ""){
                        req.body.txtNoteApple = "Null";
                    }
                    if (err) {
                        res.json({"result": 0, "errMsg": err});
                    } else {
                        console.log("uploaded");
                        res.redirect("./ListApples");
                    }
                });
            }
        }
    });
});

app.get("/edit/:id", function (req, res) {
    Apples.findById(req.params.id, function (err, char) {
        if (err) {
            res.json({"kq": 0, "errMsg": err});
        } else {
            console.log("edit");
            console.log(char);
            res.render("Edit", {appleEdit: char});
        }
    });
});

app.post("/edit", function (req, res) {
    upload(req, res, function (err) {
        if (!req.file) {
            Apples.updateOne({_id: req.body.ID}, {
                NameApple: req.body.txtNameApple,
                PricesApple: req.body.txtPricesApple,
                NotesApple: req.body.txtNoteApple
            }, function (err) {
                if (err) {
                    res.json({"kq": 0, "errMsg": err});
                } else {
                    console.log("edited");
                    res.redirect("./ListApples");
                }
            });
        } else {
            if (err instanceof multer.MulterError) {
                res.json({"result": 0, "errMsg": "A Multer error occurred when uploading"});
            } else if (err) {
                res.json({"result": 0, "errMsg": "An unknown error occurred when uploading" + err});
            } else {
                Apples.updateOne({_id: req.body.ID}, {
                    NameApple: req.body.txtNameApple,
                    ImageApple: req.file.filename,
                    PricesApple: req.body.txtPricesApple,
                    NotesApple: req.body.txtNoteApple
                }, function (err) {
                    if (err) {
                        res.json({"kq": 0, "errMsg": err});
                    } else {
                        console.log("edited");
                        res.redirect("./ListApples");
                    }
                });
            }
        }
    });
});

app.get("/delete/:id", function (req, res) {
    //deleteOne: delete the first _id found
    Apples.deleteOne({_id: req.params.id}, function (err) {
        if (err) {
            res.json({"result": 0, "errMgs": err});
        } else {
            console.log("deleted");
            res.redirect("../ListApples");
        }
    })
});

// app.get("/addUser", function (req, res) {
//     res.render("Login");
// });
//
// app.post("/addUser", function (req, res) {
//     upload(req, res, function (err) {
//         if (!req.file) {
//             res.json({"result": 0, "errMgs": "Not null file"});
//         } else {
//             //upload file
//             if (err instanceof multer.MulterError) {
//                 res.json({"result": 0, "errMsg": "A Multer error occurred when uploading"});
//             } else if (err) {
//                 res.json({"result": 0, "errMsg": "An unknown error occurred when uploading" + err});
//             } else {
//                 var apples = Apples({
//                     NameApple: req.body.txtNameApple,
//                     ImageApple: req.file.filename,
//                     PricesApple: req.body.txtPricesApple,
//                     NotesApple: req.body.txtNoteApple
//                 });
//                 apples.save(function (err) {
//                     if (err) {
//                         res.json({"result": 0, "errMsg": err});
//                     } else {
//                         console.log("uploaded");
//                         res.redirect("./ListApples");
//                     }
//                 });
//             }
//         }
//     });
// });